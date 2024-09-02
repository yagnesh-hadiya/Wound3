import { object, ref, string } from "yup";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../config";

// Common validation functions
const requiredField = (fieldName: string) =>
  string().required(`${fieldName} is required`);

const emailField = () =>
  requiredField("Email").matches(EMAIL_REGEX, "Enter a valid email");

const passwordField = (fieldName: string) =>
  string()
    .required(`${fieldName} is required`)
    .max(20, "Max. length is 20")
    .min(6, "Min. length is 6")
    .matches(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase, one lowercase, one number, and one special character"
    );

const otpField = () =>
  requiredField("OTP")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .trim();

// Schemas
export const LoginFormSchema = object({
  email: emailField().trim(),
  password: passwordField("Password"),
});

export const ForgotPasswordFormSchema = object({
  email: emailField().trim(),
});

export const ResetPasswordSchema = object({
  password: passwordField("New Password").label("New Password"),
  confirmPassword: requiredField("Confirm New Password").oneOf(
    [ref("password")],
    "Passwords don't match"
  ),
});

export const OtpFormSchema = object({
  otp: otpField(),
});

export const ChangePasswordSchema = object({
  oldPassword: passwordField("Current Password").label("Current Password"),
  password: passwordField("New Password")
    .label("New Password")
    .test(
      "not-same-as-current",
      "New Password cannot be the same as the Current Password",
      function (value) {
        return value !== this.parent.oldPassword;
      }
    ),
  confirmPassword: requiredField("Confirm New Password").oneOf(
    [ref("password")],
    "New Password and Confirm Password must match."
  ),
});
