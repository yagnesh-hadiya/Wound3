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
import { FacilityAdminDetailsType } from "../../../types/ManageFacilitiesType";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddEditFacilityAdminSchema } from "../../../helpers/schemas/AddEditFacilitySchema";
import ToggleSwitch from "../../../components/custom/CustomToggle";

interface AddEditFacilityAdminModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (data: FacilityAdminDetailsType) => void;
  adminData: FacilityAdminDetailsType | null;
}

const AddEditFacilityAdminModal: React.FC<AddEditFacilityAdminModalProps> = ({
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
    watch,
  } = useForm<FacilityAdminDetailsType>({
    resolver: yupResolver(AddEditFacilityAdminSchema),
    defaultValues: adminData || {
      firstName: "",
      lastName: "",
      phone: "",
      emailAddress: "",
      isActive: true,
      isAdmin: false,
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
        isAdmin: false,
      });
    }
  }, [adminData, reset]);

  const onSubmitHandler = (data: FacilityAdminDetailsType) => {
    onSubmit(data);
  };
  const isAdmin = watch("isAdmin");

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true} size="md">
      <ModalHeader toggle={toggle}>
        {adminData ? "Edit Facility Staff" : "Add Facility Staff"}
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
            <Col md="6" className="mb-3">
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
            <Col md="6" className="align-items-center d-flex gap-3">
              <Label className="mb-0">Is Admin</Label>
              <ToggleSwitch
                onStateChange={(checked) => setValue("isAdmin", checked)}
                checked={isAdmin}
              />
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

export default AddEditFacilityAdminModal;
