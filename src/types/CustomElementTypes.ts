import { MenuPlacement } from "react-select";
import { CardProps } from "reactstrap";
import { ButtonProps } from "reactstrap";
import { InputProps } from "reactstrap";
import { CSSProperties, ReactNode } from "react";
export interface CustomButtonProps extends ButtonProps {
  style?: React.CSSProperties;
  className: string;
}
export interface CustomMainCard extends CardProps {
  style?: React.CSSProperties;
}
export interface CheckboxProps {
  label: string;
}
export interface CustomInputProps extends InputProps {
  styles?: React.CSSProperties;
  onClick?: () => void;
}
export interface CommonPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export interface RadioBtnProps {
  name: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  selected: string;
  disabled?: boolean;
  className?: string;
}
export interface RadioProps {
  name: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  value?: { label: string; value: string };
}
export interface LoaderProps {
  styles?: React.CSSProperties;
}
export interface CustomTextAreaProps extends InputProps {
  styles?: React.CSSProperties;
}
export interface ToggleSwitchProps {
  onToggle?: (value: boolean) => void;
  onStateChange: (value: boolean) => void;
  checked?: boolean;
  disabled?:boolean
}
export interface CustomSelectProps {
  id: string;
  name: string;
  options: { value: number; label: string }[];
  noOptionsMessage?: () => string;
  placeholder: string;
  className?: string;
  value?: { value: number; label: string | ReactNode } | null;
  onChange: (selectedOption: { value: number; label: string } | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  menuPlacement?: MenuPlacement;
  styles?: Record<string, never>;
  invalid?: boolean;
}

export interface CustomBooleanSelectProps {
  id: string;
  name: string;
  options: { value: number; label: string }[];
  noOptionsMessage: () => string;
  placeholder: string;
  className?: string;
  value?: { value: boolean; label: string } | null;
  onChange: (selectedOption: { value: boolean; label: string } | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  menuPlacement?: MenuPlacement;
  styles?: Record<string, never>;
}

export interface CustomDeleteBtnProps {
  disabled?: boolean;
  onDelete: () => void;
  id?: string;
  tooltipText?: string;
  allow?: boolean;
}
export interface CustomEditBtnProps {
  onEdit: () => void;
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
  tooltipText?: string;
  allow?: boolean;
}

export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => Promise<void>;
  onPageSizeChange: (newSize: number) => void;
  entriesPerPage: number;
}

export type CustomErrorMessageProps = {
  error?: any;
  className?: string;
  style?: CSSProperties;
};
