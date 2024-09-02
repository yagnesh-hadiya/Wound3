import { Card, CardBody, Col } from "reactstrap";
import CustomButton from "../../../../components/custom/CustomBtn";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomPagination from "../../../../components/custom/CustomPagination";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { capitalize, showToast } from "../../../../helpers";
import { getWoundProfileList } from "../../../../services/ManagePatientServices";
import apple from "../../../../assets/images/apple.png";
import { WoundProfileListType } from "../../../../types/ManagePatientType";

interface WoundProfileListProps {
  setLoading: (loading: boolean) => void;
  patientName: string;
}

const WoundProfileList: React.FC<WoundProfileListProps> = ({
  setLoading,
  patientName,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pageNo, setPageNo] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [data, setData] = useState<WoundProfileListType[]>([]);

  useEffect(() => {
    const getWoundProfile = async (id: string) => {
      try {
        setLoading(true);
        const val = await getWoundProfileList(perPage, pageNo, id);
        setTotalRecords(val?.totalRecords ?? 0);
        setData(val?.data ?? []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        showToast("error", "Something went wrong");
      }
    };

    if (id) {
      getWoundProfile(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, perPage, pageNo]);

  const columns: TableColumn<WoundProfileListType>[] = [
    {
      name: "Wound Name",
      cell: (row: WoundProfileListType): JSX.Element => (
        <div className="table-username">
          {row.woundName && (
            <span style={{ marginRight: "10px" }}>
              <img
                src={row.woundProfileLink ?? apple}
                alt=""
                className="device-logo"
              />
            </span>
          )}
          <div className="patient-name">
            <span className="row-user-name">
              {row.woundName ? capitalize(row.woundName) : "-"}
            </span>
            <span>
              <b>Wound ID:</b> {row.woundProfileNo ?? "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Date Created",
      selector: (row: WoundProfileListType): string =>
        row.dateCreated ? row.dateCreated.split(" ")[0] : "-",
      width: "20%",
    },
    {
      name: "Last Updated",
      selector: (row: WoundProfileListType): string => row.lastUpdated,
      width: "25%",
    },
    {
      name: "Actions",
      cell: (row: WoundProfileListType) => (
        <div key={row.woundProfileId}>
          <CustomButton
            className="btn btn-outline-primary"
            onClick={() =>
              navigate(`/patient/${id}/profile/wound-history`, {
                state: { patientName, woundProfileId: row.woundProfileId },
              })
            }
          >
            View
          </CustomButton>
        </div>
      ),
      width: "15%",
    },
  ];

  return (
    <Col md="6" className="col-group">
      <Card className="profile-header-section device-wrapper">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="me-3 mb-0 heading">Wound Profiles</h4>
          </div>
          <>
            <div className="datatable-wrapper profile-table wound-profile-wrapper">
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
          </>
        </CardBody>
      </Card>
    </Col>
  );
};

export default WoundProfileList;
