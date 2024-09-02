import * as yup from "yup";
import { EMAIL_REGEX } from "../config";

export const AddEditPatientSchema = yup.object().shape({
  insuranceTypeId: yup
    .object({
      value: yup.string().required("Insurance Type is required"),
      label: yup.string().required("Insurance Type is required"),
    })
    .nullable()
    .required("Insurance Type is required"),
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
  emailAddress: yup
    .string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Enter a valid email")
    .trim(),
  gender: yup
    .object({
      value: yup.string().required("Gender is required"),
      label: yup.string().required("Gender is required"),
    })
    .nullable()
    .required("Gender is required"),
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
  patientHealthID: yup
    .string()
    .required("Patient Health ID is required")
    .matches(/^\d{10}$/, "Enter a valid 10-digit Patient Health ID")
    .length(10, "Patient Health ID must be exactly 10 digits"),
  facilityId: yup
    .object({
      value: yup.string().required("Facility is required"),
      label: yup.string().required("Facility is required"),
    })
    .nullable()
    .required("Facility is required"),
  dateOfBirth: yup.string().nullable().required("Date Of Birth is required"),
  profileImage: yup.mixed().nullable().required("Profile Image is required"),
  providerId: yup
    .object({
      value: yup.string().required("Provider is required"),
      label: yup.string().required("Provider is required"),
    })
    .nullable()
    .required("Provider is required"),
});

export const AddEditDeviceSchema = yup.object().shape({
  deviceName: yup
    .string()
    .required("Device Name is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .trim(),
  serialNumber: yup
    .string()
    .required("Serial Number is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .trim(),
  appVersion: yup
    .string()
    .required("App Version is required")
    .max(10, "Max. length is 10")
    .min(1, "Min. length is 1")
    .trim(),
});

export const AddRecallSchema = yup.object().shape({
  recallReason: yup
    .string()
    .required("Recall Reason is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .trim(),
});

export const CreateFlagSchema = yup.object().shape({
  flagTitle: yup
    .string()
    .required("Flag Title is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .trim(),
  comments: yup
    .string()
    .required("Comment is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .trim(),
});

export const ReferPatientSchema = yup.object().shape({
  facilityId: yup
    .object({
      value: yup.string().required("Facility is required"),
      label: yup.string().required("Facility is required"),
    })
    .nullable()
    .required("Facility is required"),
  providerId: yup
    .object({
      value: yup.string().required("Provider is required"),
      label: yup.string().required("Provider is required"),
    })
    .nullable()
    .required("Provider is required"),
});
