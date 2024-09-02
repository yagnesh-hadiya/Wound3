import { CSSProperties } from "react";
import { Form, FormGroup, Input } from "reactstrap";

interface CheckboxProps {
  onChange?: (e: any) => void;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const CustomCheckbox = ({
  onChange,
  checked,
  disabled,
  style,
}: CheckboxProps) => {
  return (
    <Form>  
      <FormGroup check inline className="checkbox-wrapper">
        <Input
          type="checkbox"
          onChange={onChange}
          checked={checked}
          disabled={disabled}
          style={{
            backgroundColor: disabled ? "#7F47DD" : "",
            cursor: disabled ? "not-allowed" : "pointer",
            ...style,
          }}
        />
      </FormGroup>
    </Form>
  );
};

export default CustomCheckbox;
