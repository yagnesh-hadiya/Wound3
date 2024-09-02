import { Pagination } from "reactstrap";
import CustomSelect from "./CustomSelect";
import { CustomPaginationProps } from "../../types/CustomPaginationTypes";

const CustomPagination = ({
  pageNo,
  setPageNo,
  totalRecords,
  perPage,
  setPerPage,
}: CustomPaginationProps) => {
  const startEntry = pageNo + 1;
  const endEntry = Math.min(pageNo + perPage, totalRecords);
  const showingEntriesText = `${startEntry} - ${endEntry} of ${totalRecords}`;

  const handlePageChange = (offset: number): void => {
    const newPageNo = pageNo + offset * perPage;
    if (newPageNo >= 0 && newPageNo < totalRecords) {
      setPageNo(newPageNo);
    }
  };

  const options = [10, 25, 100].map((size: number) => ({
    value: size,
    label: size?.toString(),
  }));

  return (
    <div className="pagination-wrapper d-flex justify-content-between mt-3 align-items-start ">
      <div className="d-flex align-items-center">
        <span className="pagination-content-pages me-3">Items per page</span>
        <CustomSelect
          id="entriesPerPageSelect"
          name="entriesPerPageSelect"
          value={{ value: perPage, label: perPage.toString() }}
          onChange={(selectedOption) => {
            const newSize = Number(selectedOption?.value);
            setPerPage(newSize);
            setPageNo(0);
          }}
          options={options}
          isSearchable={true}
          noOptionsMessage={() => "No options available"}
          menuPlacement="top"
          placeholder=""
        />
      </div>

      <div>
        <Pagination
          aria-label="Page navigation example"
          size="sm"
          className="pagination-sub-item"
        >
          <span>{showingEntriesText}</span>
          <div className="pagination-arrow">
            <span
              className="cursor-pointer material-symbols-outlined"
              onClick={() => handlePageChange(-1)}
            >
              chevron_left
            </span>
            <span
              className="cursor-pointer material-symbols-outlined"
              onClick={() => handlePageChange(1)}
            >
              chevron_right
            </span>
          </div>
        </Pagination>
      </div>
    </div>
  );
};

export default CustomPagination;
