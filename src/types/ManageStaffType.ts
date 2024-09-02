import { SelectOption, ZipCodeOption } from "./Index";

export interface ManageStaffType {
  active: boolean;
  address: string;
  contact: string;
  emailID: string;
  srNo: number;
  userId: string;
  firstName: string;
  lastName: string;
}
export type AddEditFormDataType = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;
  address: string;
  stateId: SelectOption;
  cityId: SelectOption;
  zipCode: ZipCodeOption;
};

export interface ModuleMapping {
  moduleId: number;
  moduleIdStatus?: boolean;
  isAdd: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
}

export interface AddEditStaffType {
  userId?: string | null;
  updatedBy?: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  emailAddress: string;
  address: string;
  stateId: number;
  cityId: number;
  zipCode: string;
  active?: boolean;
  createdBy?: string | null;
  lstModuleMapping: ModuleMapping[];
}

export interface ModuleType {
  id: number;
  value: string;
}

export type PermissionType = "isAdd" | "isUpdate" | "isDelete" | "isView";
