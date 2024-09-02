import { SelectOption, ZipCodeOption } from "./Index";

export interface ManageFacilityNetworkType {
  isActive: boolean;
  address: string;
  phone: string;
  srNo: number;
  facilityNetworkId: string;
  facilityNetworkAlias: string;
  facilityNetworkName: string;
}

export type AddEditFormDataType = {
  facilityNetworkName: string;
  facilityNetworkAlias: string;
  phone: string;
  address: string;
  stateId: SelectOption;
  cityId: SelectOption;
  zipCode: ZipCodeOption;
};

export type AddEditFacilityNetworkType = {
  facilityNetworkName: string;
  facilityNetworkAlias: string;
  phone: string;
  address: string;
  stateId: number;
  cityId: number;
  zipCode: string;
  userId?: string;
  isActive?: boolean;
  facilityNetworkId?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  facilityAdminDetails?: FacilityNetworkAdminDetailsType[];
  facilityAdminUpdate?: FacilityNetworkAdminDetailsType[];
};

export interface FacilityNetworkAdminDetailsType {
  firstName: string;
  lastName: string;
  phone: string;
  emailAddress: string;
  isActive?: boolean;
  roleId?: string;
  userId?: string | null;
}
