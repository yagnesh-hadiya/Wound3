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
import CustomInput from "../../components/custom/CustomInput";
import { ChangePasswordSchema } from "../../helpers/schemas/AuthSchema";
import {
  ChangePasswordDataType,
  ErrorResponse,
  UserInfo,
} from "../../types/AuthTypes";
import { showToast } from "../../helpers";
import { changePassword } from "../../services/AuthServices";
import { getUserInfo } from "../../helpers/tokens";
import Loader from "../../components/custom/CustomSpinner";

interface ChangePasswordProps {
  isOpen: boolean;
  toggle: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, toggle }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ChangePasswordDataType>({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setLoading] = useState(false);

  const toggleOldPasswordVisibility = () =>
    setOldPasswordVisible(!isOldPasswordVisible);
  const toggleNewPasswordVisibility = () =>
    setNewPasswordVisible(!isNewPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!isConfirmPasswordVisible);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const val = await getUserInfo();
      setUserInfo(val);
    };

    fetchUserInfo();
  }, []);

  const onSubmit = async (data: ChangePasswordDataType) => {
    if (!userInfo) {
      showToast("error", "User information is missing.");
      return;
    }
    try {
      setLoading(true);
      const formData = {
        userId: userInfo.userId,
        oldPassword: data.oldPassword,
        password: data.password,
        confirmPassword: data.confirmPassword,
        email: userInfo?.email,
        updatedBy: userInfo.userId,
      };
      const response = await changePassword(formData);
      if (response.status) {
        showToast("success", response.message);
        toggle();
      } else {
        showToast("error", response.message);
      }
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as ErrorResponse)?.response?.data?.response?.message ||
        (error as ErrorResponse)?.response?.data?.title ||
        "Something went wrong";
      showToast("error", errorMessage);
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>Change Password</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {isLoading && <Loader />}
          <Row>
            <Col md="12" className="mb-3">
              <Label className="form-label">
                Current Password<span className="asterisk">*</span>
              </Label>
              <div className="icon-wrapper">
                <CustomInput
                  type={isOldPasswordVisible ? "text" : "password"}
                  placeholder="Current Password"
                  invalid={!!errors.oldPassword}
                  {...register("oldPassword")}
                />
                {!errors.oldPassword && (
                  <span
                    className="material-symbols-outlined cursor-pointer"
                    onClick={toggleOldPasswordVisibility}
                  >
                    {isOldPasswordVisible ? "visibility_off" : "visibility"}
                  </span>
                )}
                <FormFeedback>{errors.oldPassword?.message}</FormFeedback>
              </div>
            </Col>
            <Col md="12" className="mb-3">
              <Label className="form-label">
                New Password<span className="asterisk">*</span>
              </Label>
              <div className="icon-wrapper">
                <CustomInput
                  type={isNewPasswordVisible ? "text" : "password"}
                  placeholder="New Password"
                  invalid={!!errors.password}
                  {...register("password")}
                />
                {!errors.password && (
                  <span
                    className="material-symbols-outlined cursor-pointer"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {isNewPasswordVisible ? "visibility_off" : "visibility"}
                  </span>
                )}
                <FormFeedback>{errors.password?.message}</FormFeedback>
              </div>
            </Col>
            <Col md="12" className="mb-3">
              <Label className="form-label">
                Confirm New Password<span className="asterisk">*</span>
              </Label>
              <div className="icon-wrapper">
                <CustomInput
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm New Password"
                  invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                {!errors.confirmPassword && (
                  <span
                    className="material-symbols-outlined cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? "visibility_off" : "visibility"}
                  </span>
                )}
                <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
              </div>
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

export default ChangePassword;
