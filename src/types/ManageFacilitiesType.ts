import { SelectOption, ZipCodeOption } from "./Index";

export interface ManageFacilitiesType {
  isActive: boolean;
  address: string;
  phone: string;
  emailID: string;
  srNo: number;
  facilityId: string;
  facilityAlias: string;
  facilityName: string;
  facilityType: string;
}

export type AddEditFormDataType = {
  facilityName: string;
  facilityAlias: string;
  facilityTypeId: SelectOption;
  facilityNetworkId: any;
  phone: string;
  address: string;
  stateId: SelectOption;
  cityId: SelectOption;
  zipCode: ZipCodeOption;
};

export type AddEditFacilityType = {
  facilityName: string;
  facilityAlias: string;
  facilityTypeId: string;
  facilityNetworkId: string;
  phone: string;
  address: string;
  stateId: number;
  cityId: number;
  zipCode: string;
  userId?: string;
  isActive?: boolean;
  facilityId?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  facilityAdminDetails?: FacilityAdminDetailsType[];
  facilityAdminUpdate?: FacilityAdminDetailsType[];
};

export interface FacilityAdminDetailsType {
  firstName: string;
  lastName: string;
  phone: string;
  emailAddress: string;
  isActive?: boolean;
  isAdmin?: boolean;
  roleId?: string;
  userId?: string | null;
}
