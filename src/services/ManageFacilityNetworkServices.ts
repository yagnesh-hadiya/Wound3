import { AddEditFacilityNetworkType } from "../types/ManageFacilityNetworkType";
import api from "./api";

export const getFacilityNetworkList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string
) => {
  const response = await api.get(
    `api/facilitynetwork/list?PageSize=${size}&Start=${page}&SearchKey=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return response?.data;
};

export const changeFacilityNetworkStatus = async (formData: {
  facilityNetworkId: string;
  isActive: boolean;
  updatedBy: string | null;
}) => {
  const response = await api.put(`api/facilitynetwork/statusupdate`, formData);
  return response.data;
};

export const deleteFacilityNetwork = async (facilityNetworkId: string) => {
  const response = await api.delete(`api/facilitynetwork/${facilityNetworkId}`);
  return response.data;
};

export const addFacilityNetwork = async (formData: AddEditFacilityNetworkType) => {
  const response = await api.post(`api/facilitynetwork`, formData);
  return response.data;
};

export const getFacilityNetworkById = async (
  facilityNetworkId: string | undefined
) => {
  const response = await api.get(`api/facilitynetwork?FacilityNetworkId=${facilityNetworkId}`);
  return response.data;
};

export const updateFacilityNetwork = async (formData: AddEditFacilityNetworkType) => {
  const response = await api.put(`api/facilitynetwork`, formData);
  return response.data;
};

