import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  Button,
  FormFeedback,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { AddRecallDataType } from "../../../../types/ManagePatientType";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddRecallSchema } from "../../../../helpers/schemas/AddEditPatientSchema";
import { Form } from "react-router-dom";
import { getUserId } from "../../../../helpers/tokens";
import { showToast } from "../../../../helpers";
import { deviceRecall } from "../../../../services/ManagePatientServices";
import CustomTextArea from "../../../../components/custom/CustomTextArea";

interface RecallDeviceModalProps {
  isOpen: boolean;
  toggle: () => void;
  setLoading: (loading: boolean) => void;
  deviceId: string | null;
}

const RecallDeviceModal: React.FC<RecallDeviceModalProps> = ({
  isOpen,
  toggle,
  setLoading,
  deviceId,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddRecallDataType>({
    resolver: yupResolver(AddRecallSchema),
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const val = await getUserId();
      setUserId(val);
    };

    fetchUserInfo();
  }, []);

  const onSubmit = async (data: AddRecallDataType) => {
    const payload = {
      ...data,
      updatedBy: userId ?? "",
      deviceId: deviceId ?? "",
      isRecall: true,
    };

    try {
      setLoading(true);
      const res = await deviceRecall(payload);
      showToast("success", res?.message);
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
      <ModalHeader toggle={toggle}>Recall Device</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="12" className="mb-3">
              <Label for="recallReason">
                Recall Reason<span className="asterisk">*</span>
              </Label>
              <CustomTextArea
                className="fixed-height-textarea"
                id="recallReason"
                placeholder="Recall Reason"
                invalid={!!errors.recallReason}
                {...register("recallReason")}
              />
              <FormFeedback>{errors.recallReason?.message}</FormFeedback>
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

export default RecallDeviceModal;
