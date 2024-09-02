import * as yup from "yup";

export const AddEditSettingSchema = yup.object().shape({
  filterName: yup
    .string()
    .required("Filter Name is required")
    .max(250, "Max. length is 250")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9 ']+$/, "Invalid characters in Filter Name")
    .trim(),
  filterType: yup
    .object({
      value: yup.number().required("Filter Type is required"),
      label: yup.string().required("Filter Type is required"),
    })
    .nullable()
    .required("Filter Type is required"),
});
