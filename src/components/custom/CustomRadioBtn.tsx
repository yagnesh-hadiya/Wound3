import { FormGroup, Label, Input } from "reactstrap";
import { RadioBtnProps } from "../../types/CustomElementTypes";
import React, { Ref, RefObject } from "react";

const RadioBtn = React.forwardRef(({ name, options, onChange, selected, disabled, className }: RadioBtnProps, ref: Ref<HTMLInputElement>) => {
  return (
    <FormGroup tag="fieldset" className={`radio-btn-wrapper${disabled ? ' disabled' : ''}${className || ''}`}>
      {
        options && options.map((option: { label: string, value: string }, index: number) => {
          return <FormGroup key={index} check>
            <Label check className="Label">
              <Input
                innerRef={ref as RefObject<HTMLInputElement>}
                type="radio"
                name={name}
                className="Input"
                checked={selected === option.value}
                onChange={() => onChange(option.value)}
                value={option.value}
                disabled={disabled}
              />
              {option.label}
              <div className="CustomRadio"></div>
            </Label>
          </FormGroup>
        })
      }
    </FormGroup>
  );
});

export default RadioBtn;
