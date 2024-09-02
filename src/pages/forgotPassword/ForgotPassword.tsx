import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import headerLogo from "../../assets/header-logo.png";
import { forgotPassword } from "../../services/AuthServices";
import { showToast } from "../../helpers";
import { ForgotPasswordFormSchema } from "../../helpers/schemas/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../components/custom/CustomSpinner";
import { Button, Form, FormFeedback, FormGroup, Label } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorResponse, ForgotPasswordDataType } from "../../types/AuthTypes";
import { isUserAuthenticated } from "../../helpers/tokens";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = isUserAuthenticated();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    resolver: yupResolver(ForgotPasswordFormSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const onSubmit: SubmitHandler<ForgotPasswordDataType> = async (data) => {
    try {
      setLoading(true);
      const response = await forgotPassword(data);
      if (response.status) {
        showToast("success", response.message);
        navigate("/login");
      }
      setLoading(false);
    } catch (error) {
      const err = error as ErrorResponse;
      if (err?.response?.data?.response?.message) {
        showToast("error", err.response.data.response.message);
      } else {
        showToast(
          "error",
          err?.response?.data?.title || "Something went wrong"
        );
      }
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
          <h6>Forgot Password</h6>
          <p>
            Please enter your registered email address and we <br /> will send
            you a link to reset your password.
          </p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {loading && <Loader />}
            <div className="mb-25">
              <FormGroup>
                <Label>Email Address<span className="asterisk">*</span></Label>
                <div className={"icon-wrapper"}>
                  <CustomInput
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    invalid={!!errors.email}
                    {...register("email")}
                  />
                  {!errors.email && (
                    <span className="material-symbols-outlined">mail</span>
                  )}
                  <FormFeedback>{errors.email?.message}</FormFeedback>
                </div>
              </FormGroup>
            </div>
            <div className="d-grid gap-2">
              <Button
                type="submit"
                style={{ margin: "3px" }}
                className="btn btn-primary login"
              >
                Send
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

export default ForgotPassword;
