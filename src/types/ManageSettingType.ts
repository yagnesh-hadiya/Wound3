import { SelectOption } from "./Index";

export interface FilterFlagsAdd {
  flagId: string;
}

export interface FilterListType {
  filterId?: string;
  filterName: string;
  facilityName?: string;
  providerName?: string;
  patientName?: string;
  filterFlagsAdd?: FilterFlagsAdd[];
  flags?: string;
  operationBy?: string | null;
  updatedBy?: string | null;
  filterType?: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
}

export interface AddEditFilterFormType {
  filterName: string;
  filterType: SelectOption;
}
