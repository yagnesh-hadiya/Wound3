import React, { ForwardedRef } from "react";
import Select, { StylesConfig } from "react-select";
import { CustomSelectProps } from "../../types/CustomElementTypes";

const CustomSelect = React.forwardRef<
  ForwardedRef<HTMLDivElement>,
  CustomSelectProps
>(
  (
    {
      styles,
      id,
      name,
      options,
      noOptionsMessage,
      placeholder,
      isClearable,
      isSearchable,
      isDisabled,
      value,
      onChange,
      menuPlacement,
      invalid,
      className,
    }: CustomSelectProps,
    ref: any
  ) => {
    const customStyles: StylesConfig = {
      control: (provided) => ({
        ...provided,
        width: "100%",
        border: invalid ? "1px solid red" : "1px solid #DDDDEA",
        boxShadow: "none",
        borderRadius: "4px",
        "&:hover": {
          border: invalid ? "1px solid red" : "1px solid #AAA",
        },
      }),
      option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? "#fff" : "#fff",
        color: state.isFocused ? "#474D6A" : "#262638",
        cursor: "pointer",
        maxHeight: "200px",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#717B9E",
        fontSize: "14px",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#262638",
        fontSize: "14px",
      }),
      indicatorSeparator: (provided) => ({
        ...provided,
        display: "none",
      }),
    };

    const handleChange = (selectedOption: any): void => {
      if (onChange) {
        onChange(selectedOption);
      }
    };

    return (
      <Select
        ref={ref}
        id={id}
        name={name}
        options={options}
        noOptionsMessage={noOptionsMessage}
        placeholder={placeholder}
        className={`${className} custom-select-picker-all`}
        classNamePrefix={`select_input ${invalid ? "is-invalid" : ""}`}
        value={value}
        styles={styles ? styles : customStyles}
        onChange={handleChange}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        menuPlacement={menuPlacement}
      />
    );
  }
);

export default CustomSelect;
