import React, { useEffect, useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomButton from "../../../../components/custom/CustomBtn";
import CustomPagination from "../../../../components/custom/CustomPagination";
import ToggleSwitch from "../../../../components/custom/CustomToggle";
import CustomEditBtn from "../../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../../components/custom/CustomDeleteBtn";
import AddEditDeviceModal from "./AddEditDeviceModal";
import RecallDeviceModal from "./RecallDeviceModal";
import apple from "../../../../assets/images/apple.png";
import {
  deleteDevice,
  deviceRecall,
  getDeviceList,
} from "../../../../services/ManagePatientServices";
import { capitalize, formatDateString, showToast } from "../../../../helpers";
import { DeviceConfigurationType } from "../../../../types/ManagePatientType";
import { getUserId } from "../../../../helpers/tokens";

interface DeviceConfigurationProps {
  setLoading: (loading: boolean) => void;
}

const DeviceConfiguration: React.FC<DeviceConfigurationProps> = ({
  setLoading,
}) => {
  const { id: patientId } = useParams<{ id: string }>();
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deviceList, setDeviceList] = useState<DeviceConfigurationType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchDeviceList(patientId);
      fetchUserId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, perPage, pageNo]);

  const fetchUserId = async () => {
    const userId = await getUserId();
    setUserId(userId);
  };

  const fetchDeviceList = async (patientId: string) => {
    try {
      setLoading(true);
      const response = await getDeviceList(perPage, pageNo, patientId);
      setTotalRecords(response?.totalRecords ?? 0);
      setDeviceList(response?.data ?? []);
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deviceId: string): Promise<void> => {
    if (userId && patientId) {
      try {
        setLoading(true);
        const response = await deleteDevice(deviceId, patientId, userId);
        showToast("success", response?.message);
        fetchDeviceList(patientId);
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleAddEditModal = (deviceId?: string | null) => {
    setIsModalOpen((prev) => !prev);
    setDeviceId(deviceId ?? null);
    if (patientId) {
      fetchDeviceList(patientId);
    }
  };

  const toggleRecallModal = (deviceId?: string | null) => {
    setIsRecallModalOpen((prev) => !prev);
    setDeviceId(deviceId ?? null);
  };

  const handleDeviceRecall = async (deviceId: string | null) => {
    try {
      const payload = {
        recallReason: "",
        updatedBy: userId ?? "",
        deviceId: deviceId ?? "",
        isRecall: false,
      };
      setLoading(true);
      const res = await deviceRecall(payload);
      showToast("success", res?.message);
      setDeviceList((prevList) =>
        prevList.map((device) =>
          device.deviceid === deviceId ? { ...device, recall: false } : device
        )
      );
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
      setDeviceList((prevList) =>
        prevList.map((device) =>
          device.deviceid === deviceId ? { ...device, recall: true } : device
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSwitch = (recall: boolean, deviceId: string | null) => {
    if (recall) {
      handleDeviceRecall(deviceId);
    } else {
      toggleRecallModal(deviceId);
    }
  };

  const columns: TableColumn<DeviceConfigurationType>[] = [
    {
      name: "Device",
      cell: (row) => (
        <div className="table-username cursor-pointer">
          {row.deviceName && (
            <span style={{ marginRight: "10px" }}>
              <img src={apple} alt="" />
            </span>
          )}
          <div className="patient-name">
            <span className="row-user-name">
              {row.deviceName ? capitalize(row.deviceName) : "-"}
            </span>
            <span>
              <b>S/N#:</b> {row.serialNumber ?? "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Version",
      selector: (row) => row.version ?? "-",
      width: "15%",
    },
    {
      name: "Installed On",
      selector: (row) =>
        row.installedOn ? formatDateString(row.installedOn.split("T")[0]) : "-",
      width: "15%",
    },
    {
      name: "Recall",
      cell: (row) => (
        <ToggleSwitch
          onStateChange={() => handleToggleSwitch(row.recall, row.deviceid)}
          checked={row.recall ?? false}
        />
      ),
      width: "15%",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <CustomEditBtn onEdit={() => toggleAddEditModal(row.deviceid)} />
          <CustomDeleteBtn onDelete={() => handleDelete(row.deviceid)} />
        </div>
      ),
      width: "15%",
    },
  ];

  return (
    <>
      <Col md="6" className="col-group">
        <Card className="profile-header-section device-wrapper">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="me-3 mb-0 heading">Device Configurations</h4>
              <CustomButton
                className="btn btn-primary"
                onClick={() => toggleAddEditModal()}
              >
                Add Device
              </CustomButton>
            </div>
            <div className="datatable-wrapper profile-table">
              <DataTable columns={columns} data={deviceList} />
            </div>
            {deviceList.length > 0 && (
              <CustomPagination
                pageNo={pageNo}
                setPageNo={setPageNo}
                totalRecords={totalRecords}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            )}
          </CardBody>
        </Card>
      </Col>
      {isModalOpen && (
        <AddEditDeviceModal
          isOpen={isModalOpen}
          toggle={toggleAddEditModal}
          setLoading={setLoading}
          deviceId={deviceId}
        />
      )}
      {isRecallModalOpen && (
        <RecallDeviceModal
          isOpen={isRecallModalOpen}
          toggle={toggleRecallModal}
          setLoading={setLoading}
          deviceId={deviceId}
        />
      )}
    </>
  );
};

export default DeviceConfiguration;
