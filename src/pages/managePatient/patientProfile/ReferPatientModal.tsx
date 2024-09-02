import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { getUserId } from "../../../helpers/tokens";
import CustomErrorMessage from "../../../components/custom/CustomErrorMessage";
import { ReferPatientFormType } from "../../../types/ManagePatientType";
import { ReferPatientSchema } from "../../../helpers/schemas/AddEditPatientSchema";
import { SelectOption } from "../../../types/Index";
import { showToast } from "../../../helpers";
import { getProvidersList } from "../../../services/ManageProviderServices";
import CustomSelect from "../../../components/custom/CustomSelect";
import { getFacilityList } from "../../../services/ManageFacilityServices";
import { patientRefer } from "../../../services/ManagePatientServices";
import Loader from "../../../components/custom/CustomSpinner";

interface ReferPatientModalProps {
  isOpen: boolean;
  toggle: () => void;
  patientNumber: string;
}

const ReferPatientModal: React.FC<ReferPatientModalProps> = ({
  isOpen,
  toggle,
  patientNumber,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ReferPatientFormType>({
    resolver: yupResolver(ReferPatientSchema),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { id: patientId } = useParams<{ id: string }>();

  const [selectedFacility, setSelectedFacility] = useState<SelectOption | null>(
    null
  );
  const [facilities, setFacilities] = useState<SelectOption[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<SelectOption | null>(
    null
  );
  const [providerList, setProviderList] = useState<SelectOption[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [facilityRes, userIdRes] = await Promise.all([
          getFacilityList(),
          getUserId(),
        ]);
        setFacilities(
          facilityRes?.data.map((val: { id: number; value: string }) => ({
            value: val.id,
            label: val.value,
          }))
        );
        setUserId(userIdRes);
      } catch (error) {
        showToast("error", "Something went wrong");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFacilityChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    if (!selectedOption) {
      setSelectedFacility(null);
      setError("facilityId", {
        type: "custom",
        message: "Facility is required",
      });
      setSelectedProvider(null);
      setError("providerId", {
        type: "custom",
        message: "Provider is required",
      });
      return;
    }
    setSelectedProvider(null);
    setSelectedFacility(selectedOption);
    clearErrors("facilityId");
  };

  const handleProviderChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    if (!selectedOption) {
      setSelectedProvider(null);
      setError("providerId", {
        type: "custom",
        message: "Provider is required",
      });
      return;
    }
    setSelectedProvider(selectedOption);
    clearErrors("providerId");
  };

  useEffect(() => {
    if (!selectedFacility?.value) return;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const val = await getProvidersList(selectedFacility.value.toString());
        setProviderList(
          val.data.map((provider: { id: number; value: string }) => ({
            value: provider.id,
            label: provider.value,
          }))
        );
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [selectedFacility]);

  const onSubmit = async (data: ReferPatientFormType) => {
    const { facilityId, providerId } = data;
    const payload = {
      facilityId: facilityId.value,
      userId: providerId.value,
      patientId: patientId ?? "",
      updatedBy: userId ?? "",
      patientNumber: patientNumber.toString(),
    };

    try {
      setLoading(true);
      const res = await patientRefer(payload);
      showToast("success", res?.message);
      toggle();
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>Refer Patient to other Provider</ModalHeader>
      <ModalBody>
        {loading && <Loader />}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="12" lg="12" className="mb-3">
              <Label>
                Select Facility<span className="asterisk">*</span>
              </Label>
              <Controller
                name="facilityId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="facilityId"
                    name="facilityId"
                    value={selectedFacility}
                    className={`${errors.facilityId ? "is-invalid" : ""}`}
                    invalid={!!errors.facilityId}
                    onChange={(val: SelectOption | null) => {
                      field.onChange(val);
                      handleFacilityChange(val);
                    }}
                    options={facilities}
                    placeholder="Select Facility"
                    noOptionsMessage={() => "No Facility Found"}
                    isSearchable
                    isClearable
                  />
                )}
              />
              {!selectedFacility && (
                <CustomErrorMessage error={errors.facilityId} />
              )}
            </Col>
            <Col md="12" lg="12">
              <Label>
                Select Provider<span className="asterisk">*</span>
              </Label>
              <Controller
                name="providerId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="providerId"
                    name="providerId"
                    value={selectedProvider}
                    className={`${errors.providerId ? "is-invalid" : ""}`}
                    invalid={!!errors.providerId}
                    onChange={(val: SelectOption | null) => {
                      field.onChange(val);
                      handleProviderChange(val);
                    }}
                    options={providerList}
                    placeholder="Select Provider"
                    noOptionsMessage={() => "No Provider Found"}
                    isSearchable
                    isClearable
                    isDisabled={!selectedFacility?.value}
                  />
                )}
              />
              {!selectedProvider && (
                <CustomErrorMessage error={errors.providerId} />
              )}
            </Col>
          </Row>
          <div className="my-3">
            <Button type="submit" className="me-3 btn btn-primary">
              Save
            </Button>
            <Button className="btn btn-cancel" onClick={toggle}>
              Cancel
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ReferPatientModal;
