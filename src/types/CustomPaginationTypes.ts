import React from "react";

export interface CustomPaginationProps {
  pageNo: number;
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  totalRecords: number;
  setPerPage: (newSize: number) => void;
  perPage: number;
}
