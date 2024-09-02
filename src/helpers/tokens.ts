import { Allows, UserInfo, UserResponse } from "../types/AuthTypes";

export const getToken = () => {
  const token = localStorage.getItem("access-token");
  return token;
};

export const setToken = async (accessToken: string) => {
  localStorage.setItem("access-token", accessToken);
};

export const removeToken = async () => {
  localStorage.removeItem("access-token");
  localStorage.removeItem("userInfo");
  localStorage.clear();
};

export const isUserAuthenticated = () => {
  const token: string | null = localStorage.getItem("access-token");
  return !!token;
};

export const setUserId = async (val: string) => {
  localStorage.setItem("userId", val);
};

export const setUserInfo = async (val: UserInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(val));
};

export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const getUserId = async () => {
  return localStorage.getItem("userId");
};

const adminACLPermission = [
  {
    module: "Dashboard",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Staff",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Facility Network",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Facility Network",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Facilities",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Providers",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Patients",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Settings",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
];

const facilitiesNetworkAdminACLPermission = [
  // {
  //   module: "Dashboard",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  // {
  //   module: "Manage Staff",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  // {
  //   module: "Manage Facility Network",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  {
    module: "Manage Facilities",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Providers",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  // {
  //   module: "Manage Patients",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  // {
  //   module: "Settings",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
];

const facilitiesAdminACLPermission = [
  {
    module: "Dashboard",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  // {
  //   module: "Manage Staff",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  // {
  //   module: "Manage Facilities",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  {
    module: "Manage Providers",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Patients",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  // {
  //   module: "Settings",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
];
const facilitiesStaffACLPermission = [
  {
    module: "Dashboard",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  // {
  //   module: "Manage Staff",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  // {
  //   module: "Manage Facilities",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  {
    module: "Manage Providers",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  {
    module: "Manage Patients",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
  // {
  //   module: "Settings",
  //   permissions: ["GET", "POST", "PUT", "DELETE"],
  //   submodules: [],
  // },
  // {
];

const providerACLPermission = [
  {
    module: "Manage Patients",
    permissions: ["GET", "POST", "PUT", "DELETE"],
    submodules: [],
  },
];

const createStaffPermission = (items: UserResponse["listModuleMappingGet"]) => {
  const staffPermissionVal =
    items?.map((item) => {
      const permissions = [
        item.isView && "GET",
        item.isAdd && "POST",
        item.isUpdate && "PUT",
        item.isDelete && "DELETE",
      ].filter(Boolean) as string[];

      return {
        module: item.moduleName,
        permissions,
        submodules: [],
      };
    }) || [];
  // const newItems: ModulePermission[] = [
  //   { module: "Dashboard", permissions: ["GET", "POST", "PUT", "DELETE"], submodules: [] },
  //   { module: "Settings", permissions: ["GET", "POST", "PUT", "DELETE"], submodules: [] },
  // ];

  // return [...staffPermissionVal, ...newItems];

  return staffPermissionVal;
};

export const setAccessPermission = async (val: UserResponse): Promise<void> => {
  const role = val.response.data.role;

  let aclPermissions;

  switch (role) {
    case "Staff":
      aclPermissions = createStaffPermission(val.listModuleMappingGet);
      break;
    case "Facility Network Admin":
      aclPermissions = facilitiesNetworkAdminACLPermission;
      break;
    case "Facility Admin":
      aclPermissions = facilitiesAdminACLPermission;
      break;
    case "Facility Staff":
      aclPermissions = facilitiesStaffACLPermission;
      break;
    case "Provider":
      aclPermissions = providerACLPermission;
      break;
    case "Admin":
      aclPermissions = adminACLPermission;
      break;
    default:
      throw new Error(`Unknown role: ${role}`);
  }

  localStorage.setItem("acl-permissions", JSON.stringify(aclPermissions));
};

export const getAclPermissions = (): Allows[] | null => {
  try {
    const permissions = localStorage.getItem("acl-permissions");
    if (!permissions) {
      return null;
    }

    return JSON.parse(permissions);
  } catch (error) {
    console.error("Error while getting permissions", error);
    return null;
  }
};
