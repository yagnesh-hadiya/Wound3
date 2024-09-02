import * as yup from "yup";
import { EMAIL_REGEX } from "../config";

export const AddEditFacilitySchema = yup.object().shape({
  facilityName: yup
    .string()
    .required("Facility Name is required")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9 ']+$/, "Invalid characters in Facility Name")
    .trim(),
  facilityAlias: yup
    .string()
    .required("Facility Alias is required")
    .max(10, "Max. length is 10")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9 ']+$/, "Invalid characters in Facility Alias")
    .trim(),
  facilityNetworkId: yup
    .object({
      value: yup.string().required("Facility Network Type is required"),
      label: yup.string().required("Facility Network Type is required"),
    })
    .nullable()
    .required("Facility Network Type is required"),
  facilityTypeId: yup
    .object({
      value: yup.number().required("Facility Type is required"),
      label: yup.string().required("Facility Type is required"),
    })
    .nullable()
    .required("Facility Type is required"),
  phone: yup
    .string()
    .required("Mobile number is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit mobile number"
    ),
  address: yup
    .string()
    .required("Address is required")
    .min(2, "Min. length is 2")
    .max(500, "Max. length is 500")
    .matches(/^[a-zA-Z0-9 ,.-]+$/, "Invalid characters in Address")
    .trim(),

  stateId: yup
    .object({
      value: yup.number().required("State is required"),
      label: yup.string().required("State is required"),
    })
    .nullable()
    .required("State is required"),

  cityId: yup
    .object({
      value: yup.number().required("City is required"),
      label: yup.string().required("City is required"),
    })
    .nullable()
    .required("City is required"),

  zipCode: yup
    .object({
      value: yup.string().required("Zip Code is required"),
      label: yup.string().required("Zip Code is required"),
    })
    .nullable()
    .required("Zip code is required"),
});

export const AddEditFacilityAdminSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9 ']+$/, "Invalid characters in First Name")
    .trim(),
  lastName: yup
    .string()
    .required("Last Name is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9 ']+$/, "Invalid characters in Last Name")
    .trim(),
  phone: yup
    .string()
    .required("Mobile number is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit mobile number"
    ),
  emailAddress: yup
    .string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Enter a valid email")
    .trim(),
});
