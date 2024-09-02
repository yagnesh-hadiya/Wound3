import { AddEditStaffType } from "../types/ManageStaffType";
import api from "./api";

export const getStaffList = async (
  size: number,
  abortController: AbortController,
  page: number,
  search: string
) => {
  const response = await api.get(
    `api/Staff?PageSize=${size}&Start=${page}&SearchKey=${search}`,
    {
      signal: abortController.signal,
    }
  );
  return response?.data;
};

export const changeStaffStatus = async (formData: {
  userId: string;
  active: boolean;
}) => {
  const response = await api.put(`api/staff/statusupdate`, formData);
  return response.data;
};

export const deleteStaff = async (userId: string) => {
  const response = await api.delete(`api/staff/${userId}`);
  return response.data;
};

export const addStaff = async (payload: AddEditStaffType) => {
  const response = await api.post(`api/staff`, payload);
  return response.data;
};

export const updateStaff = async (payload: AddEditStaffType) => {
  const response = await api.put(`api/staff`, payload);
  return response.data;
};

export const getStaffByUserId = async (userId: string) => {
  const response = await api.get(`api/staff/${userId}`);
  return response.data;
};

export const getModuleList = async () => {
  const response = await api.get(`api/masters?DdlType=StaffModuleMaster`);
  return response.data;
};

export const getCityStateByZip = async (zipcode: any) => {
  const response = await api.get(
    `api/masters/?DdlType=ZipCode&ZipCode=${zipcode}`
  );
  return response.data;
};

export const getStates = async () => {
  const response = await api.get(`api/masters/?DdlType=State`);
  return response.data;
};

export const getAllZipCode = async (
  pageNo: number,
  perPage: number,
  search: string
) => {
  const response = await api.get(
    `api/masters/?DdlType=AllZipCodeList&ZipCode=${search}&Start=${pageNo}&PageSize=${perPage}`
  );
  return response.data;
};

export const getStateAndCityBasedOnZipCode = async (
  zipCode: number | string
) => {
  const response = await api.get(
    `api/masters/statecity?DdlType=StateAndCity&ZipCode=${zipCode}`
  );
  return response.data;
};

export const getCities = async (stateId: number | string) => {
  const response = await api.get(
    `api/masters/?DdlType=City&StateId=${stateId}`
  );
  return response.data;
};

export const getZipCode = async (stateId: number, cityId: number | string) => {
  const response = await api.get(
    `api/masters/?DdlType=ZipCode&StateId=${stateId}&CityId=${cityId}`
  );
  return response.data;
};
