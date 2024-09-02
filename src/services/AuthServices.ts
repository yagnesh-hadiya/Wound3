import { removeToken, setToken } from "../helpers/tokens";
import { ForgotPasswordDataType, LoginFormDataType } from "../types/AuthTypes";
import api from "./api";

export const login = async (formData: LoginFormDataType) => {
  const response = await api.post("api/account/login", formData);
  return response.data;
};

export const verifyOtp = async (otp: {
  otp: string;
  userId: string;
  deviceToken: string;
  devicePlatform: string;
  deviceId: string;
}) => {
  const response = await api.post("api/account/otp/verify", otp);
  if (response?.data?.response?.status) {
    setToken(response.data.token);
    return response.data;
  }
};

export const resendOtp = async (userId: { userId: string | null }) => {
  const response = await api.post(`api/account/otp/resend`, userId);
  return response.data.response;
};

export const forgotPassword = async (email: ForgotPasswordDataType) => {
  const response = await api.post(`api/account/password/forgot`, email);
  return response.data.response;
};

export const resetPassword = async (formData: {
  email: string | undefined;
  emailToken: string | undefined;
  password: string;
}) => {
  const response = await api.post(`api/account/password/reset`, formData);
  return response.data.response;
};

export const changePassword = async (formData: {
  userId: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
  email: string;
  updatedBy: string;
}) => {
  const response = await api.post(`api/account/password/change`, formData);
  return response.data.response;
};

export const logout = async () => {
  removeToken();
  return true;
};
