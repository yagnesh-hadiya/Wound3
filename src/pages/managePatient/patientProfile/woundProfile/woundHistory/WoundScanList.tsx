import CustomButton from "../../../../../components/custom/CustomBtn";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomPagination from "../../../../../components/custom/CustomPagination";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { formatDateTime, showToast } from "../../../../../helpers";
import {
  downloadPdf,
  getWoundScanList,
} from "../../../../../services/ManagePatientServices";
import { WoundScanListType } from "../../../../../types/ManagePatientType";
import ViewScanDetails from "./viewScanDetails/ViewScanDetails";

interface WoundScanListProps {
  setLoading: (loading: boolean) => void;
}

const WoundScanList: React.FC<WoundScanListProps> = ({ setLoading }) => {
  const location = useLocation();
  const { woundProfileId } = location.state || {};
  const { id: patientId } = useParams<{ id: string }>();
  const [pageNo, setPageNo] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [data, setData] = useState<WoundScanListType[]>([]);
  const [isViewScanDetailsModal, setViewScanDetailsModal] = useState(false);
  const [woundScanId, setWoundScanId] = useState("");

  useEffect(() => {
    const getWoundScanItems = async (patientId: string) => {
      try {
        setLoading(true);
        const val = await getWoundScanList(
          perPage,
          pageNo,
          patientId,
          woundProfileId
        );
        setTotalRecords(val?.totalRecords ?? 0);
        setData(val?.data ?? []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        showToast("error", "Something went wrong");
      }
    };

    if (patientId) {
      getWoundScanItems(patientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, perPage, pageNo, isViewScanDetailsModal]);

  const handleDownloadPDF = async (woundScanId: string) => {
    try {
      setLoading(true);
      const response = await downloadPdf(patientId ?? "", woundScanId);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `wound_scan_${woundScanId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Failed to download PDF");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to download PDF");
      setLoading(false);
    }
  };

  const columns: TableColumn<WoundScanListType>[] = [
    {
      name: "Scan Date & Time",
      selector: (row: WoundScanListType): string =>
        row.scanDateTime ? formatDateTime(row.scanDateTime) : "-",
      width: "15%",
    },
    {
      name: "Scan Time",
      selector: (row: WoundScanListType): string => row.scanTime ?? "-",
      width: "10%",
    },
    {
      name: "Flags",
      cell: (row: WoundScanListType): JSX.Element => (
        <div className="flags-list">
          {row?.flagsTitles
            ? row?.flagsTitles?.map((flag, index) => (
                <div className="flag-name" key={index}>
                  {flag.titles}
                </div>
              ))
            : "-"}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div key={row.woundScanId} className="d-flex" style={{ gap: "10px" }}>
          <CustomButton
            className="btn btn-outline-primary add-new view"
            onClick={() => toggleViewScanDetailsModal(row.woundScanId)}
          >
            View
          </CustomButton>
          <CustomButton
            className="btn btn-outline-primary add-new view"
            onClick={() => handleDownloadPDF(row.woundScanId)}
          >
            <span className="material-symbols-outlined me-2">download</span>
            PDF
          </CustomButton>
        </div>
      ),
      width: "15%",
    },
  ];

  const toggleViewScanDetailsModal = (woundScanId: string) => {
    setViewScanDetailsModal((prev) => !prev);
    setWoundScanId(woundScanId);
  };

  return (
    <>
      <div className="add-wrapper-section mt-3">
        <div className="card card-section mb-3">
          <div className="d-flex mt-3 align-items-center">
            <h4 className="ms-4 mb-0 py-0 me-2">Wound Scans</h4>
            <div className="patient-logo">{totalRecords}</div>
          </div>
          <div className="card-body pt-0">
            <div className="datatable-wrapper mt-0">
              <DataTable columns={columns} data={data} />
            </div>
            {data.length > 0 && (
              <CustomPagination
                pageNo={pageNo}
                setPageNo={setPageNo}
                totalRecords={totalRecords}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            )}
          </div>
        </div>
      </div>
      {isViewScanDetailsModal && (
        <ViewScanDetails
          patientId={patientId ?? ""}
          woundScanId={woundScanId}
          isOpen={isViewScanDetailsModal}
          toggle={() => setViewScanDetailsModal(false)}
        />
      )}
    </>
  );
};

export default WoundScanList;
