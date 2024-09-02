import {
  AddEditDeviceDataType,
  AddEditPatientType,
  AddRecallDataType,
  CreateFlagDataType,
  ReferPatientPayloadType,
  ReferPatientRequest,
  UpdateFlagDataType,
} from "../types/ManagePatientType";
import api from "./api";

export const getPatientList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string,
  selectedFacility: number | null,
  selectedProvider: number | null
) => {
  let url = `api/patient?PageSize=${size}&Start=${page}&SearchKey=${search}`;

  if (selectedFacility) {
    url += `&FacilityId=${selectedFacility}`;
  }

  if (selectedProvider) {
    url += `&ProviderId=${selectedProvider}`;
  }

  const response = await api.get(url, {
    signal: abortController.signal,
  });

  return response?.data;
};

export const getReferPatientList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string,
  providerId: string
) => {
  const response = await api.get(
    `api/patient/referedpatient/list?PageSize=${size}&Start=${page}&SearchKey=${search}&ProviderId=${providerId}`,
    {
      signal: abortController.signal,
    }
  );
  return response?.data;
};

export const changePatientStatus = async (formData: {
  patientId: string;
  isActive: boolean;
  updatedBy: string;
}) => {
  const response = await api.put(`api/patient/patientStatusUpdate`, formData);
  return response.data;
};

export const deletePatient = async (patientId: string) => {
  const response = await api.delete(`api/patient/${patientId}`);
  return response.data;
};

export const addPatient = async (payload: AddEditPatientType) => {
  const response = await api.post(`api/patient`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePatient = async (payload: AddEditPatientType) => {
  const response = await api.put(`api/patient`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getPatientByUserId = async (patientId: string) => {
  const response = await api.get(`api/patient/${patientId}`);
  return response.data;
};

export const getInsuranceTypeList = async () => {
  const response = await api.get(`api/masters/?DdlType=InsuranceType`);
  return response.data;
};

export const getGenderList = async () => {
  const response = await api.get(`api/masters/?DdlType=Gender`);
  return response.data;
};

export const getDeviceList = async (
  size: number,
  page: number,
  patientId: string
) => {
  const response = await api.get(
    `api/device?Patientid=${patientId}&PageSize=${size}&Start=${page}`
  );
  return response?.data;
};

export const getWoundProfileList = async (
  size: number,
  page: number,
  patientId: string
) => {
  const response = await api.get(
    `api/woundprofile/woundProfileList?Patientid=${patientId}&PageSize=${size}&Start=${page}`
  );
  return response?.data;
};

export const deleteDevice = async (
  deviceId: string,
  patientId: string,
  deletedBy: string
) => {
  const response = await api.delete(
    `api/device?deviceId=${deviceId}&patientId=${patientId}&deletedBy=${deletedBy}`
  );
  return response.data;
};

export const addDevice = async (payload: AddEditDeviceDataType) => {
  const response = await api.post(`api/device`, payload);
  return response.data;
};

export const updateDevice = async (payload: AddEditDeviceDataType) => {
  const response = await api.put(`api/device`, payload);
  return response.data;
};

export const getDeviceByUserId = async (id: string) => {
  const response = await api.get(`api/device/${id}`);
  return response.data;
};

export const deviceRecall = async (payload: AddRecallDataType) => {
  const response = await api.put(`api/device/deviceRecall`, payload);
  return response.data;
};

export const getWoundScanList = async (
  size: number,
  page: number,
  patientId: string,
  woundProfileId: string
) => {
  const response = await api.get(
    `api/woundprofile/woundScanList?Patientid=${patientId}&WoundProfileId=${woundProfileId}&PageSize=${size}&Start=${page}`
  );
  return response?.data;
};

export const getWoundHistoryList = async (
  size: number,
  page: number,
  patientId: string,
  woundProfileId: string
) => {
  const response = await api.get(
    `api/woundprofile/woundHistoryList?Patientid=${patientId}&WoundProfileId=${woundProfileId}&PageSize=${size}&Start=${page}`
  );
  return response?.data;
};

export const getDocumentScanDetails = async (
  patientId: string,
  woundScanId: string
) => {
  const response = await api.get(
    `api/patients/documents/scan/details?PatientId=${patientId}&WoundScanId=${woundScanId}`
  );
  return response?.data;
};

export const getSelectedFlagList = async (
  patientId: string,
  woundScanId: string
) => {
  const response = await api.get(
    `api/scanFlag/woundscan/flags?PatientId=${patientId}&WoundScanId=${woundScanId}`
  );
  return response?.data;
};

export const getFlagList = async () => {
  const response = await api.get(`api/masters/?DdlType=FlagMaster`);
  return response?.data;
};

export const createFlag = async (payload: CreateFlagDataType) => {
  const response = await api.post(`api/scanFlag`, payload);
  return response.data;
};

export const deleteFlagItem = async (
  scanFlagId: string,
  patientId: string,
  woundScanId: string,
  userId: string
) => {
  const response = await api.delete(
    `api/scanFlag?patientId=${patientId}&FlagId=${scanFlagId}&WoundScanId=${woundScanId}&DeletedBy=${userId}`
  );
  return response.data;
};

export const updateFlagItem = async (payload: UpdateFlagDataType) => {
  const response = await api.put(`api/scanFlag`, payload);
  return response.data;
};

export const patientRefer = async (payload: ReferPatientPayloadType) => {
  const response = await api.post(`api/patient/refer`, payload);
  return response.data;
};

export const requestForPatient = async (payload: ReferPatientRequest) => {
  const response = await api.post(`api/patient/request/permission`, payload);
  return response.data;
};

export const downloadPdf = async (patientId: string, woundScanId: string) => {
  const response = await api.post(
    `api/patients/documents/patientappointment/pdf?PatientId=${patientId}&WoundScanId=${woundScanId}`
  );
  return response.data;
};
