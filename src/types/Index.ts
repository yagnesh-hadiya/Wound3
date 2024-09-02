import { ChangeEvent } from "react";

export type LoadingType = "idle" | "loading" | "error";

export type CheckboxProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled: boolean;
  className?: string;
  id?: string;
};

export type SelectOption = {
  value: number;
  label: string;
};

export type ZipCodeOption = {
  value: string;
  label: string;
};

export type CheckboxValueType = {
  label: string;
  value: string;
  checked?: boolean;
};
