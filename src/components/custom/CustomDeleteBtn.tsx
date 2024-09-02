import { useState } from "react";
import DeleteIcon from "../icons/DeleteBtn";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { CustomDeleteBtnProps } from "../../types/CustomElementTypes";
import CustomButton from "./CustomBtn";

const CustomDeleteBtn = ({
  disabled = false,
  onDelete,
  tooltipText = "Delete",
  ...props
}: CustomDeleteBtnProps) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [modal, setModal] = useState(false);

  const handleMouseEnter = () => setIsDeleteHovered(true);
  const handleMouseLeave = () => setIsDeleteHovered(false);

  const toggle = () => setModal(!modal);

  const handleDelete = () => {
    toggle();
    onDelete();
  };

  if (props.allow === false) {
    return null;
  }

  return (
    <>
      <div className="custom-action-btn">
        <button
          disabled={disabled}
          className="btn"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={toggle}
        >
          <DeleteIcon color={isDeleteHovered ? "#FFF" : "#717B9E"} />
          <span className="tooltip-text">{tooltipText}</span>
        </button>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Deleting the entry?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this entry? You CAN NOT view this
          entry in list anymore if you delete?
        </ModalBody>
        <ModalFooter>
          <div className="btn-wrapper">
            <CustomButton
              disabled={disabled}
              className="btn btn-primary"
              onClick={handleDelete}
            >
              Delete
            </CustomButton>
            <CustomButton className="btn btn-cancel" onClick={toggle}>
              Cancel
            </CustomButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CustomDeleteBtn;
