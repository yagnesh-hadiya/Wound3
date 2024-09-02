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
import { ManageFacilityNetworkType } from "../../types/ManageFacilityNetworkType";
import {
  capitalize,
  debounce,
  formatPhoneNumber,
  showToast,
} from "../../helpers";
import CustomPagination from "../../components/custom/CustomPagination";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import Loader from "../../components/custom/CustomSpinner";
import { getUserId } from "../../helpers/tokens";
import ACL from "../../components/custom/ACL";
import {
  changeFacilityNetworkStatus,
  deleteFacilityNetwork,
  getFacilityNetworkList,
} from "../../services/ManageFacilityNetworkServices";

const ManageFacilityNetwork: React.FC = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ManageFacilityNetworkType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);
  const abortController = new AbortController();

  useEffect(() => {
    getManageFacilityNetwork();

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

  const getManageFacilityNetwork = debounce(async (): Promise<void> => {
    try {
      setLoading(true);
      const val = await getFacilityNetworkList(
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

  const onDelete = async (facilityNetworkId: string): Promise<void> => {
    try {
      setLoading(true);
      const deletedUser = await deleteFacilityNetwork(facilityNetworkId);
      showToast("success", deletedUser?.message);
      await getManageFacilityNetwork();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("error", "Something went wrong");
    }
  };

  const handleSwitchChange = debounce(
    async (facilityNetworkId: string, status: boolean): Promise<void> => {
      try {
        const formData = {
          facilityNetworkId: facilityNetworkId,
          isActive: status,
          updatedBy: userId,
        };
        const responseToggleActivation = await changeFacilityNetworkStatus(
          formData
        );
        showToast("success", responseToggleActivation?.message);
      } catch (error) {
        showToast("error", "Something went wrong");
      }
    },
    200
  );

  const Column: TableColumn<ManageFacilityNetworkType>[] = [
    {
      name: "Sr No",
      selector: (row: ManageFacilityNetworkType): number => row.srNo,
      width: "5%",
    },
    {
      name: "Facility Network Name",
      selector: (row: ManageFacilityNetworkType): string =>
        row.facilityNetworkName ? capitalize(row.facilityNetworkName) : "-",
    },
    {
      name: "Facility Network Alias",
      selector: (row: ManageFacilityNetworkType): string =>
        row.facilityNetworkAlias,
    },
    {
      name: "Contact",
      selector: (row: ManageFacilityNetworkType): string =>
        row.phone ? formatPhoneNumber(row.phone) : "-",
    },
    {
      name: "Address",
      selector: (row: ManageFacilityNetworkType): string => row.address,
      width: "25%",
    },
    {
      name: "Status",
      cell: (row: ManageFacilityNetworkType) => (
        <ToggleSwitch
          onStateChange={(isActive: boolean): void =>
            handleSwitchChange(row.facilityNetworkId, isActive)
          }
          checked={row.isActive}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: ManageFacilityNetworkType) => (
        <div key={row.facilityNetworkId} className="d-flex">
          <ACL
            submodule={""}
            module={"Manage Facility Network"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn
              onEdit={() =>
                navigate(`/facility-network/edit/${row.facilityNetworkId}`)
              }
            />
          </ACL>
          <ACL
            submodule={""}
            module={"Manage Facility Network"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDelete(row.facilityNetworkId)} />
          </ACL>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="add-wrapper-section">
        <h4>Manage Facility Network</h4>
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
              module={"Manage Facility Network"}
              action={["GET", "POST"]}
            >
              <CustomButton
                className="btn btn-primary"
                onClick={() => navigate("/facility-network/create")}
              >
                Add Facility Network
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

export default ManageFacilityNetwork;
