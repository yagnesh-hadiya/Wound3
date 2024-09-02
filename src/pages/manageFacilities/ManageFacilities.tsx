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
import { ManageFacilitiesType } from "../../types/ManageFacilitiesType";
import {
  capitalize,
  debounce,
  formatPhoneNumber,
  showToast,
} from "../../helpers";
import CustomPagination from "../../components/custom/CustomPagination";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import Loader from "../../components/custom/CustomSpinner";
import {
  changeFacilityStatus,
  deleteFacility,
  getFacilitiesList,
} from "../../services/ManageFacilityServices";
import { getUserId } from "../../helpers/tokens";
import ACL from "../../components/custom/ACL";

const ManageFacilities: React.FC = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ManageFacilitiesType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);
  const abortController = new AbortController();

  useEffect(() => {
    getManageFacilities();

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, search, setData, pageNo, abort]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(0);
  };

  const getManageFacilities = debounce(async (): Promise<void> => {
    try {
      setLoading(true);
      const val = await getFacilitiesList(
        perPage,
        abortController,
        search ? currentPageSearch : pageNo,
        search
      );
      setTotalRecords(val?.totalRecords);
      setData(val?.data);
      setLoading(false);
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

  const onDelete = async (facilityId: string): Promise<void> => {
    try {
      setLoading(true);
      const deletedUser = await deleteFacility(facilityId);
      showToast("success", deletedUser?.message);
      await getManageFacilities();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("error", "Something went wrong");
    }
  };

  const handleSwitchChange = debounce(
    async (facilityId: string, status: boolean): Promise<void> => {
      try {
        const formData = {
          facilityId: facilityId,
          isActive: status,
          updatedBy: userId,
        };
        const responseToggleActivation = await changeFacilityStatus(formData);
        showToast("success", responseToggleActivation?.message);
      } catch (error) {
        showToast("error", "Something went wrong");
      }
    },
    200
  );

  const Column: TableColumn<ManageFacilitiesType>[] = [
    {
      name: "Sr No",
      selector: (row: ManageFacilitiesType): number => row.srNo,
      width: "6%",
    },
    {
      name: "Facility Name",
      selector: (row: ManageFacilitiesType): string =>
        row.facilityName ? capitalize(row.facilityName) : "-",
      width: "15%",
    },
    {
      name: "Facility Alias",
      selector: (row: ManageFacilitiesType): string => row.facilityAlias,
      width: "10%",
    },
    {
      name: "Facility Type",
      selector: (row: ManageFacilitiesType): string => row.facilityType,
      width: "10%",
    },
    {
      name: "Contact",
      selector: (row: ManageFacilitiesType): string =>
        row.phone ? formatPhoneNumber(row.phone) : "-",
    },
    {
      name: "Address",
      selector: (row: ManageFacilitiesType): string => row.address,
      width: "25%",
    },
    {
      name: "Status",
      cell: (row: ManageFacilitiesType) => (
        <ToggleSwitch
          onStateChange={(isActive: boolean): void =>
            handleSwitchChange(row.facilityId, isActive)
          }
          checked={row.isActive}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: ManageFacilitiesType) => (
        <div key={row.facilityId} className="d-flex">
          <ACL
            submodule={""}
            module={"Manage Facilities"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn
              onEdit={() => navigate(`/facility/edit/${row.facilityId}`)}
            />
          </ACL>
          <ACL
            submodule={""}
            module={"Manage Facilities"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDelete(row.facilityId)} />
          </ACL>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="add-wrapper-section">
        <h4>Manage Facilities</h4>
        <CustomMainCard>
          <div className="d-flex" style={{ gap: "10px" }}>
            <div className="search-bar-wrapper flex-grow-1">
              <CustomInput
                placeholder="Search Here"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  handleSearch(e.target.value)
                }
              />
              <img src={Search} alt="search" />
            </div>

            <ACL
              submodule={""}
              module={"Manage Facilities"}
              action={["GET", "POST"]}
            >
              <CustomButton
                className="btn btn-primary"
                onClick={() => navigate("/facility/create")}
              >
                Add Facility
              </CustomButton>
            </ACL>
          </div>
          {loading ? (
            <Loader
              styles={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          ) : data?.length == 0 ? (
            <NoRecordsMessage />
          ) : (
            <>
              <div className="datatable-wrapper">
                <DataTable columns={Column} data={data} />
              </div>
              <CustomPagination
                pageNo={search ? currentPageSearch : pageNo}
                setPageNo={setPageNo}
                totalRecords={totalRecords}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </>
          )}
        </CustomMainCard>
      </div>
    </>
  );
};

export default ManageFacilities;
