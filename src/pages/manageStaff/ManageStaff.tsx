import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomMainCard from "../../components/custom/CustomCard";
import CustomInput from "../../components/custom/CustomInput";
import Search from "../../assets/images/search.svg";
import CustomButton from "../../components/custom/CustomBtn";
import {
  changeStaffStatus,
  deleteStaff,
  getStaffList,
} from "../../services/ManageStaffServices";
import ToggleSwitch from "../../components/custom/CustomToggle";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import { ManageStaffType } from "../../types/ManageStaffType";
import {
  capitalize,
  checkAclPermission,
  debounce,
  formatPhoneNumber,
  showToast,
} from "../../helpers";
import CustomPagination from "../../components/custom/CustomPagination";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import Loader from "../../components/custom/CustomSpinner";
import ACL from "../../components/custom/ACL";

const ManageStaff: React.FC = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ManageStaffType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);
  const abortController = new AbortController();
  const allow = checkAclPermission("Manage Staff", null, ["GET", "POST"]);
  useEffect(() => {
    getManageStaff();

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, search, setData, pageNo, abort]);

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(0);
  };

  const getManageStaff = debounce(async (): Promise<void> => {
    try {
      setLoading(true);
      const val = await getStaffList(
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

  const onDelete = async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      const deletedUser = await deleteStaff(userId);
      showToast("success", deletedUser?.message);
      await getManageStaff();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("error", "Something went wrong");
    }
  };

  const handleSwitchChange = debounce(
    async (userId: string, status: boolean): Promise<void> => {
      try {
        const formData = {
          userId: userId,
          active: status,
        };
        const responseToggleActivation = await changeStaffStatus(formData);
        showToast("success", responseToggleActivation?.message);
      } catch (error) {
        showToast("error", "Something went wrong");
      }
    },
    200
  );

  const Column: TableColumn<ManageStaffType>[] = [
    {
      name: "Sr No",
      selector: (row: ManageStaffType): number => row.srNo,
      width: "6%",
    },
    {
      name: "Staff Name",
      cell: (row: ManageStaffType): JSX.Element => (
        <div className="table-username">
          {(row?.firstName || row?.lastName) && (
            <p style={{ marginRight: "10px" }} className="name-logo">
              {row?.firstName?.slice(0, 1)?.toUpperCase() +
                row?.lastName?.slice(0, 1)?.toUpperCase()}
            </p>
          )}
          <span className="row-user-name">
            {`${row?.firstName ? capitalize(row?.firstName) : ""} ${
              row?.lastName ? capitalize(row?.lastName) : "-"
            }`}
          </span>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Contact",
      selector: (row: ManageStaffType): string =>
        row.contact ? formatPhoneNumber(row.contact) : "-",
    },
    {
      name: "Email ID",
      selector: (row: ManageStaffType): string => row.emailID,
      width: "15%",
    },
    {
      name: "Address",
      selector: (row: ManageStaffType): string => row.address,
      width: "25%",
    },
    {
      name: "Status",
      cell: (row: ManageStaffType) => (
        <ToggleSwitch
          onStateChange={(active: boolean): void =>
            handleSwitchChange(row.userId, active)
          }
          checked={row.active}
          disabled={!allow}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: ManageStaffType) => (
        <div key={row.userId} className="d-flex">
          <ACL submodule={""} module={"Manage Staff"} action={["GET", "PUT"]}>
            <CustomEditBtn
              onEdit={() => navigate(`/staff/edit/${row.userId}`)}
            />
          </ACL>
          <ACL
            submodule={""}
            module={"Manage Staff"}
            action={["GET", "DELETE"]}
          >
            <CustomDeleteBtn onDelete={() => onDelete(row.userId)} />
          </ACL>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="add-wrapper-section">
        <h4>Manage Staff</h4>
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
              module={"Manage Staff"}
              action={["GET", "POST"]}
            >
              <CustomButton
                className="btn btn-primary"
                onClick={() => navigate("/staff/create")}
              >
                Add Staff User
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

export default ManageStaff;
