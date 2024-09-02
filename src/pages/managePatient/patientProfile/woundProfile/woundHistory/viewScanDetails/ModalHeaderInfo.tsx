import {
  ModalHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import CustomButton from "../../../../../../components/custom/CustomBtn";
import { showToast } from "../../../../../../helpers";
import { FlagListType } from "../../../../../../types/ManagePatientType";
import {
  deleteFlagItem,
  updateFlagItem,
} from "../../../../../../services/ManagePatientServices";

interface ModalHeaderInfoProps {
  scanFlagList: FlagListType[];
  filterToggleModal: () => void;
  toggle: () => void;
  setLoading: (loading: boolean) => void;
  userId: string;
  patientId: string;
  woundScanId: string;
  setSelectedFlag: React.Dispatch<React.SetStateAction<FlagListType[]>>;
  selectedFlag: FlagListType[];
}

const ModalHeaderInfo: React.FC<ModalHeaderInfoProps> = ({
  userId,
  scanFlagList,
  filterToggleModal,
  toggle,
  patientId,
  setLoading,
  woundScanId,
  setSelectedFlag,
  selectedFlag,
}) => {
  const handleFlagChange = async (val: FlagListType) => {
    const payload = {
      patientId,
      woundScanId,
      flagId: val.id,
      updatedBy: userId,
    };
    try {
      setLoading(true);
      const response = await updateFlagItem(payload);
      if (response.status) {
        if (!selectedFlag.some((flag) => flag.id === val.id)) {
          setSelectedFlag((prev) => [...prev, val]);
        }
      }
    } catch (error: any) {
      console.error(error);
      showToast("success", error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scanFlagId: string): Promise<void> => {
    if (userId && patientId && scanFlagId) {
      try {
        setLoading(true);
        const response = await deleteFlagItem(
          scanFlagId,
          patientId,
          woundScanId,
          userId
        );
        showToast("success", response?.message);
        setSelectedFlag((prevFlags) =>
          prevFlags.filter((flag) => flag.id !== scanFlagId)
        );
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ModalHeader className="custom-modal-header">
      <div className="d-flex align-items-center justify-content-between m-3">
        <h6>Scan Details</h6>
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={toggle}
        >
          close
        </span>
      </div>
      <div className="modal-header-description">
        <div>
          <p>Flags:</p>
        </div>
        <div
          className="d-flex align-items-center"
          style={{ gap: "10px", width: "78%", flexWrap: "wrap" }}
        >
          {selectedFlag?.map((flag: FlagListType) => (
            <div className="flag-name blue" key={flag.id}>
              {flag.value}
              <span
                className="material-symbols-outlined ms-2 cursor-pointer"
                onClick={() => handleDelete(flag.id)}
              >
                close
              </span>
            </div>
          ))}
          <div style={{ minWidth: "5rem" }} className="view-select-wrapper">
            <UncontrolledDropdown className="me-2" direction="down">
              <DropdownToggle caret color="primary">
                Add Flag
              </DropdownToggle>
              <DropdownMenu>
                {scanFlagList.length ? (
                  scanFlagList?.map((val: FlagListType) => (
                    <DropdownItem
                      key={val.id}
                      onClick={() => handleFlagChange(val)}
                    >
                      {val.value}
                    </DropdownItem>
                  ))
                ) : (
                  <p className="ps-2">No record found.</p>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
        <div className="d-flex" style={{ gap: "10px" }}>
          <CustomButton
            className="btn btn-primary add-new view flag me-2"
            onClick={filterToggleModal}
          >
            Create Flag
          </CustomButton>
          <CustomButton className="btn btn-outline-primary add-new view">
            <span className="material-symbols-outlined me-2">download</span>
            PDF
          </CustomButton>
        </div>
      </div>
    </ModalHeader>
  );
};

export default ModalHeaderInfo;
