import { useState, useEffect } from "react";
import { ToggleSwitchProps } from "../../types/CustomElementTypes";

const ToggleSwitch = ({
  onStateChange,
  checked,
  disabled,
}: ToggleSwitchProps) => {
  const [state, setState] = useState(checked);

  useEffect(() => {
    setState(checked);
  }, [checked]);

  const handleToggle = () => {
    const newState = !state;
    setState(newState);
    onStateChange(newState);
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={state}
        onChange={handleToggle}
        disabled={disabled}
      />
      <span className="slider round"></span>
      {disabled && (
        <span className="tooltip-text">
          {"You have no access to update it."}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;
