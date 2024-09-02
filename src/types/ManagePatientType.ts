import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SelectOption, ZipCodeOption } from "./Index";

export interface ManagePatientType {
  srNo: number;
  patientId: string;
  patientName: string;
  insurance: string;
  emailID: string;
  address: string;
  patientHealthID: string;
  status: boolean;
  profilePicUrl: string;
}

export interface ManageReferPatientType {
  patientId: string;
  patientName: string;
  referedToFacilityId: string;
  referedToProviderId: string;
  referedDatetime: string;
  referedByUserId: string;
  referedByUserName: string;
  referedPatientPermissionStatus: string;
  referalId: number;
  profilePicUrl: string;
  patientHealthID: string;
}

export type AddEditPatientType = {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Address: string;
  Phone: string;
  StateId: number;
  CityId: number;
  ZipCode: string;
  InsuranceTypeId: string;
  PatientHealthID: string;
  FacilityId: string;
  IsActive?: boolean;
  UpdatedBy?: string | null;
  CreatedBy?: string | null;
  GenderId: string;
  DateOfBirth: string;
  ProfileImage: File | null;
};

export type AddEditFormDataType = {
  insuranceTypeId: any;
  firstName: string;
  providerId: any;
  lastName: string;
  emailAddress: string;
  gender: any;
  phone: string;
  address: string;
  stateId: SelectOption;
  cityId: SelectOption;
  zipCode: ZipCodeOption;
  patientHealthID: string;
  facilityId: any;
  dateOfBirth: string;
  profileImage: any;
};

export interface AddEditPatientProps {
  loading: "loading" | "idle" | "error";
  id?: string;
  control: Control<AddEditFormDataType>;
  handleSubmit: any;
  onSubmit: (data: AddEditFormDataType) => void;
  errors: Record<string, any>;
  register: UseFormRegister<AddEditFormDataType>;
  setValue: UseFormSetValue<AddEditFormDataType>;
  selectedInsuranceType: SelectOption | null;
  handleInsuranceTypeChange: (val: SelectOption | null) => void;
  insuranceType: SelectOption[];
  selectedGender: SelectOption | null;
  handleGenderChange: (val: SelectOption | null) => void;
  gender: SelectOption[];
  dateOfBirth: Date | null;
  setDateOfBirth: (date: Date | null) => void;
  selectedState: SelectOption | null;
  handleStateChange: (val: SelectOption | null) => void;
  states: SelectOption[];
  selectedCity: SelectOption | null;
  handleCityChange: (val: SelectOption | null) => void;
  cities: SelectOption[];
  selectedZip: SelectOption | null;
  handleZipCodeChange: any;
  zip: SelectOption[];
  profileImageUrl: string | null;
  handleDeleteImage: () => void;
  profileImage: File | null;
  handleDocUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFacility: SelectOption | null;
  selectedProvider: SelectOption | null;
  handleFacilityChange: (val: SelectOption | null) => void;
  facility: SelectOption[];
  handleProviderChange: (val: SelectOption | null) => void;
  provider: SelectOption[];
}

export interface PatientInfo {
  patientId: string;
  patientsID: string;
  insuranceTypeId: number;
  patientHealthID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  emailAddress: string;
  address: string;
  stateId: number;
  cityId: number;
  state: string;
  city: string;
  zipCode: string;
  facilityId: string;
  facilityName: string;
  isActive: boolean;
  genderId: number;
  bucketSpecifier: string;
  fileName: string;
  profilePicUrl: string;
}

export interface DeviceConfigurationType {
  patientId: string;
  deviceid: string;
  deviceName: string;
  serialNumber: string;
  version: string;
  installedOn: string;
  createdBy: string;
  recall: boolean;
}

export interface WoundProfileListType {
  dateCreated: string;
  lastUpdated: string;
  woundId: string;
  woundName?: string;
  woundProfileId: string;
  woundProfileNo: string;
  woundProfileLink: string;
}

export interface AddEditDeviceDataType {
  deviceName: string;
  serialNumber: string;
  appVersion: string;
  patientId?: string;
  deviceid?: string;
  appInstalledOn?: string;
  updatedBy?: string;
  createdBy?: string;
}

export interface AddRecallDataType {
  deviceId?: string;
  recallReason: string;
  updatedBy?: string;
  isRecall?: boolean;
}

interface FlagsTitle {
  titles: string;
}
export interface WoundScanListType {
  woundScanId: string;
  scanDateTime: string;
  scanTime: string;
  flagsTitles: FlagsTitle[];
}

export interface WoundHistoryListType {
  woundScanId: string;
  scanDateTime: string;
  volume: number;
  area: number;
  depth: number;
  volumeText: string;
  areaText: string;
  depthText: string;
  volumeDelta: number | null;
  areaDelta: number | null;
  depthDelta: number | null;
  bucketSpecifier: string | null;
  documentName: string | null;
  plyLink: string;
}

export interface SymptomCheck {
  id: string;
  parentNoteID: string;
  question: string;
  response: string;
}

export interface Note {
  id: string;
  parentScanID: string;
  date: string;
  description: string;
  painRating: string;
  symptomChecks: SymptomCheck[];
}

export interface Subscan {
  id: string;
  parentScanId: string;
  index: string;
  volume: string;
  depth: string;
  area: string;
  subscanMask: string;
  maskPath: string;
}

export interface Tag {
  id: string;
  parentScanID: string;
  label: string;
  description: string;
}

export interface ViewScanDetailsType {
  id: string;
  parentPatientId: string;
  date: string;
  plyPath: string;
  rgbPath: string;
  imagePath: string;
  depthMapPath: string;
  denoisingRGBPath: string;
  denoisingDepthMaps: string;
  cameraProperties: string;
  inverseLenseLookup: string;
  parentDepth: string;
  parentArea: string;
  parentVolume: string;
  subscans: Subscan[];
  notes: Note[];
  tags: Tag[];
}

export interface FlagListType {
  id: string;
  value: string;
}

export interface CreateFlagDataType {
  flagTitle: string;
  comments: string;
  createdBy?: string;
  flagId?: string;
}
export interface UpdateFlagDataType {
  patientId: string;
  woundScanId: string;
  flagId: string;
  updatedBy: string;
}

export interface ReferPatientFormType {
  facilityId: any;
  providerId: any;
}

export interface ReferPatientPayloadType {
  facilityId: string;
  userId: string;
  patientId: string;
  updatedBy: string;
  patientNumber: string;
}

export interface ReferPatientRequest {
  patientId: string;
  referalId: number;
  loggedInUserId: string;
}
