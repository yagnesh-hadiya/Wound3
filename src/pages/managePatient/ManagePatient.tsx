import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomMainCard from "../../components/custom/CustomCard";
import CustomInput from "../../components/custom/CustomInput";
import Search from "../../assets/images/search.svg";
import CustomButton from "../../components/custom/CustomBtn";
import ToggleSwitch from "../../components/custom/CustomToggle";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import {
  ManagePatientType,
  ManageReferPatientType,
} from "../../types/ManagePatientType";
import { capitalize, debounce, showToast } from "../../helpers";
import CustomPagination from "../../components/custom/CustomPagination";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import Loader from "../../components/custom/CustomSpinner";
import {
  changePatientStatus,
  deletePatient,
  getPatientList,
  getReferPatientList,
  requestForPatient,
} from "../../services/ManagePatientServices";
import CustomSelect from "../../components/custom/CustomSelect";
import { SelectOption } from "../../types/Index";
import { getFacilityList } from "../../services/ManageFacilityServices";
import { getProvidersList } from "../../services/ManageProviderServices";
import { getUserId, getUserInfo } from "../../helpers/tokens";
import { UserInfo } from "../../types/AuthTypes";
import ACL from "../../components/custom/ACL";

const ManagePatient: React.FC = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ManagePatientType[]>([]);
  const [referData, setReferData] = useState<ManageReferPatientType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);
  const abortController = new AbortController();
  const [selectedFacility, setSelectedFacility] = useState<SelectOption | null>(
    null
  );
  const [selectedProvider, setSelectedProvider] = useState<SelectOption | null>(
    null
  );
  const [facility, setFacility] = useState<SelectOption[]>([]);
  const [provider, setProvider] = useState<SelectOption[]>([]);
  const [view, setView] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const val = await getUserInfo();
      setUserInfo(val);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    getManagePatient();
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    perPage,
    search,
    setData,
    pageNo,
    abort,
    selectedFacility?.value,
    selectedProvider?.value,
    view,
    setReferData,
  ]);

  useEffect(() => {
    const getFacility = async () => {
      try {
        setLoading(true);
        const val = await getFacilityList();
        setFacility(
          val.data.map((val: { id: number; value: string }) => ({
            value: val.id,
            label: val.value,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        showToast("error", "Something went wrong");
      }
    };
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };

    fetchUserId();
    getFacility();
  }, []);

  useEffect(() => {
    if (!selectedFacility?.value) return;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const val = await getProvidersList(selectedFacility.value.toString());
        setProvider(
          val.data.map((provider: { id: number; value: string }) => ({
            value: provider.id,
            label: provider.value,
          }))
        );
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [selectedFacility]);

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(0);
  };

  const handleFacilityChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    if (!selectedOption) {
      setSelectedFacility(null);
      setSelectedProvider(null);
      return;
    } else {
      setSelectedFacility(selectedOption);
    }
  };

  const handleProviderChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    if (!selectedOption) {
      setSelectedProvider(null);
      return;
    } else {
      setSelectedProvider(selectedOption);
    }
  };

  const getManagePatient = debounce(async (): Promise<void> => {
    try {
      setLoading(true);
      const val =
        view === 1
          ? await getPatientList(
              perPage,
              abortController,
              search ? currentPageSearch : pageNo,
              search,
              selectedFacility && selectedFacility?.value,
              selectedProvider && selectedProvider?.value
            )
          : await getReferPatientList(
              perPage,
              abortController,
              search ? currentPageSearch : pageNo,
              search,
              userId ?? ""
            );
      setLoading(false);
      setTotalRecords(val?.totalRecords);
      if (view === 1) {
        setData(val?.data);
      } else {
        setReferData(val?.data);
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      setLoading(false);
      showToast("error", "Something went wrong");
    }
  }, 300);

  const onDelete = async (patientId: string): Promise<void> => {
    try {
      setLoading(true);
      const deletedUser = await deletePatient(patientId);
      showToast("success", deletedUser?.message);
      await getManagePatient();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("error", "Something went wrong");
    }
  };

  const handleSwitchChange = debounce(
    async (patientId: string, status: boolean): Promise<void> => {
      try {
        const formData = {
          patientId: patientId,
          isActive: status,
          updatedBy: patientId,
        };
        const responseToggleActivation = await changePatientStatus(formData);
        showToast("success", responseToggleActivation?.message);
      } catch (error) {
        showToast("error", "Something went wrong");
      }
    },
    200
  );

  const requestForPermission = async (
    item: ManageReferPatientType
  ): Promise<void> => {
    if (
      item.referedPatientPermissionStatus === "Requested" ||
      item.referedPatientPermissionStatus === "Approved" ||
      item.referedPatientPermissionStatus === "Rejected"
    )
      return;
    try {
      setLoading(true);
      const payload = {
        patientId: item.patientId,
        referalId: item.referalId,
        loggedInUserId: userId ?? "",
      };
      const res = await requestForPatient(payload);
      showToast("success", res?.message);
      await getManagePatient();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("error", "Something went wrong");
    }
  };

  const patientColumn: TableColumn<ManagePatientType>[] = [
    {
      name: "Sr No",
      selector: (row: ManagePatientType): number => row.srNo,
      width: "6%",
    },
    {
      name: "Patient Name",
      cell: (row: ManagePatientType): JSX.Element => (
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
              {row.patientName ? capitalize(row.patientName) : "-"}
            </span>
            <span>
              <b>Health ID:</b> {row.patientHealthID ?? "-"}
            </span>
          </div>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Insurance",
      selector: (row: ManagePatientType): string => row.insurance ?? "-",
    },
    {
      name: "Email ID",
      selector: (row: ManagePatientType): string => row.emailID,
      width: "15%",
    },
    {
      name: "Address",
      selector: (row: ManagePatientType): string => row.address,
      width: "25%",
    },
    {
      name: "Status",
      cell: (row: ManagePatientType) => (
        <ToggleSwitch
          onStateChange={(isActive: boolean): void =>
            handleSwitchChange(row.patientId, isActive)
          }
          checked={row.status}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: ManagePatientType) => (
        <div key={row.patientId} className="d-flex">
          <ACL
            submodule={""}
            module={"Manage Patients"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn
              onEdit={() => navigate(`/patient/edit/${row.patientId}`)}
            />
          </ACL>
          <ACL
            submodule={""}
            module={"Manage Patients"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDelete(row.patientId)} />
          </ACL>
        </div>
      ),
    },
  ];
  const referColumn: TableColumn<ManageReferPatientType>[] = [
    {
      name: "Patient Name",
      cell: (row: ManageReferPatientType): JSX.Element => (
        <div
          className={`${
            row.referedPatientPermissionStatus === "Approved"
              ? "cursor-pointer"
              : "cursor-not-allow"
          } table-username`}
          onClick={() => {
            if (row.referedPatientPermissionStatus === "Approved") {
              navigate(`/patient/${row.patientId}/profile`);
            }
          }}
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
              {row.patientName ? capitalize(row.patientName) : "-"}
            </span>
            <span>
              <b>Health ID:</b> {row.patientHealthID ?? "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Referred By",
      selector: (row: ManageReferPatientType): string =>
        row.referedByUserName ?? "-",
    },
    {
      name: "Referred Date",
      selector: (row: ManageReferPatientType): string =>
        row.referedDatetime ?? "-",
    },
    {
      name: "Status",
      cell: (row: ManageReferPatientType): JSX.Element => {
        let statusText: string;
        switch (row.referedPatientPermissionStatus) {
          case "Pending":
            statusText = "Request Permission";
            break;
          default:
            statusText = row.referedPatientPermissionStatus;
        }
        return (
          <div>
            <CustomButton
              className={`btn ${
                statusText === "Approved"
                  ? " btn-primary success"
                  : statusText === "Requested"
                  ? " btn-primary pending"
                  : statusText === "Rejected"
                  ? " btn-primary rejected"
                  : "btn-primary"
              }`}
              onClick={() => requestForPermission(row)}
            >
              {statusText}
            </CustomButton>
          </div>
        );
      },
      width: "15%",
    },
  ];
  return (
    <>
      <div className="add-wrapper-section">
        <h4>Manage Patients</h4>
        <CustomMainCard>
          {userInfo?.role === "Provider" && (
            <div className="d-flex toggle-btn-wrapper py-1 mb-1">
              <CustomButton
                className={`${
                  view === 1 ? "disabled" : ""
                }  btn btn-toggle primary`}
                onClick={() => setView(1)}
              >
                Patient List
              </CustomButton>
              <CustomButton
                className={`${
                  view === 2 ? "disabled" : ""
                }  btn btn-toggle secondary`}
                onClick={() => setView(2)}
              >
                Refer Patient List
              </CustomButton>
            </div>
          )}
          {view === 1 && (
            <div className="d-flex mb-2" style={{ gap: "10px" }}>
              <div className="search-bar-wrapper flex-grow-1">
                <CustomInput
                  placeholder="Search Here By Patient Name/DOB/Zip Code"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    handleSearch(e.target.value)
                  }
                />
                <img src={Search} alt="search" />
              </div>
              {view === 1 && (
                <>
                  <div style={{ width: "15rem" }}>
                    <CustomSelect
                      id="facilityId"
                      name="facilityId"
                      value={selectedFacility}
                      onChange={(val) => {
                        handleFacilityChange(val);
                      }}
                      options={facility?.map((val: SelectOption) => ({
                        value: val?.value,
                        label: val?.label,
                      }))}
                      placeholder="Select Facility"
                      noOptionsMessage={() => "No Facility Found"}
                      isSearchable
                      isClearable
                    />
                  </div>
                  {userInfo?.role !== "Provider" && (
                    <div style={{ width: "15rem" }}>
                      <CustomSelect
                        id="providerId"
                        name="providerId"
                        value={selectedProvider}
                        onChange={(val) => {
                          handleProviderChange(val);
                        }}
                        options={provider?.map((val: SelectOption) => ({
                          value: val?.value,
                          label: val?.label,
                        }))}
                        placeholder="Select Provider"
                        noOptionsMessage={() => "No Provider Found"}
                        isSearchable
                        isClearable
                        isDisabled={!selectedFacility}
                      />
                    </div>
                  )}
                </>
              )}
              <ACL
                submodule={""}
                module={"Manage Patients"}
                action={["GET", "POST"]}
              >
                <CustomButton
                  className="btn btn-primary"
                  onClick={() => navigate("/patient/create")}
                >
                  Add Patient
                </CustomButton>
              </ACL>
            </div>
          )}
          {loading ? (
            <Loader />
          ) : (view === 1 ? data : referData).length === 0 ? (
            <NoRecordsMessage />
          ) : (
            <>
              {view === 1 ? (
                <>
                  <div className="datatable-wrapper manage-patient-table">
                    <DataTable columns={patientColumn} data={data} />
                  </div>
                  {data.length > 0 && (
                    <CustomPagination
                      pageNo={search ? currentPageSearch : pageNo}
                      setPageNo={setPageNo}
                      totalRecords={totalRecords}
                      perPage={perPage}
                      setPerPage={setPerPage}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="datatable-wrapper manage-patient-table">
                    <DataTable columns={referColumn} data={referData} />
                  </div>
                  {referData.length > 0 && (
                    <CustomPagination
                      pageNo={search ? currentPageSearch : pageNo}
                      setPageNo={setPageNo}
                      totalRecords={totalRecords}
                      perPage={perPage}
                      setPerPage={setPerPage}
                    />
                  )}
                </>
              )}
            </>
          )}
        </CustomMainCard>
      </div>
    </>
  );
};

export default ManagePatient;
