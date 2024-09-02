import { JSXElementConstructor, ReactElement, ReactNode } from "react";

export type LoginFormDataType = {
  email: string;
  password: string;
};

export type OtpFormInputs = {
  otp: string;
};

export interface ErrorResponse {
  response?: {
    data?: {
      response?: {
        message?: string;
      };
      title?: string;
    };
    message?: string;
  };
}

export type ForgotPasswordDataType = {
  email: string;
};

export type ResetPasswordDataType = {
  password: string;
  confirmPassword: string;
};

export type ChangePasswordDataType = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export interface UserInfo {
  active: number;
  addressLine: string | null;
  dob: Date | null;
  email: string;
  firstName: string;
  gender: string | null;
  isFirstLogin: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
  lastName: string | null;
  passwordHash: string;
  passwordSalt: string;
  phone: string | null;
  profileId: string;
  profileImage: string | null;
  role: string;
  roleId: string | null;
  stateCityZipCodesId: string | null;
  token: string;
  userId: string;
  zipCode: string | null;
}

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  moduleIdStatus: boolean;
  isAdd: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
}

export type Permissions = "GET" | "POST" | "PUT" | "DELETE";

export type Allows = {
  module: string;
  permissions: Permissions[];
  submodules?: Allows[];
};

export interface ACLRouteProps {
  children: ReactNode;
  module: string;
  submodule: string | null;
  action: Permissions[];
}

export interface ACLProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  submodule: string;
  module: string;
  action: Permissions[];
}

export interface UserResponse {
  response: {
    status: boolean;
    message: string;
    data: UserInfo;
  };
  token: string;
  listModuleMappingGet: ModulePermission[];
}
