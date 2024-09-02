import React, { useState } from "react";
import { Link, Params, useNavigate, useParams } from "react-router-dom";
import headerLogo from "../../assets/header-logo.png";
import Card from "react-bootstrap/Card";
import { resetPassword } from "../../services/AuthServices";
import { showToast } from "../../helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordSchema } from "../../helpers/schemas/AuthSchema";
import Loader from "../../components/custom/CustomSpinner";
import CustomInput from "../../components/custom/CustomInput";
import { Button, Form, FormFeedback, FormGroup, Label } from "reactstrap";
import { ErrorResponse, ResetPasswordDataType } from "../../types/AuthTypes";

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  const { email, token } = useParams<Params>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordDataType>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const toggleShowPassword = () => {
    setShowPassword((prevValue) => !prevValue);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevValue) => !prevValue);
  };

  const onSubmit = async (data: ResetPasswordDataType) => {
    try {
      setLoading(true);
      const formData = {
        email: email!,
        emailToken: token!,
        password: data.password,
      };
      const response = await resetPassword(formData);
      if (response.status) {
        showToast("success", response.message);
        navigate("/");
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
    <div className="card-main-wrapper">
      <Card className="card-content">
        <Card.Body className="card-body-content">
          <div className="header-logo text-center">
            <img src={headerLogo} alt="logo" className="img-logo" />
          </div>
          <h6>Reset Password</h6>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {loading && <Loader />}
            <div className="mb-25">
              <FormGroup>
                <Label className="form-label">Enter New Password<span className="asterisk">*</span></Label>
                <div className="icon-wrapper">
                  <CustomInput
                    type={showPassword ? "password" : "text"}
                    placeholder="Enter New Password"
                    invalid={!!errors.password}
                    {...register("password")}
                  />
                  {!errors.password && (
                    <span
                      className="material-symbols-outlined cursor-pointer"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  )}
                  <FormFeedback>{errors.password?.message}</FormFeedback>
                </div>
              </FormGroup>
            </div>
            <div className="mb-25">
              <Label className="form-label">Confirm New Password<span className="asterisk">*</span></Label>
              <FormGroup>
                <div className="icon-wrapper">
                  <CustomInput
                    type={showConfirmPassword ? "password" : "text"}
                    placeholder="Confirm New Password"
                    invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  {!errors.confirmPassword && (
                    <span
                      className="material-symbols-outlined cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? "visibility" : "visibility_off"}
                    </span>
                  )}
                  <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
                </div>
              </FormGroup>
            </div>
            <div className="d-grid gap-2">
              <Button
                type="submit"
                style={{ margin: "3px" }}
                className="btn btn-primary login"
              >
                Submit
              </Button>

              <Link to="/login" className="forgot-link text-center">
                Back to Login
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResetPassword;
