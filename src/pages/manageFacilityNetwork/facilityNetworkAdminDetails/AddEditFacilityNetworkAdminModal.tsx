import React from "react";
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
import CustomInput from "../../../components/custom/CustomInput";
import { formatPhoneNumber } from "../../../helpers";
import { useForm } from "react-hook-form";
import { FacilityNetworkAdminDetailsType } from "../../../types/ManageFacilityNetworkType";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddEditFacilityAdminSchema } from "../../../helpers/schemas/AddEditFacilitySchema";

interface AddEditFacilityAdminModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (data: FacilityNetworkAdminDetailsType) => void;
  adminData: FacilityNetworkAdminDetailsType | null;
}

const AddEditFacilityNetworkAdminModal: React.FC<AddEditFacilityAdminModalProps> = ({
  isOpen,
  toggle,
  onSubmit,
  adminData,
}) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    register,
  } = useForm<FacilityNetworkAdminDetailsType>({
    resolver: yupResolver(AddEditFacilityAdminSchema),
    defaultValues: adminData || {
      firstName: "",
      lastName: "",
      phone: "",
      emailAddress: "",
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (adminData) {
      reset(adminData);
    } else {
      reset({
        firstName: "",
        lastName: "",
        phone: "",
        emailAddress: "",
        isActive: true,
      });
    }
  }, [adminData, reset]);

  const onSubmitHandler = (data: FacilityNetworkAdminDetailsType) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true} size="md">
      <ModalHeader toggle={toggle}>
        {adminData ? "Edit Facility Network Admin" : "Add Facility Network Admin"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <Row>
            <Col md="6" className="mb-3">
              <Label>
                First Name<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="firstName"
                placeholder="First Name"
                invalid={!!errors.firstName}
                {...register("firstName")}
              />
              <FormFeedback>{errors.firstName?.message}</FormFeedback>
            </Col>
            <Col md="6" className="mb-3">
              <Label>
                Last Name<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="lastName"
                placeholder="Last Name"
                invalid={!!errors.lastName}
                {...register("lastName")}
              />
              <FormFeedback>{errors.lastName?.message}</FormFeedback>
            </Col>
            <Col md="12" lg="12" className="mb-3">
              <Label>
                Phone<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="phone"
                placeholder="Phone Number"
                invalid={!!errors.phone}
                {...register("phone", {
                  onChange: (e) => {
                    const formattedNumber: string = formatPhoneNumber(
                      e.target.value
                    );
                    setValue("phone", formattedNumber);
                  },
                })}
              />
              <FormFeedback>{errors.phone?.message}</FormFeedback>
            </Col>
            <Col md="12" lg="12">
              <Label>
                Email Address<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="emailAddress"
                placeholder="Email Address"
                invalid={!!errors.emailAddress}
                {...register("emailAddress")}
              />
              <FormFeedback>{errors.emailAddress?.message}</FormFeedback>
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

export default AddEditFacilityNetworkAdminModal;
