import React, { useState } from "react";
import Select, {
  components,
  ControlProps,
  OptionProps,
  MultiValue,
} from "react-select";
import CustomCheckbox from "./CustomCheckboxBtn";
import { CheckboxValueType } from "../../types/Index";

interface CustomMultiSelectProps {
  options: CheckboxValueType[];
  placeholder: string;
  openMenu: boolean;
  onChange: (selected: CheckboxValueType[]) => void;
  value: CheckboxValueType[];
  isDisabled: boolean;
}

const CheckboxOption = (props: OptionProps<CheckboxValueType>) => (
  <components.Option {...props}>
    <CustomCheckbox
      checked={props.isSelected}
      onChange={() => null}
      disabled={false}
    />
    <div className="selection-text">{props.children}</div>
  </components.Option>
);

const Control = (props: ControlProps<CheckboxValueType>) => {
  const { selectProps, children } = props;
  const { value, placeholder } = selectProps;

  return (
    <components.Control {...props}>
      {children}
      {(!value || (Array.isArray(value) && value.length === 0)) &&
        placeholder && (
          <div className="placeholder-text">
            <span className="material-symbols-outlined">search</span>{" "}
            {placeholder}
          </div>
        )}
    </components.Control>
  );
};

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  placeholder,
  openMenu,
  onChange,
  value,
  isDisabled,
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(openMenu);

  const [, setOptionSelected] = useState<CheckboxValueType[]>([]);

  const handleChange = (selected: MultiValue<CheckboxValueType>) => {
    const selectedValues = selected as CheckboxValueType[];
    setOptionSelected(selectedValues);
    onChange(selectedValues);
  };

  return (
    <Select<CheckboxValueType, true>
      isMulti={true}
      options={options}
      className="talent-multi-select"
      classNamePrefix="select"
      components={{ Option: CheckboxOption, Control }}
      placeholder={placeholder}
      menuIsOpen={menuIsOpen}
      onChange={handleChange}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={() => setMenuIsOpen(openMenu)}
      hideSelectedOptions={false}
      value={value}
      isDisabled={isDisabled}
    />
  );
};

export default CustomMultiSelect;
