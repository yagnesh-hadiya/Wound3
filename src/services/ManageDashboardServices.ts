import api from "./api";

export const getLatestScanList = async (
  size: number,
  page: number,
  facilityId: string | null
) => {
  const response = await api.get(
    `api/dashboard/scans?PageSize=${size}&Start=${page}&facilityId=${facilityId}`
  );
  return response?.data;
};

export const getDashboardCount = async (
  facilityId: string | null,
  loggedInUserId: string
) => {
  const response = await api.get(
    `api/dashboard/?FacilityId=${facilityId}&LoggedInUserId=${loggedInUserId}`
  );
  return response?.data;
};
