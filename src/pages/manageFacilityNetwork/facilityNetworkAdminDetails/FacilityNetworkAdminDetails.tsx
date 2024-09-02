import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import CustomEditBtn from "../../../components/custom/CustomEditBtn";
import CustomDeleteBtn from "../../../components/custom/CustomDeleteBtn";
import { FacilityNetworkAdminDetailsType } from "../../../types/ManageFacilityNetworkType";
import { capitalize, formatPhoneNumber } from "../../../helpers";
import ToggleSwitch from "../../../components/custom/CustomToggle";
import CustomButton from "../../../components/custom/CustomBtn";
import AddEditFacilityNetworkAdminModal from "./AddEditFacilityNetworkAdminModal";

interface AdminDetailProps {
  facilityNetworkAdminDetails: FacilityNetworkAdminDetailsType[];
  setFacilityNetworkAdminDetails: React.Dispatch<
    React.SetStateAction<FacilityNetworkAdminDetailsType[]>
  >;
}

const FacilityNetworkAdminDetails: React.FC<AdminDetailProps> = ({
  facilityNetworkAdminDetails,
  setFacilityNetworkAdminDetails,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] =
    useState<FacilityNetworkAdminDetailsType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const toggleModal = () => setModal((prevModal) => !prevModal);

  const handleSwitchChange = (index: number, isActive: boolean): void => {
    const updatedAdminDetails = facilityNetworkAdminDetails.map((admin, idx) =>
      idx === index ? { ...admin, isActive } : admin
    );
    setFacilityNetworkAdminDetails(updatedAdminDetails);
  };

  const handleDelete = (userId: string): void => {
    const updatedAdminDetails = facilityNetworkAdminDetails.filter(
      (admin) => admin.userId !== userId
    );
    setFacilityNetworkAdminDetails(updatedAdminDetails);
  };

  const handleEdit = (
    admin: FacilityNetworkAdminDetailsType,
    index: number
  ) => {
    setSelectedAdmin(admin);
    setSelectedIndex(index);
    setModal(true);
  };

  const handleModalSubmit = (adminData: FacilityNetworkAdminDetailsType) => {
    if (selectedIndex !== null) {
      // Update existing admin data
      const updatedAdminDetails = facilityNetworkAdminDetails.map(
        (admin, index) => (index === selectedIndex ? adminData : admin)
      );
      setFacilityNetworkAdminDetails(updatedAdminDetails);
    } else {
      // Add new admin data
      setFacilityNetworkAdminDetails([
        ...facilityNetworkAdminDetails,
        adminData,
      ]);
    }
    toggleModal();
  };

  const columns: TableColumn<FacilityNetworkAdminDetailsType>[] = [
    {
      name: "Admin Name",
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
    },
    {
      name: "Status",
      cell: (row, index) => (
        <ToggleSwitch
          onStateChange={(isActive) => handleSwitchChange(index, isActive)}
          checked={row.isActive}
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
        data={facilityNetworkAdminDetails}
        noDataComponent="No Facility Network Admin Available"
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
        <AddEditFacilityNetworkAdminModal
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={handleModalSubmit}
          adminData={selectedAdmin}
        />
      )}
    </div>
  );
};

export default FacilityNetworkAdminDetails;
