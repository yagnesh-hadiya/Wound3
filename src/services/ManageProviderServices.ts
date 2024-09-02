import { AddEditProviderType } from "../types/ManageProviderType";
import api from "./api";

export const getProviderList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string,
  selectedFacility: number | null
) => {
  const response = await api.get(
    selectedFacility
      ? `api/provider?PageSize=${size}&Start=${page}&SearchKey=${search}&FacilityId=${selectedFacility}`
      : `api/provider?PageSize=${size}&Start=${page}&SearchKey=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return response?.data;
};

export const changeProviderStatus = async (formData: {
  userId: string;
  isActive: boolean;
  createdBy: string;
}) => {
  const response = await api.put(`api/provider/statusupdate`, formData);
  return response.data;
};

export const deleteProvider = async (userId: string) => {
  const response = await api.delete(`api/provider/${userId}`);
  return response.data;
};

export const addProvider = async (payload: AddEditProviderType) => {
  const response = await api.post(`api/provider`, payload);
  return response.data;
};

export const updateProvider = async (payload: AddEditProviderType) => {
  const response = await api.put(`api/provider`, payload);
  return response.data;
};

export const getProviderByUserId = async (userId: string) => {
  const response = await api.get(`api/provider/${userId}`);
  return response.data;
};

export const getProvidersList = async (facilityId?: string) => {
  const response = await api.get(
    facilityId
      ? `api/masters/?DdlType=Provider&FacilityId=${facilityId}`
      : `api/masters/?DdlType=Provider`
  );
  return response.data;
};
