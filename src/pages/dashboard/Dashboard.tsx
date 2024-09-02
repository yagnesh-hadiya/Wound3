import { Card, CardBody, Col, Row } from "reactstrap";
import calendarIcon from "../../assets/calendar-icon.svg";
import CustomSelect from "../../components/custom/CustomSelect";
import DataTable, { TableColumn } from "react-data-table-component";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import Loader from "../../components/custom/CustomSpinner";
import { useEffect, useState, useCallback } from "react";
import { capitalize, formatCurrentDate, showToast } from "../../helpers";
import { SelectOption } from "../../types/Index";
import { getUserId } from "../../helpers/tokens";
import {
  getDashboardCount,
  getLatestScanList,
} from "../../services/ManageDashboardServices";
import CustomPagination from "../../components/custom/CustomPagination";
import {
  DashboardScanCountType,
  LastScanListType,
} from "../../types/ManageDashboardType";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/custom/CustomBtn";
import CustomMainCard from "../../components/custom/CustomCard";
import { getFacilityList } from "../../services/ManageFacilityServices";

const Dashboard = () => {
  const navigate = useNavigate();
  const formattedDate = formatCurrentDate(new Date());
  const [dashboardCount, setDashboardCount] =
    useState<DashboardScanCountType>();
  const [lastScanList, setLastScanList] = useState<LastScanListType[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<SelectOption | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [facilities, setFacilities] = useState<SelectOption[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getFacilityList();
      const facilityOptions = [
        { value: "ALL", label: "ALL" },
        ...data.map(({ id, value }: { id: number; value: string }) => ({
          value: id,
          label: value,
        })),
      ];
      setFacilities(facilityOptions);
      setSelectedFacility(facilityOptions[0] || null);
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    const userId = await getUserId();
    setUserId(userId);
  }, []);

  useEffect(() => {
    fetchUserInfo();
    fetchFacilities();
  }, [fetchUserInfo, fetchFacilities]);

  useEffect(() => {
    const fetchDashboardCount = async () => {
      if (!selectedFacility?.value || !userId) return;
      try {
        setLoading(true);
        const { data } = await getDashboardCount(
          selectedFacility.value.toString() == "ALL"
            ? null
            : selectedFacility.value.toString(),
          userId
        );
        setDashboardCount(data);
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardCount();
  }, [selectedFacility, userId]);

  useEffect(() => {
    const fetchLatestScans = async () => {
      if (!selectedFacility?.value) return;
      try {
        setLoading(true);
        const { data, totalRecords } = await getLatestScanList(
          perPage,
          pageNo,
          selectedFacility.value.toString() == "ALL"
            ? null
            : selectedFacility.value.toString()
        );
        setLastScanList(data);
        setTotalRecords(totalRecords);
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestScans();
  }, [selectedFacility, pageNo, perPage]);

  const handleFacilityChange = (selectedOption: SelectOption | null): void => {
    setSelectedFacility(selectedOption);
  };

  const columns: TableColumn<LastScanListType>[] = [
    {
      name: "Patient Name",
      cell: (row) => (
        <div
          className="table-username cursor-pointer"
          onClick={() => navigate(`/patient/${row.patientId}/profile`)}
        >
          {row.patientName && (
            <>
              {row.profilePicUrl ? (
                <img
                  src={row.profilePicUrl}
                  alt=""
                  className="device-logo"
                  style={{ marginRight: "10px" }}
                />
              ) : (
                <p style={{ marginRight: "10px" }} className="name-logo">
                  {row.patientName
                    .split(" ")
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("")}
                </p>
              )}
            </>
          )}
          <div className="patient-name">
            <span className="row-user-name">
              {capitalize(row.patientName) ?? "-"}
            </span>
            <span>
              <b>Health ID:</b> {row.patientHealthID ?? "-"}
            </span>
          </div>
        </div>
      ),
      width: "20%",
    },
    { name: "Wound ID", selector: (row) => row.woundProfileNo ?? "-" },
    { name: "Wound Name", selector: (row) => row.woundName ?? "-" },
    { name: "Last Updated", selector: (row) => row.latestUploaded ?? "" },
    {
      name: "Actions",
      cell: (row) => (
        <CustomButton
          className="btn btn-outline-primary"
          onClick={() =>
            navigate(`/patient/${row.patientId}/profile/wound-history`, {
              state: {
                patientName: row.patientName,
                woundProfileId: row.woundProfileId,
              },
            })
          }
        >
          View Details
        </CustomButton>
      ),
      width: "15%",
    },
  ];

  return (
    <>
      {loading && <Loader />}
      <div className="add-wrapper-section">
        <div className="d-flex justify-content-end my-3">
          <div className="d-flex">
            <div className="me-3 calendar-border">
              <img src={calendarIcon} alt="" />
              <span>{formattedDate}</span>
            </div>
            <div style={{ width: "20rem" }}>
              <CustomSelect
                id="facilityId"
                name="facilityId"
                value={selectedFacility}
                onChange={handleFacilityChange}
                options={facilities}
                placeholder="Select Facility"
                noOptionsMessage={() => "No Facility Found"}
                isSearchable
              />
            </div>
          </div>
        </div>
        <div className="dashboard-section">
          <Row>
            {[
              {
                label: "Total Providers",
                value: dashboardCount?.totalProviders,
                icon: "medical_information",
                className: "",
              },
              {
                label: "Total Staff Members",
                value: dashboardCount?.totalStaffMembers,
                icon: "person",
                className: "green",
              },
              {
                label: "Total Patients",
                value: dashboardCount?.activePatients,
                icon: "medical_information",
                className: "purple",
              },
              {
                label: "Total Scans Completed",
                value: dashboardCount?.totalScanUploadedCount,
                icon: "medical_information",
                className: "orange",
              },
              {
                label: "Total Active Patients",
                value: dashboardCount?.totalActivePatientsPerYear,
                icon: "medical_information",
                className: "light-green",
              },
            ].map(({ label, value, icon, className }, idx) => (
              <Col key={idx} className="col-group">
                <Card>
                  <CardBody>
                    <div className="card-body-section">
                      <div className={`card-logo ${className}`}>
                        <span className="material-symbols-outlined fill">
                          {icon}
                        </span>
                      </div>
                      <div className="description">
                        <p>{label}</p>
                        <h3>{value ?? 0}</h3>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <div className="add-wrapper-section mt-3">
        <div className="card card-section">
          <h4 className="ms-3 mb-0 pb-0">Recently Completed Scans</h4>
          <CustomMainCard>
            {lastScanList.length === 0 ? (
              <NoRecordsMessage />
            ) : (
              <>
                <div className="datatable-wrapper dashboard-table">
                  <DataTable columns={columns} data={lastScanList} />
                </div>
                <CustomPagination
                  pageNo={pageNo}
                  setPageNo={setPageNo}
                  totalRecords={totalRecords}
                  perPage={perPage}
                  setPerPage={setPerPage}
                />
              </>
            )}
          </CustomMainCard>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
