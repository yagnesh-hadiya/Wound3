import { SelectOption, ZipCodeOption } from "./Index";

export interface ManageProviderType {
  srNo: number;
  userId: string;
  providerName: string;
  facility: string;
  contact: string;
  emailID: string;
  address: string;
  isActive: boolean;
}

export type AddEditProviderType = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  address: string;
  phone: string;
  stateId: number;
  cityId: number;
  zipCode: string;
  npi: string;
  facilityId: number;
  isActive?: boolean;
  userId?: string | null;
  updatedBy?: string | null;
};

export type AddEditFormDataType = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;
  address: string;
  stateId: SelectOption;
  cityId: SelectOption;
  zipCode: ZipCodeOption;
  npi: string;
  facilityId: any;
};
