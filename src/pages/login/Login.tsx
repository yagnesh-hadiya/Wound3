import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import logo from "../../assets/login-logo.png";
import { showToast } from "../../helpers/index";
import { login } from "../../services/AuthServices";
import Loader from "../../components/custom/CustomSpinner";
import { LoginFormSchema } from "../../helpers/schemas/AuthSchema";
import { Button, Form, FormFeedback, FormGroup, Label } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import { isAxiosError } from "axios";
import { LoginFormDataType } from "../../types/AuthTypes";
import { isUserAuthenticated, setUserId } from "../../helpers/tokens";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormSchema),
  });

  const isAuthenticated = isUserAuthenticated();
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  const toggleShowPassword = () => {
    setShowPassword((prevValue) => !prevValue);
  };

  const onSubmit: SubmitHandler<LoginFormDataType> = async (data) => {
    try {
      setLoading(true);
      const response = await login(data);
      if (response?.loginStatus === "Success") {
        setLoading(false);
        setUserId(response.userId);
        showToast("success", response.message);
        navigate("/otp-verify");
      }
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message || "Something went wrong"
        );
      } else if (error instanceof Error) {
        showToast("error", error.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="auth-section">
        <div className="login-wrapper">
          <div className="logo-section">
            <img src={logo} alt="logo" className="img-logo" />
          </div>
          <div className="login-body">
            <div>
              <div className="login-wrapper-section">
                <h6>Welcome Back</h6>
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
                          <span className="material-symbols-outlined">
                            mail
                          </span>
                        )}
                        <FormFeedback>{errors.email?.message}</FormFeedback>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="mb-25">
                    <FormGroup>
                      <Label>Password<span className="asterisk">*</span></Label>
                      <div className="icon-wrapper">
                        <CustomInput
                          type={showPassword ? "password" : "text"}
                          placeholder="Password"
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
                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      style={{ margin: "3px" }}
                      className="btn btn-primary login"
                    >
                      Login
                    </Button>
                    <Link
                      to="/forgot-password"
                      className="forgot-link text-center"
                    >
                      Forgot Password
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
