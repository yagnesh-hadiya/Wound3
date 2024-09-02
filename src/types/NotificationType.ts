export type NotificationListType = {
  notificationId: number;
  toUserName: string;
  fromUserName: string;
  toUserId: string;
  fromUserId: string;
  body: string;
  type: string;
  sendDate: string;
  title: string;
  extraDataJson: string;
  isRead: boolean;
};
