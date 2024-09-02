import DeviceConfiguration from "./deviceConfiguration/DeviceConfiguration";
import WoundProfileList from "./woundProfile/WoundProfileList";
import { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { getPatientByUserId } from "../../../services/ManagePatientServices";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { capitalize, showToast } from "../../../helpers";
import phone from "../../../assets/images/Vector (2).svg";
import userIcon from "../../../assets/images/user.png";
import email from "../../../assets/images/Vector (3).svg";
import location from "../../../assets/images/Vector (4).svg";
import { PatientInfo } from "../../../types/ManagePatientType";
import CustomButton from "../../../components/custom/CustomBtn";
import Loader from "../../../components/custom/CustomSpinner";
import ReferPatientModal from "./ReferPatientModal";

const PatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleReferModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const getProviderByIds = async (id: string) => {
      try {
        setLoading(true);
        const res = await getPatientByUserId(id);
        if (res && res.data) {
          setLoading(false);
          setPatientInfo(res.data);
        }
      } catch (error) {
        handleError(error);
      }
    };

    if (id) {
      getProviderByIds(id);
    }
  }, [id]);

  const handleError = (error: unknown) => {
    console.error(error);
    setLoading(false);
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
  };
  return (
    <>
      {loading && (
        <Loader
          styles={{
            position: "absolute",
            left: "57%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      )}
      <div className="add-wrapper-section d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h4 className="me-3">Patient Profile</h4>
          {patientInfo?.facilityName && (
            <span className="patient-header-title border-green">
              {patientInfo?.facilityName}
            </span>
          )}
        </div>
        <CustomButton
          className="btn btn-outline-primary"
          onClick={() => navigate("/manage-patients")}
        >
          <span className="material-symbols-outlined me-2">
            keyboard_backspace
          </span>
          Back
        </CustomButton>
      </div>
      <div className="dashboard-section">
        <Row className="mb-3">
          <Col className="col-group">
            <Card className="profile-header-section">
              <span className="border-height"></span>
              <CardBody className="d-flex  justify-content-between">
                <div className="d-flex" style={{ gap: "10px" }}>
                  <img
                    src={patientInfo?.profilePicUrl ?? userIcon}
                    alt=""
                    className="profile-logo"
                  />
                  <div className="header-description">
                    <div
                      className="d-flex mb-2 align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <h6 className="patientName mb-0">
                        {patientInfo?.firstName
                          ? capitalize(patientInfo?.firstName)
                          : ""}{" "}
                        {patientInfo?.lastName
                          ? capitalize(patientInfo?.lastName)
                          : ""}
                      </h6>
                      <span className="badge-name">
                        Patient ID: {patientInfo?.patientsID}
                      </span>
                    </div>
                    <div>
                      <p>
                        <b>
                          {patientInfo?.genderId === 1 ? "Male" : "Female"},{" "}
                        </b>
                        {patientInfo?.dateOfBirth
                          ? new Date(
                              patientInfo.dateOfBirth
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                        (
                        {patientInfo?.dateOfBirth
                          ? new Date().getFullYear() -
                            new Date(patientInfo.dateOfBirth).getFullYear()
                          : ""}{" "}
                        Years)
                      </p>
                    </div>
                    <div className="d-flex" style={{ gap: "20px" }}>
                      <div className="d-flex align-items-center">
                        <img src={phone} alt="" />
                        <p className="mb-0 ms-2">{patientInfo?.phone}</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <img src={email} alt="" />
                        <p className="mb-0 ms-2">{patientInfo?.emailAddress}</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <img src={location} alt="" />
                        <p className="mb-0 ms-2">
                          {patientInfo?.address}, {patientInfo?.city},{" "}
                          {patientInfo?.state} {patientInfo?.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <CustomButton
                    className="btn btn-outline-primary"
                    onClick={toggleReferModal}
                  >
                    Refer Patient
                  </CustomButton>
                  <CustomButton
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/patient/edit/${id}`)}
                  >
                    <span className="material-symbols-outlined me-2">edit</span>
                    Edit
                  </CustomButton>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <DeviceConfiguration setLoading={setLoading} />
          <WoundProfileList
            setLoading={setLoading}
            patientName={
              `${patientInfo?.firstName ?? ""} ${
                patientInfo?.lastName ?? ""
              }`.trim() || "-"
            }
          />
        </Row>
      </div>
      {isModalOpen && (
        <ReferPatientModal
          isOpen={isModalOpen}
          toggle={toggleReferModal}
          patientNumber={patientInfo?.patientsID ?? ""}
        />
      )}
    </>
  );
};

export default PatientProfile;
