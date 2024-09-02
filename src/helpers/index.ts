import moment from "moment";
import { toast } from "react-toastify";
import { Allows, Permissions } from "../types/AuthTypes";
import { getAclPermissions } from "./tokens";

type DebounceFunction = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => (...args: T) => void;

export const debounce: DebounceFunction = (fn, delay) => {
  let timerId: any;
  return (...params) => {
    clearTimeout(timerId);
    timerId = setTimeout(fn, delay, ...params);
  };
};

export const showToast = debounce(
  (type: string, message: string | undefined) => {
    if (type.toLowerCase() === "success") {
      toast.success(message || "Success", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    } else if (type.toLowerCase() === "error") {
      toast.error(message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    }
  },
  1000
);

export const capitalize = (str: string): string => {
  return str
    .split(" ")
    .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatPhoneNumber = (inputNumber: string): string => {
  if (!inputNumber) {
    return "";
  }

  const cleaned: string = inputNumber.replace(/\D/g, "").slice(0, 10);
  const match = cleaned.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return `${match[1]}${match[2] ? `-${match[2]}` : ""}${
      match[3] ? `-${match[3]}` : ""
    }`;
  }
  return cleaned;
};

export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const day: string = date.getDate().toString().padStart(2, "0");
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const year: number = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const formatDate = (date: Date | string) => {
  if (!date) return "";
  return moment(date).format("YYYY-MM-DD");
};

export const headerDropdown = {
  control: (provided: any) => ({
    ...provided,
    maxWidth: "100%",
    width: "170px",
    //  height: '34px',
    border: "1px solid #EC6666",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any; isSelected: any }) => ({
    ...provided,
    background: state.isSelected ? "#FFFFFF" : "#fff",
    color: state.isSelected ? "#EC6666" : "#262638",
    cursor: "pointer",
    "&:hover": {
      borderColor: "1px solid #EC6666",
      outline: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#EC6666",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#EC6666",
    fontSize: "14px",
    overflow: "visible",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#EC6666",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#EC6666",
  }),
};

export const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${formattedDate} ${formattedTime}`;
};

export const formatCurrentDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const checkAclPermission = (
  module: string,
  submodule: string | null,
  action: Permissions[]
) => {
  try {
    const allows: Allows[] | null = getAclPermissions();
    if (!allows) {
      return false;
    }
    for (const allow of allows) {
      if (allow.module == module) {
        if (
          !submodule &&
          action.every((item) => allow.permissions.includes(item))
        ) {
          return true;
        }

        if (submodule && allow.permissions.includes("GET")) {
          for (const sub of allow.submodules!) {
            if (sub.module === submodule) {
              if (action.every((item) => sub.permissions.includes(item))) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Error while checking permissions", error);
    return false;
  }
};
