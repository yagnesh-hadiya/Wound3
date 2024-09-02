import { AddEditFacilityType } from "../types/ManageFacilitiesType";
import api from "./api";

export const getFacilitiesList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string
) => {
  const response = await api.get(
    `api/facility?PageSize=${size}&Start=${page}&SearchKey=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return response?.data;
};

export const changeFacilityStatus = async (formData: {
  facilityId: string;
  isActive: boolean;
  updatedBy: string | null;
}) => {
  const response = await api.put(`api/facility/statusupdate`, formData);
  return response.data;
};

export const deleteFacility = async (facilityId: string) => {
  const response = await api.delete(`api/facility/${facilityId}`);
  return response.data;
};

export const addFacility = async (formData: AddEditFacilityType) => {
  const response = await api.post(`api/facility`, formData);
  return response.data;
};

export const getFacilityById = async (facilityId: string | undefined) => {
  const response = await api.get(`api/facility/${facilityId}`);
  return response.data;
};

export const updateFacility = async (formData: AddEditFacilityType) => {
  const response = await api.put(`api/facility`, formData);
  return response.data;
};

export const getFacilityNetworkList = async () => {
  const response = await api.get(`api/masters/?DdlType=FacilityNetworkMaster`);
  return response.data;
};

export const getFacilityTypeList = async () => {
  const response = await api.get(`api/masters/?DdlType=FacilityType`);
  return response.data;
};

export const getFacilityList = async () => {
  const response = await api.get(`api/masters/?DdlType=Facility`);
  return response.data;
};
