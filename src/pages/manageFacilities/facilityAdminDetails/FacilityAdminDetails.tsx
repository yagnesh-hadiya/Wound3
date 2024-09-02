import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import { FacilityAdminDetailsType } from "../../../types/ManageFacilitiesType";
import { capitalize, formatPhoneNumber } from "../../../helpers";
import ToggleSwitch from "../../../components/custom/CustomToggle";
import CustomButton from "../../../components/custom/CustomBtn";
import AddEditFacilityAdminModal from "./AddEditFacilityAdminModal";

interface AdminDetailProps {
  facilityAdminDetails: FacilityAdminDetailsType[];
  setFacilityAdminDetails: React.Dispatch<
    React.SetStateAction<FacilityAdminDetailsType[]>
  >;
}

const FacilityAdminDetails: React.FC<AdminDetailProps> = ({
  facilityAdminDetails,
  setFacilityAdminDetails,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] =
    useState<FacilityAdminDetailsType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const toggleModal = () => setModal((prevModal) => !prevModal);

  const handleStatusChange = (index: number, isActive: boolean): void => {
    const updatedAdminDetails = facilityAdminDetails.map((admin, idx) =>
      idx === index ? { ...admin, isActive } : admin
    );
    setFacilityAdminDetails(updatedAdminDetails);
  };

  const handleIsAdminChange = (index: number, isAdmin: boolean): void => {
    const updatedAdminDetails = facilityAdminDetails.map((admin, idx) =>
      idx === index ? { ...admin, isAdmin } : admin
    );
    setFacilityAdminDetails(updatedAdminDetails);
  };

  const handleDelete = (userId: string): void => {
    const updatedAdminDetails = facilityAdminDetails.filter(
      (admin) => admin.userId !== userId
    );
    setFacilityAdminDetails(updatedAdminDetails);
  };

  const handleEdit = (admin: FacilityAdminDetailsType, index: number) => {
    setSelectedAdmin(admin);
    setSelectedIndex(index);
    setModal(true);
  };

  const handleModalSubmit = (adminData: FacilityAdminDetailsType) => {
    if (selectedIndex !== null) {
      // Update existing admin data
      const updatedAdminDetails = facilityAdminDetails.map((admin, index) =>
        index === selectedIndex ? adminData : admin
      );
      setFacilityAdminDetails(updatedAdminDetails);
    } else {
      // Add new admin data
      setFacilityAdminDetails([...facilityAdminDetails, adminData]);
    }
    toggleModal();
  };

  const columns: TableColumn<FacilityAdminDetailsType>[] = [
    {
      name: "Name",
      selector: (row) =>
        row.firstName && row.lastName
          ? `${capitalize(row.firstName)} ${capitalize(row.lastName)}`
          : "-",
    },
    {
      name: "Phone",
      selector: (row) => (row.phone ? formatPhoneNumber(row.phone) : "-"),
    },
    {
      name: "Email Address",
      selector: (row) => row.emailAddress ?? "-",
      width: "20%",
    },
    {
      name: "Status",
      cell: (row, index) => (
        <ToggleSwitch
          onStateChange={(isActive) => handleStatusChange(index, isActive)}
          checked={row.isActive}
        />
      ),
    },
    {
      name: "Is Admin",
      cell: (row, index) => (
        <ToggleSwitch
          onStateChange={(isAdmin) => handleIsAdminChange(index, isAdmin)}
          checked={row.isAdmin}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <div key={row.userId} className="d-flex">
          <CustomEditBtn onEdit={() => handleEdit(row, index)} />
          <CustomDeleteBtn onDelete={() => handleDelete(row.userId ?? "")} />
        </div>
      ),
    },
  ];

  return (
    <div className="datatable-wrapper pt-2 px-4 pb-4">
      <DataTable
        columns={columns}
        data={facilityAdminDetails}
        noDataComponent="No Facility Admins Available"
      />
      <CustomButton
        onClick={() => {
          setSelectedAdmin(null);
          setSelectedIndex(null);
          toggleModal();
        }}
        className="btn btn-outline-primary add-new"
      >
        Add New
      </CustomButton>
      {modal && (
        <AddEditFacilityAdminModal
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={handleModalSubmit}
          adminData={selectedAdmin}
        />
      )}
    </div>
  );
};

export default FacilityAdminDetails;
