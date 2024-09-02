import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Row, Table } from "reactstrap";
import CustomButton from "../../../../../components/custom/CustomBtn";
import Loader from "../../../../../components/custom/CustomSpinner";
import WoundScanList from "./WoundScanList";
import { WoundHistoryListType } from "../../../../../types/ManagePatientType";
import { formatDateTime, showToast } from "../../../../../helpers";
import { getWoundHistoryList } from "../../../../../services/ManagePatientServices";
import WoundHistoryGraph from "./WoundHistoryGraph";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import PLYViewer from "./PLYViewer";

const PatientWoundHistory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageNo = 0;
  const perPage = 10;
  const [loading, setLoading] = useState<boolean>(true);
  const { patientName, woundProfileId } = location.state || {};
  const [woundHistoryData, setWoundHistoryData] = useState<
    WoundHistoryListType[]
  >([]);
  const { id: patientId } = useParams<{ id: string }>();
  const [selectedWound, setSelectedWound] =
    useState<WoundHistoryListType | null>(null);
  const [selectedStep, setSelectedStep] = useState<number>(0);

  useEffect(() => {
    const getWoundScanItems = async (patientId: string) => {
      try {
        setLoading(true);
        const val = await getWoundHistoryList(
          perPage,
          pageNo,
          patientId,
          woundProfileId
        );
        setWoundHistoryData(val?.data ?? []);
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
  }, [patientId, perPage, pageNo, woundProfileId]);

  useEffect(() => {
    // Select the first item by default when data is loaded
    if (woundHistoryData.length > 0) {
      setSelectedWound(woundHistoryData[0]);
      setSelectedStep(1); // Assuming steps are 1-based index
    }
  }, [woundHistoryData]);

  const handleRowClick = (wound: WoundHistoryListType, index: number) => {
    setSelectedWound(wound);
    setSelectedStep(index + 1); // Assuming steps are 1-based index
  };

  const handleStepClick = (index: number) => {
    setSelectedWound(woundHistoryData[index]);
    setSelectedStep(index + 1);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="add-wrapper-section">
        <div className="d-flex justify-content-between align-items-center my-1">
          <h4 className="me-3 heading">Wound History - {patientName}</h4>
          <CustomButton
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-outlined me-2">
              keyboard_backspace
            </span>
            Back
          </CustomButton>
        </div>
        <div className="patient-profile-wrapper">
          <Card className="view-card mb-3">
            <CardBody>
              <Row className="mb-4">
                <Col md="4">
                  <Card style={{ height: "400px" }} className="scan-details">
                    <CardBody className="p-0">
                      {woundHistoryData.length > 0 ? (
                        <WoundHistoryGraph
                          woundHistoryData={woundHistoryData}
                          selectedWound={selectedWound ?? null}
                        />
                      ) : (
                        <div className="ply-file">No Graph Data Found</div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card
                    style={{
                      height: "400px",
                      cursor: "grabbing",
                      padding: "0",
                    }}
                    className="scan-details"
                  >
                    <CardBody className="p-0">
                      {selectedWound && selectedWound?.plyLink !== null ? (
                        <PLYViewer selectedWound={selectedWound ?? null} />
                      ) : (
                        <div className="ply-file">No Ply file Found</div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="scan-details" style={{ height: "400px" }}>
                    {woundHistoryData.length > 0 ? (
                      <Table className="patient-table-wrapper">
                        <thead>
                          <tr>
                            <th>Scan Date & Time</th>
                            <th>Volume</th>
                            <th>Area</th>
                            <th>Depth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {woundHistoryData.map((val, index) => (
                            <tr
                              key={val.woundScanId}
                              onClick={() => handleRowClick(val, index)}
                              className={`${
                                selectedWound?.woundScanId === val.woundScanId
                                  ? "blue"
                                  : ""
                              }`}
                            >
                              <td>
                                <div className="inside-div">
                                  {val.scanDateTime
                                    ? formatDateTime(val.scanDateTime)
                                    : "-"}
                                </div>
                              </td>
                              <td>
                                <div className="inside-div">
                                  {val.volumeText ?? "-"}
                                </div>
                              </td>
                              <td>
                                <div className="inside-div">
                                  {val.areaText ?? "-"}
                                </div>
                              </td>
                              <td>
                                <div className="inside-div">
                                  {val.depthText ?? "-"}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="ply-file">No Scan Data Found</div>
                    )}
                  </Card>
                </Col>
              </Row>
              <div className="card">
                <div className="stepProgressBar">
                  <ProgressBar
                    percent={(selectedStep / woundHistoryData.length) * 100}
                    filledBackground="linear-gradient(270deg, #58c7d6 0%, #10a3dd 100%)"
                  >
                    {woundHistoryData.map((data, index) => (
                      <Step key={data.woundScanId} transition="scale">
                        {({ accomplished }) => (
                          <div
                            onClick={() => handleStepClick(index)}
                            className={`step ${
                              accomplished ? "accomplished" : ""
                            } ${
                              selectedStep === index + 1 ? "selected-step" : ""
                            }`}
                          >
                            <span
                              style={{
                                color:
                                  selectedStep === index + 1 ? "white" : "blue",
                              }}
                            ></span>
                          </div>
                        )}
                      </Step>
                    ))}
                  </ProgressBar>
                </div>
              </div>
              <p className="text-center mb-0 mt-2" style={{ color: "#787878" }}>
                Oldest to Newest
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
      <WoundScanList setLoading={setLoading} />
    </>
  );
};

export default PatientWoundHistory;
