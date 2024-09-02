import React, { useEffect, useState } from "react";
import CustomInput from "../../components/custom/CustomInput";
import Search from "../../assets/images/search.svg";
import ToggleSwitch from "../../components/custom/CustomToggle";
import CustomButton from "../../components/custom/CustomBtn";
import AddEditFilter from "./AddEditFilter";
import RadioBtn from "../../components/custom/CustomRadioBtn";
import DataTable, { TableColumn } from "react-data-table-component";
import { FilterListType } from "../../types/ManageSettingType";
import Loader from "../../components/custom/CustomSpinner";
import NoRecordsMessage from "../../components/NoRecordsMessage";
import CustomPagination from "../../components/custom/CustomPagination";
import { capitalize, debounce, showToast } from "../../helpers";
import CustomEditBtn from "../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../components/custom/CustomDeleteBtn";
import {
  deleteFilterItem,
  getFilterList,
} from "../../services/ManageSettingServices";
import { LoadingType, SelectOption } from "../../types/Index";
import { isAxiosError } from "axios";
import CustomSelect from "../../components/custom/CustomSelect";

const filterTypeList = [
  {
    value: 1,
    label: "Flag",
  },
  {
    value: 2,
    label: "Facility",
  },
  {
    value: 3,
    label: "Provider",
  },
  {
    value: 4,
    label: "Patient",
  },
];

interface FilterCellProps {
  row: FilterListType;
  filterTypeList: { value: number; label: string }[];
}

const FilterCell: React.FC<FilterCellProps> = ({ row, filterTypeList }) => {
  const renderFilterValue = () => {
    switch (row?.filterType) {
      case filterTypeList[1]?.label:
        return row?.facilityName ? (
          <div className="flag-name me-2 dodger-blue">{row.facilityName}</div>
        ) : (
          "-"
        );
      case filterTypeList[2]?.label:
        return row?.providerName ? (
          <div className="flag-name me-2 dodger-blue">{row.providerName}</div>
        ) : (
          "-"
        );
      case filterTypeList[3]?.label:
        return row?.patientName ? (
          <div className="flag-name me-2 dodger-blue">{row.patientName}</div>
        ) : (
          "-"
        );
      default:
        return row?.flags
          ? row.flags.split(",").map((flag, index) => (
              <div className="flag-name me-2 dodger-blue" key={index}>
                {flag.trim()}
              </div>
            ))
          : "-";
    }
  };

  return <>{renderFilterValue()}</>;
};

const Settings: React.FC = () => {
  const [loading, setLoading] = useState<LoadingType>("loading");
  const [pageNo, setPageNo] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [currentPageSearch, setCurrentPageSearch] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isAddFilterModalOpen, setAddFilterModalOpen] = useState(false);
  const [data, setData] = useState<FilterListType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [abort, setAbort] = useState<boolean>(false);
  const abortController = new AbortController();
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  const [selectedFilterType, setSelectedFilterType] =
    useState<SelectOption | null>(null);

  useEffect(() => {
    fetchFilterData();
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, search, pageNo, abort, selectedFilterType?.value]);

  const handleSearch = (text: string): void => {
    setSearch(text);
    setCurrentPageSearch(0);
  };

  const handleDelete = async (filterId: string): Promise<void> => {
    try {
      setLoading("loading");
      const deletedFilter = await deleteFilterItem(filterId);
      showToast("success", deletedFilter.message);
      await fetchFilterData();
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
      setLoading("idle");
    }
  };

  const fetchFilterData = debounce(async (): Promise<void> => {
    try {
      setLoading("loading");
      const result = await getFilterList(
        perPage,
        abortController,
        search ? currentPageSearch : pageNo,
        search,
        selectedFilterType && selectedFilterType?.label
      );
      setTotalRecords(result.totalRecords);
      setData(result.data);
    } catch (error) {
      if (abortController.signal.aborted) {
        setAbort(true);
        return;
      }
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading("idle");
    }
  }, 300);

  const handleFilterTypeChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      if (!selectedOption) {
        setSelectedFilterType(null);
        return;
      } else {
        setSelectedFilterType(selectedOption);
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

  const columns: TableColumn<FilterListType>[] = [
    {
      name: "Filter Name",
      selector: (row: FilterListType) =>
        row.filterName ? capitalize(row.filterName) : "-",
      width: "20%",
    },
    {
      name: "Filter Type",
      selector: (row: FilterListType) =>
        row.filterType ? capitalize(row.filterType) : "-",
      width: "10%",
    },
    {
      name: "Filters",
      cell: (row: FilterListType) => (
        <FilterCell row={row} filterTypeList={filterTypeList} />
      ),
    },
    {
      name: "Actions",
      cell: (row: FilterListType) => (
        <div key={row.filterId} className="d-flex">
          <CustomEditBtn onEdit={() => toggleModal(row.filterId)} />
          <CustomDeleteBtn onDelete={() => handleDelete(row.filterId ?? "")} />
        </div>
      ),
      width: "10%",
    },
  ];

  const toggleModal = (filterId?: string | null) => {
    setAddFilterModalOpen((prev) => !prev);
    setSelectedFilterId(filterId ?? null);
  };

  return (
    <>
      <div className="add-wrapper-section">
        <h4>Settings</h4>
        <div className="card card-section mb-3">
          <div className="card-header">
            <h6>Anonymized Dataset Generation - Filters</h6>
          </div>
          <div className="card-body">
            <div className="d-flex" style={{ gap: "10px" }}>
              <div className="search-bar-wrapper flex-grow-1">
                <CustomInput
                  placeholder="Search Here"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearch(e.target.value)
                  }
                />
                <img src={Search} alt="search" />
              </div>
              <div style={{ width: "15rem" }}>
                <CustomSelect
                  id="filterType"
                  name="filterType"
                  value={selectedFilterType}
                  onChange={(val) => {
                    handleFilterTypeChange(val);
                  }}
                  options={filterTypeList?.map((val: SelectOption) => ({
                    value: val?.value,
                    label: val?.label,
                  }))}
                  placeholder="Select Filter Type"
                  noOptionsMessage={(): string => "No Filter Type Found"}
                  isSearchable={true}
                  isClearable={true}
                />
              </div>
              <CustomButton
                className="btn btn-primary"
                onClick={() => setAddFilterModalOpen(true)}
              >
                Add New Filter
              </CustomButton>
            </div>
            {loading === "loading" ? (
              <Loader
                styles={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              />
            ) : data.length === 0 ? (
              <NoRecordsMessage />
            ) : (
              <>
                <div className="datatable-wrapper">
                  <DataTable columns={columns} data={data} />
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
          </div>
        </div>
        <div className="card card-section mb-3">
          <div className="card-header">
            <div className="d-flex">
              <ToggleSwitch onStateChange={() => console.log("first")} />
              <h6 className="ms-3">
                2FA{" "}
                <span style={{ color: "#787878" }}>
                  (2 Factors Authentication)
                </span>
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex gap-5">
              <RadioBtn
                options={[{ label: "Authy", value: "true" }]}
                name={"Authy"}
                onChange={(value: string) => console.log(value)}
                selected={"true"}
              />
              <RadioBtn
                options={[{ label: "1Password", value: "true" }]}
                name={"1Password"}
                onChange={(value: string) => console.log(value)}
                selected={"false"}
              />
              <RadioBtn
                options={[{ label: "LastPass", value: "true" }]}
                name={"LastPass"}
                onChange={(value: string) => console.log(value)}
                selected={"false"}
              />
            </div>
          </div>
        </div>
      </div>
      {isAddFilterModalOpen && (
        <AddEditFilter
          selectedFilterId={selectedFilterId}
          isOpen={isAddFilterModalOpen}
          toggle={() => {
            setAddFilterModalOpen(false);
            setSelectedFilterId(null);
          }}
          refetchData={fetchFilterData}
        />
      )}
    </>
  );
};

export default Settings;
