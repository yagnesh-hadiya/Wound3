import { FilterListType } from "../types/ManageSettingType";
import api from "./api";

export const getFilterList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string,
  filterType: string | null
) => {
  const response = await api.get(
    filterType
      ? `api/settings?PageSize=${size}&Start=${page}&SearchKey=${search}&FilterType=${filterType}`
      : `api/settings?PageSize=${size}&Start=${page}&SearchKey=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return response?.data;
};

export const deleteFilterItem = async (userId: string) => {
  const response = await api.delete(`api/settings/${userId}`);
  return response.data;
};

export const addFilterItem = async (payload: FilterListType) => {
  const response = await api.post(`api/settings`, payload);
  return response.data;
};

export const updateFilterItem = async (payload: FilterListType) => {
  const response = await api.put(`api/settings`, payload);
  return response.data;
};

export const getFilterById = async (filterId: string) => {
  const response = await api.get(`api/settings/${filterId}`);
  return response.data;
};

export const getFlagList = async (selectedFilterType: string) => {
  const response = await api.get(`api/masters/?DdlType=${selectedFilterType}`);
  return response?.data;
};
