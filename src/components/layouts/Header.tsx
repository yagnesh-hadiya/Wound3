import React, { useEffect, useState } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Bell from "../../assets/notification.svg";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthServices";
import ChangePassword from "../../pages/changePassword/ChangePassword";
import { getUserInfo } from "../../helpers/tokens";
import { UserInfo } from "../../types/AuthTypes";
import { capitalize, debounce, showToast } from "../../helpers";
import {
  getNotificationList,
  readNotification,
} from "../../services/NotificationServices";
import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";
import { API_NOTIFICATION_URL } from "../../helpers/config";
import { NotificationListType } from "../../types/NotificationType";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState<
    NotificationListType[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const val = await getUserInfo();
      setUserInfo(val);
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const connectSignalR = async () => {
      const newConnection = new HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(API_NOTIFICATION_URL, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .build();

      setConnection(newConnection);
    };

    connectSignalR();

    return () => {
      if (connection) {
        connection
          .stop()
          .then(() => console.log("SignalR connection stopped."));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connection && userInfo) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub!");

          connection
            .invoke("AssignConnectionIdAsync", userInfo.userId, userInfo.role)
            .then(() => console.log("Connection ID assigned successfully"))
            .catch((err: any) =>
              console.error("Error while assigning connection ID: ", err)
            );

          connection.on("OnUserAddedOrDeleted", (notification) => {
            console.log("OnUserAddedOrDeleted", notification);
            getNotificationData();
          });
        })
        .catch((err) =>
          console.error("Error while starting connection: ", err)
        );

      return () => {
        connection
          .stop()
          .then(() => console.log("SignalR connection stopped."));
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, userInfo]);

  useEffect(() => {
    if (userInfo) {
      getNotificationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const getNotificationData = debounce(async (loadMore = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const currentPage = loadMore ? page + 100 : 0;
      const { data, totalRecords } = await getNotificationList(
        100,
        currentPage,
        userInfo?.userId ?? ""
      );
      setNotificationList((prevList) =>
        loadMore ? [...prevList, ...data] : data
      );
      setTotalRecords(totalRecords);
      setPage(currentPage);
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !loading &&
        notificationList.length < totalRecords
      ) {
        getNotificationData(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, notificationList, totalRecords]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleLogout = async () => {
    const response = await logout();
    if (response) {
      navigate("/login");
    }
  };

  const userInitials = `${userInfo?.firstName?.[0]?.toUpperCase() ?? ""}${
    userInfo?.lastName?.[0]?.toUpperCase() ?? ""
  }`;

  const handleReadNotification = async (
    id: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    const payload = {
      notifications: [
        {
          notificationId: id,
          isRead: true,
        },
      ],
    };

    try {
      const res = await readNotification(payload);
      if (res.status) {
        setNotificationList((prevList) =>
          prevList.map((notification) =>
            notification.notificationId === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } else {
        showToast("error", "Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Error reading notification:", error);
      showToast("error", "Something went wrong");
    }
  };

  const handleMarkAllAsRead = async () => {
    const payload = {
      notifications: notificationList.map((notification) => ({
        notificationId: notification.notificationId,
        isRead: true,
      })),
    };

    try {
      const res = await readNotification(payload);
      if (res.status) {
        setNotificationList((prevList) =>
          prevList.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      } else {
        showToast("error", "Failed to mark all notifications as read.");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showToast("error", "Something went wrong");
    }
  };

  const unreadCount = notificationList.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="header-wrapper">
      <div className="header-content">
        <div className="burger">
          <div className="icon-img">
            <span
              className="material-symbols-outlined menu"
              onClick={() => toggleSidebar(!isOpen)}
              style={{ paddingLeft: isOpen ? 300 : 100 }}
            >
              menu_open
            </span>
            <div className="d-flex align-items-center">
              {userInfo?.role !== "Staff" && (
                <div className="view-select-wrappers bell-wrap">
                  <span className="notification">{unreadCount}</span>
                  <UncontrolledDropdown className="me-2" direction="end">
                    <DropdownToggle caret className="notification-icon">
                      <img src={Bell} alt="menu" className="menu-bell-img" />
                    </DropdownToggle>
                    <DropdownMenu>
                      {unreadCount > 0 && (
                        <>
                          <DropdownItem header>
                            <h6
                              className="add-wrapper-section d-flex justify-content-end"
                              onClick={handleMarkAllAsRead}
                              style={{ cursor: "pointer" }}
                            >
                              Mark all as read
                            </h6>
                          </DropdownItem>
                          <DropdownItem divider className="m-0" />
                        </>
                      )}
                      {notificationList.length ? (
                        <>
                          {notificationList.map((val, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                style={{
                                  background: !val.isRead ? "aliceblue" : "",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center justify-content-between w-100"
                                  onClick={(event) => {
                                    if (val.isRead) {
                                      return;
                                    }
                                    handleReadNotification(
                                      val.notificationId,
                                      event
                                    );
                                  }}
                                >
                                  <div className="notification-item">
                                    <span>{val.body}</span>
                                    <span>{val.sendDate}</span>
                                  </div>
                                  {!val.isRead && (
                                    <span className="notification-count">
                                      1
                                    </span>
                                  )}
                                </div>
                              </DropdownItem>
                            );
                          })}
                          {loading && (
                            <div className="loading-spinner">Loading...</div>
                          )}
                        </>
                      ) : (
                        <p className="ps-2">No record found.</p>
                      )}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              )}
              <div className="user-name ms-4">
                <span className="text">{userInitials}</span>
              </div>
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  {`${capitalize(userInfo?.firstName ?? "")} ${capitalize(
                    userInfo?.lastName ?? ""
                  )}`}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={toggleModal}>
                    <div className="user-name">
                      <span className="material-symbols-outlined">
                        lock_open
                      </span>
                    </div>
                    Change Password
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>
                    <div className="user-name">
                      <span className="material-symbols-outlined">logout</span>
                    </div>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ChangePassword isOpen={isModalOpen} toggle={toggleModal} />
      )}
    </div>
  );
};

export default Header;
