import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  Button,
  FormFeedback,
  Form,
} from "reactstrap";
import CustomInput from "../../../../../../components/custom/CustomInput";
import CustomTextArea from "../../../../../../components/custom/CustomTextArea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateFlagDataType } from "../../../../../../types/ManagePatientType";
import { CreateFlagSchema } from "../../../../../../helpers/schemas/AddEditPatientSchema";
import { showToast } from "../../../../../../helpers";
import { createFlag } from "../../../../../../services/ManagePatientServices";
import React from "react";

interface CreateFlagProps {
  isOpen: boolean;
  toggle: () => void;
  reFetchScanDetail: () => void;
  setLoading: (loading: boolean) => void;
  userId: string;
}

const CreateFlag: React.FC<CreateFlagProps> = ({
  isOpen,
  toggle,
  reFetchScanDetail,
  setLoading,
  userId,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateFlagDataType>({
    resolver: yupResolver(CreateFlagSchema),
  });

  const onSubmit = async (data: CreateFlagDataType) => {
    const payload = {
      ...data,
      createdBy: userId,
    };

    try {
      setLoading(true);
      const res = await createFlag(payload);
      showToast("success", res?.message);
      toggle();
      reFetchScanDetail();
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>Create Custom Flag</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="12" className="mb-3">
              <Label for="flagTitle">
                Flag Title<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="flagTitle"
                placeholder="Flag Title"
                invalid={!!errors.flagTitle}
                {...register("flagTitle")}
              />
              <FormFeedback>{errors.flagTitle?.message}</FormFeedback>
            </Col>
            <Col md="12" className="mb-3">
              <Label for="comments">
                Comments<span className="asterisk">*</span>
              </Label>
              <CustomTextArea
                className="fixed-height-textarea"
                id="comments"
                placeholder="Comments"
                invalid={!!errors.comments}
                {...register("comments")}
              />
              <FormFeedback>{errors.comments?.message}</FormFeedback>
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

export default CreateFlag;
