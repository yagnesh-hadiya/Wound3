import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Row, Col, Card } from "reactstrap";
import noImg from "../../../../../../assets/images/No.svg";
import mildImg from "../../../../../../assets/images/Mild.svg";
import moderateImg from "../../../../../../assets/images/Moderate.svg";
import severeImg from "../../../../../../assets/images/Severe.svg";
import verySevereImg from "../../../../../../assets/images/Very severe.svg";
import worstPainImg from "../../../../../../assets/images/Worst Pain.svg";
import { showToast } from "../../../../../../helpers";
import Loader from "../../../../../../components/custom/CustomSpinner";
import heic2any from "heic2any";
import {
  getDocumentScanDetails,
  getFlagList,
  getSelectedFlagList,
} from "../../../../../../services/ManagePatientServices";
import {
  FlagListType,
  ViewScanDetailsType,
} from "../../../../../../types/ManagePatientType";
import { getUserId } from "../../../../../../helpers/tokens";
import ModalHeaderInfo from "./ModalHeaderInfo";
import CreateFlag from "./CreateFlag";

interface ViewScanDetailsProps {
  isOpen: boolean;
  toggle: () => void;
  patientId: string;
  woundScanId: string;
}

const ViewScanDetails: React.FC<ViewScanDetailsProps> = ({
  isOpen,
  toggle,
  patientId,
  woundScanId,
}) => {
  const [isCreateFlagModalOpen, setCreateFlagModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [scanDetails, setScanDetails] = useState<ViewScanDetailsType | null>(
    null
  );
  const [scanFlagList, setScanFlagList] = useState<FlagListType[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<FlagListType[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchAndConvertImage = async (imagePath: string) => {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const convertedBlob = await heic2any({ blob, toType: "image/jpeg" });
      setImageSrc(URL.createObjectURL(convertedBlob));
      setImageLoading(false);
    };
    if (scanDetails?.imagePath) {
      setImageLoading(true);
      fetchAndConvertImage(scanDetails?.imagePath);
    }
  }, [scanDetails?.imagePath]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const val = await getUserId();
      setUserId(val);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [scanDetailsRes, flagListRes, selectedFlagRes] =
          await Promise.all([
            getDocumentScanDetails(patientId, woundScanId),
            getFlagList(),
            getSelectedFlagList(patientId, woundScanId),
          ]);

        setScanDetails(scanDetailsRes?.data1 ?? null);
        setScanFlagList(flagListRes?.data ?? []);
        setSelectedFlag(
          selectedFlagRes?.data?.map(
            (val: { flagId: string; flagTitle: string }) => ({
              id: val.flagId,
              value: val.flagTitle,
            })
          )
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        showToast("error", "Something went wrong");
      }
    };

    fetchAllData();
  }, [patientId, woundScanId]);

  const reFetchScanDetail = async () => {
    setLoading(true);
    try {
      const flagListRes = await getFlagList();

      setScanFlagList(flagListRes?.data ?? []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("error", "Failed to fetch updated flag list");
    }
  };
  const filterToggleModal = () => {
    setCreateFlagModalOpen((pre) => !pre);
  };

  const ratingScale = (painRating: string) => {
    switch (painRating) {
      case "0":
      case "1":
        return noImg;
      case "2":
      case "3":
        return mildImg;
      case "4":
      case "5":
        return moderateImg;
      case "6":
      case "7":
        return severeImg;
      case "8":
      case "9":
        return verySevereImg;
      case "10":
        return worstPainImg;
      default:
        return noImg;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl">
      {loading && <Loader />}
      <ModalHeaderInfo
        toggle={toggle}
        userId={userId ?? ""}
        patientId={patientId}
        woundScanId={woundScanId}
        setLoading={setLoading}
        scanFlagList={scanFlagList}
        selectedFlag={selectedFlag}
        setSelectedFlag={setSelectedFlag}
        filterToggleModal={filterToggleModal}
      />

      <ModalBody style={{ height: "700px", overflow: "auto" }}>
        <div className="card mb-3 modal-card mb-3">
          <div className="card-header">
            <h6>Scan Image</h6>
          </div>
          <div className="card-body">
            <Row>
              <Col md="6">
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "20px" }}
                >
                  <Card className="main-home-card">
                    {imageLoading ? (
                      <span>
                        <Loader styles={{ position: "relative" }} />
                      </span>
                    ) : (
                      imageSrc && <img src={imageSrc} alt="scan img" />
                    )}
                  </Card>
                  <div>
                    <div className="body-desc">
                      <p>Volume</p>
                      <h6>
                        {scanDetails?.parentVolume
                          ? scanDetails?.parentVolume
                          : "-"}
                      </h6>
                    </div>
                    <div className="body-desc">
                      <p>Area</p>
                      <h6>
                        {scanDetails?.parentArea
                          ? scanDetails?.parentArea
                          : "-"}
                      </h6>
                    </div>
                    <div className="body-desc">
                      <p>Depth</p>
                      <h6>
                        {scanDetails?.parentDepth
                          ? scanDetails?.parentDepth
                          : "-"}
                      </h6>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="card mb-3 modal-card mb-3">
          <div className="card-header">
            <h6>Sub Scans</h6>
          </div>
          <div className="card-body">
            {scanDetails ? (
              <div className="mb-0 ">
                <Row>
                  {scanDetails?.subscans?.map((val) => (
                    <Col md="4" className="mb-3">
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: "20px" }}
                      >
                        {val.maskPath && (
                          <Card className="main-home-card" key={val.index}>
                            <img src={val.maskPath} alt="scan" />
                          </Card>
                        )}
                        <div>
                          <div className="body-desc">
                            <p>Volume</p>
                            <h6>{val?.volume ? val?.volume : "-"}</h6>
                          </div>
                          <div className="body-desc">
                            <p>Area</p>
                            <h6>{val?.area ? val?.area : "-"}</h6>
                          </div>
                          <div className="body-desc">
                            <p>Depth</p>
                            <h6>{val?.depth ? val?.depth : "-"}</h6>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <div className="ply-file">No Sub Scan Data Found</div>
            )}
          </div>
        </div>
        <div className="card mb-3 modal-card mb-3">
          <div className="card-header">
            <h6>User Generated Notes</h6>
          </div>
          <div className="card-body">
            {scanDetails ? (
              scanDetails?.notes?.map((note) => (
                <div className="mb-3 border-bottom" key={note.id}>
                  <div className="d-flex align-items-center">
                    <img
                      src={ratingScale(note.painRating)}
                      alt=""
                      style={{ width: "2rem" }}
                    />
                    <div className="body-desc ms-2 mb-2">
                      <span>{note.description}</span>
                      <p>{note.date}</p>
                    </div>
                  </div>
                  {note.symptomChecks && (
                    <div className="card mb-3 modal-card mt-2">
                      <div className="card-header">
                        <h6>Wound Update</h6>
                      </div>
                      <div className="card-body">
                        <div className="question-wrapper">
                          <ul>
                            {note.symptomChecks.map((ques, index) => (
                              <li key={ques.id}>
                                <div className="d-flex justify-content-between">
                                  <h6>
                                    {index + 1}. {ques.question}
                                  </h6>
                                  <div className="d-flex">
                                    <span
                                      className={`${
                                        ques.response === "0" && "active"
                                      }`}
                                    >
                                      NA
                                    </span>
                                    <span
                                      className={`${
                                        ques.response === "1" && "active"
                                      }`}
                                    >
                                      No
                                    </span>
                                    <span
                                      className={`${
                                        ques.response === "2" && "active"
                                      }`}
                                    >
                                      Yes
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="ply-file">No Data Found</div>
            )}
          </div>
        </div>
      </ModalBody>
      {isCreateFlagModalOpen && (
        <CreateFlag
          userId={userId ?? ""}
          setLoading={setLoading}
          isOpen={isCreateFlagModalOpen}
          toggle={() => setCreateFlagModalOpen(false)}
          reFetchScanDetail={reFetchScanDetail}
        />
      )}
    </Modal>
  );
};

export default ViewScanDetails;
