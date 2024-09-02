import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomMainCard from "../../components/custom/CustomCard";
import CustomInput from "../../components/custom/CustomInput";
import Search from "../../assets/images/search.svg";
import CustomButton from "../../components/custom/CustomBtn";
import {
  changeProviderStatus,
  deleteProvider,
  getProviderList,
} from "../../services/ManageProviderServices";
import ToggleSwitch from "../../components/custom/CustomToggle";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import { ManageProviderType } from "../../types/ManageProviderType";
import {
  capitalize,
  debounce,
  formatPhoneNumber,
  showToast,
} from "../../helpers";
import CustomPagination from "../../components/custom/CustomPagination";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import Loader from "../../components/custom/CustomSpinner";
import CustomSelect from "../../components/custom/CustomSelect";
import { SelectOption } from "../../types/Index";
import { isAxiosError } from "axios";
import { getFacilityList } from "../../services/ManageFacilityServices";
import ACL from "../../components/custom/ACL";

const ManageProvider: React.FC = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState<number>(0);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ManageProviderType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);
  const abortController = new AbortController();
  const [selectedFacility, setSelectedFacility] = useState<SelectOption | null>(
    null
  );
  const [facility, setFacility] = useState<SelectOption[]>([]);

  useEffect(() => {
    getManageProvider();

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, search, setData, pageNo, abort, selectedFacility?.value]);

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
    getFacility();
  }, []);

  const handleFacilityChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      if (!selectedOption) {
        setSelectedFacility(null);
        return;
      } else {
        setSelectedFacility(selectedOption);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message || "Something went wrong"
        );
      } else if (error instanceof Error) {
        showToast("error", error.message || "Something went wrong");
      } else {
        showToast("error", "Something went wrong");
      }
    }
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(0);
  };

  const getManageProvider = debounce(async (): Promise<void> => {
    try {
      setLoading(true);
      const val = await getProviderList(
        perPage,
        abortController,
        search ? currentPageSearch : pageNo,
        search,
        selectedFacility && selectedFacility?.value
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
      const deletedUser = await deleteProvider(userId);
      showToast("success", deletedUser?.message);
      await getManageProvider();
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
          isActive: status,
          createdBy: userId,
        };
        const responseToggleActivation = await changeProviderStatus(formData);
        showToast("success", responseToggleActivation?.message);
      } catch (error) {
        showToast("error", "Something went wrong");
      }
    },
    200
  );

  const Column: TableColumn<ManageProviderType>[] = [
    {
      name: "Sr No",
      selector: (row: ManageProviderType): number => row.srNo,
      width: "6%",
    },
    {
      name: "Provider Name",
      cell: (row: ManageProviderType): JSX.Element => (
        <div className="table-username">
          {row.providerName && (
            <p style={{ marginRight: "10px" }} className="name-logo">
              {row.providerName
                .split(" ")
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("")}
            </p>
          )}
          <span className="row-user-name">
            {row.providerName ? capitalize(row.providerName) : "-"}
          </span>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Facility",
      selector: (row: ManageProviderType): string => row.facility ?? "-",
    },
    {
      name: "Contact",
      selector: (row: ManageProviderType): string =>
        row.contact ? formatPhoneNumber(row.contact) : "-",
    },
    {
      name: "Email ID",
      selector: (row: ManageProviderType): string => row.emailID,
      width: "15%",
    },
    {
      name: "Address",
      selector: (row: ManageProviderType): string => row.address,
      width: "25%",
    },
    {
      name: "Status",
      cell: (row: ManageProviderType) => (
        <ToggleSwitch
          onStateChange={(active: boolean): void =>
            handleSwitchChange(row.userId, active)
          }
          checked={row.isActive}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: ManageProviderType) => (
        <div key={row.userId} className="d-flex">
          <ACL
            submodule={""}
            module={"Manage Providers"}
            action={["GET", "PUT"]}
          >
            <CustomEditBtn
              onEdit={() => navigate(`/provider/edit/${row.userId}`)}
            />
          </ACL>
          <ACL
            submodule={""}
            module={"Manage Providers"}
            action={["GET", "PUT"]}
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
        <h4>Manage Providers</h4>
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
                noOptionsMessage={(): string => "No Facility Found"}
                isSearchable={true}
                isClearable={true}
              />
            </div>
            <ACL
              submodule={""}
              module={"Manage Providers"}
              action={["GET", "POST"]}
            >
              <CustomButton
                className="btn btn-primary"
                onClick={() => navigate("/provider/create")}
              >
                Add Provider
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

export default ManageProvider;
