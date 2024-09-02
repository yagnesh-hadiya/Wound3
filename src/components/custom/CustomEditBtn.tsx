import React, { useState } from "react";
import EditIcon from "../icons/EditBtn";
import { CustomEditBtnProps } from "../../types/CustomElementTypes";

const CustomEditBtn: React.FC<CustomEditBtnProps> = ({
  onEdit,
  disabled = false,
  tooltipText = "Edit",
  ...props
}: CustomEditBtnProps) => {
  const [isEditHovered, setIsEditHovered] = useState<boolean>(false);

  const handleMouseEnter = () => setIsEditHovered(true);
  const handleMouseLeave = () => setIsEditHovered(false);


  if (props.allow === false) {
    return null;
  }
  
  return (
    <div className="custom-action-btn">
      <button
        disabled={disabled}
        className="btn"
        style={{ marginRight: "5px", opacity: disabled ? 0.5 : 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onEdit}
        {...props}
      >
        <EditIcon color={isEditHovered ? "#FFF" : "#717B9E"} />
        <span className="tooltip-text">{tooltipText}</span>
      </button>
    </div>
  );
};

export default CustomEditBtn;
