import api from "./api";

export const getNotificationList = async (
  size: number,
  page: number,
  toUserId: string
) => {
  const response = await api.get(
    `api/notification?ToUserId=${toUserId}&PageSize=${size}&Start=${page}`
  );
  return response?.data;
};

export const readNotification = async (payload: any) => {
  const response = await api.post(`api/notification/read`, payload);
  return response.data;
};
