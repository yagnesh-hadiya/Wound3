import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import CustomInput from "../../../../components/custom/CustomInput";
import { showToast } from "../../../../helpers";
import { getUserId } from "../../../../helpers/tokens";
import { AddEditDeviceSchema } from "../../../../helpers/schemas/AddEditPatientSchema";
import { AddEditDeviceDataType } from "../../../../types/ManagePatientType";
import { useParams } from "react-router-dom";
import {
  addDevice,
  getDeviceByUserId,
  updateDevice,
} from "../../../../services/ManagePatientServices";

interface AddEditDeviceModalProps {
  isOpen: boolean;
  toggle: () => void;
  setLoading: (loading: boolean) => void;
  deviceId: string | null;
}

const AddEditDeviceModal: React.FC<AddEditDeviceModalProps> = ({
  isOpen,
  toggle,
  setLoading,
  deviceId,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<AddEditDeviceDataType>({
    resolver: yupResolver(AddEditDeviceSchema),
  });

  const { id: patientId } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const val = await getUserId();
      setUserId(val);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (deviceId) {
      const fetchDeviceById = async () => {
        try {
          setLoading(true);
          const res = await getDeviceByUserId(deviceId);
          if (res && res.data) {
            const { deviceName, appVersion, serialNumber } = res.data;
            setValue("deviceName", deviceName);
            setValue("serialNumber", serialNumber);
            setValue("appVersion", appVersion);
          }
        } catch (error) {
          console.error(error);
          showToast("error", "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

      fetchDeviceById();
    }
  }, [deviceId, setLoading, setValue]);

  const onSubmit = async (data: AddEditDeviceDataType) => {
    const payload = {
      ...data,
      patientId,
      appInstalledOn: new Date().toISOString(),
    };

    try {
      setLoading(true);
      if (deviceId) {
        const res = await updateDevice({
          ...payload,
          deviceid: deviceId ?? "",
          updatedBy: userId ?? "",
        });
        showToast("success", res?.message);
      } else {
        const res = await addDevice({
          ...payload,
          createdBy: userId ?? "",
        });
        showToast("success", res?.message);
      }
      toggle();
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>
        {deviceId ? "Edit" : "Add New"} Device
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="12" className="mb-3">
              <Label for="deviceName">
                Device Name<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="deviceName"
                placeholder="Device Name"
                invalid={!!errors.deviceName}
                {...register("deviceName")}
              />
              <FormFeedback>{errors.deviceName?.message}</FormFeedback>
            </Col>
            <Col md="12" className="mb-3">
              <Label for="serialNumber">
                Serial Number<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="serialNumber"
                placeholder="Serial Number"
                invalid={!!errors.serialNumber}
                {...register("serialNumber")}
              />
              <FormFeedback>{errors.serialNumber?.message}</FormFeedback>
            </Col>
            <Col md="12" className="mb-3">
              <Label for="appVersion">
                App Version<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="appVersion"
                placeholder="App Version"
                invalid={!!errors.appVersion}
                {...register("appVersion")}
              />
              <FormFeedback>{errors.appVersion?.message}</FormFeedback>
            </Col>
          </Row>
          <div className="my-3">
            <Button type="submit" className="me-3 btn btn-primary">
              Save
            </Button>
            <Button className="btn btn-cancel" onClick={toggle}>
              Cancel
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddEditDeviceModal;
