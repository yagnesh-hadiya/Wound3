import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import headerLogo from "../../assets/header-logo.png";
import { resendOtp, verifyOtp } from "../../services/AuthServices";
import { showToast } from "../../helpers";
import CustomInput from "../../components/custom/CustomInput";
import { Button, Form, FormFeedback, FormGroup } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { OtpFormSchema } from "../../helpers/schemas/AuthSchema";
import Loader from "../../components/custom/CustomSpinner";
import { OtpFormInputs, ErrorResponse } from "../../types/AuthTypes";
import {
  getUserId,
  isUserAuthenticated,
  setAccessPermission,
  setUserInfo,
} from "../../helpers/tokens";

const OtpVerify: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<OtpFormInputs>({
    resolver: yupResolver(OtpFormSchema),
  });

  const isAuthenticated = isUserAuthenticated();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const onSubmit: SubmitHandler<OtpFormInputs> = async (data) => {
    if (userId) {
      try {
        const userOtpInfo = {
          otp: data.otp,
          userId: userId,
          deviceToken: "",
          devicePlatform: "",
          deviceId: "",
        };
        setLoading(true);

        const res = await verifyOtp(userOtpInfo);
        if (res.response.status) {
          setUserInfo(res.response.data);
          setAccessPermission(res);
          showToast("success", res.response.message);
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        const err = error as ErrorResponse;
        const errorMessage =
          err.response?.data?.response?.message ||
          err.response?.data?.title ||
          "Something went wrong";
        showToast("error", errorMessage);
        setLoading(false);
      }
    } else {
      showToast("error", "Something went wrong");
      navigate("/");
    }
  };

  const onResendOtpClick = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const formData = {
      userId: userId,
    };
    try {
      setLoading(true);
      const response = await resendOtp(formData);
      if (response.status) {
        showToast("success", response.message);
        setLoading(false);
      }
    } catch (error) {
      const err = error as ErrorResponse;
      const errorMessage = err.response?.message || "Something went wrong";
      showToast("error", errorMessage);
      setLoading(false);
    }
  };

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    input.value = input.value.replace(/\D/g, "");
  };

  return (
    <>
      <div className="card-main-wrapper">
        <Card className="card-content">
          <Card.Body className="card-body-content">
            <div className="header-logo text-center">
              <img src={headerLogo} alt="logo" className="img-logo" />
            </div>
            <h6>Enter OTP</h6>
            <p>
              Enter One Time Password (OTP) sent to <br /> your Email Address
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {loading && <Loader />}
              <div className="otp-wrapper">
                <FormGroup>
                  <div className={"otp-wrapper"}>
                    <CustomInput
                      type="text"
                      id="otp"
                      invalid={!!errors.otp}
                      onInput={handleOtpInput}
                      {...register("otp")}
                      maxLength={6}
                    />
                    <FormFeedback>{errors.otp?.message}</FormFeedback>
                  </div>
                </FormGroup>
              </div>
              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  style={{ margin: "3px" }}
                  className="btn btn-primary login"
                >
                  Verify
                </Button>
                <span
                  className="resend-link text-center"
                  onClick={onResendOtpClick}
                >
                  Resend OTP
                </span>
                <Link to="/login" className="resend-link text-center">
                  Back to Login
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default OtpVerify;
