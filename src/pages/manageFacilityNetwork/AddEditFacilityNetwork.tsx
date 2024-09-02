import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Row, Col, Label, FormFeedback } from "reactstrap";
import Loader from "../../components/custom/CustomSpinner";
import CustomErrorMessage from "../../components/custom/CustomErrorMessage";
import CustomInput from "../../components/custom/CustomInput";
import CustomSelect from "../../components/custom/CustomSelect";
import CustomButton from "../../components/custom/CustomBtn";
import { getUserId } from "../../helpers/tokens";
import { formatPhoneNumber, showToast } from "../../helpers";
import { AddEditFacilityNetworkSchema } from "../../helpers/schemas/AddEditFacilityNetworkSchema";
import {
  getCities,
  getStateAndCityBasedOnZipCode,
  getStates,
  getZipCode,
} from "../../services/ManageStaffServices";
import { capitalize } from "../../helpers";
import { isAxiosError } from "axios";
import { SelectOption } from "../../types/Index";
import {
  AddEditFormDataType,
  FacilityNetworkAdminDetailsType,
} from "../../types/ManageFacilityNetworkType";
import ZipCodeSelect from "../manageStaff/ZipCodeSelect";
import {
  addFacilityNetwork,
  getFacilityNetworkById,
  updateFacilityNetwork,
} from "../../services/ManageFacilityNetworkServices";
import FacilityNetworkAdminDetails from "./facilityNetworkAdminDetails/FacilityNetworkAdminDetails";

const AddEditFacilityNetwork: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
    setError,
    clearErrors,
  } = useForm<AddEditFormDataType>({
    resolver: yupResolver(AddEditFacilityNetworkSchema),
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [selectedZip, setSelectedZip] = useState<SelectOption | null>(null);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [zip, setZip] = useState<SelectOption[]>([]);
  const [facilityNetworkAdminDetails, setFacilityNetworkAdminDetails] =
    useState<FacilityNetworkAdminDetailsType[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading("loading");

        const [userIdRes, statesRes] = await Promise.all([
          getUserId(),
          getStates(),
        ]);

        setUserId(userIdRes);
        setStates(
          statesRes?.data.map((state: { id: number; value: string }) => ({
            value: state.id,
            label: state.value,
          }))
        );

        setLoading("idle");
      } catch (error) {
        handleError(error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const getFacilityByIds = async (id: string) => {
      try {
        setLoading("loading");
        const res = await getFacilityNetworkById(id);
        if (res) {
          const {
            facilityNetworkName,
            facilityNetworkAlias,
            phone,
            address,
            stateId,
            cityId,
            zipCode,
            state,
            city,
            facilityNetworkAdminDetails,
            isActive,
          } = res.data;

          const formattedPhone = formatPhoneNumber(phone);

          const stateOption = { value: Number(stateId), label: state };
          const cityOption = { value: Number(cityId), label: city };
          const zipOption = { value: zipCode, label: zipCode };

          setValue("facilityNetworkName", capitalize(facilityNetworkName));
          setValue("facilityNetworkAlias", capitalize(facilityNetworkAlias));
          setValue("phone", formattedPhone);
          setValue("address", address);
          setValue("stateId", stateOption);
          setValue("cityId", cityOption);
          setValue("zipCode", zipOption);

          setSelectedState(stateOption);
          setSelectedCity(cityOption);
          setSelectedZip(zipOption);
          setIsActive(isActive);
          setFacilityNetworkAdminDetails(facilityNetworkAdminDetails);
          setLoading("idle");
        }
      } catch (error) {
        handleError(error);
      }
    };

    if (id) {
      getFacilityByIds(id);
    }
  }, [id, setValue]);

  const handleStateChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      if (!selectedOption) {
        setSelectedState(null);
        setSelectedCity(null);
        setSelectedZip(null);
        setCities([]);
        setZip([]);
        setError("stateId", { type: "custom", message: "State is required" });
        setError("cityId", { type: "custom", message: "City is required" });
        setError("zipCode", {
          type: "custom",
          message: "Zip Code is required",
        });
        const optionVal = { value: 0, label: "" };
        const zipOption = { value: "", label: "" };
        setValue("stateId", optionVal);
        setValue("cityId", optionVal);
        setValue("zipCode", zipOption);

        return;
      } else {
        setSelectedState({
          value: Number(selectedOption.value),
          label: selectedOption.label,
        });
        setSelectedCity(null);
        setSelectedZip(null);
        setValue("stateId", {
          value: Number(selectedOption.value),
          label: selectedOption.label,
        });
        clearErrors("stateId");
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState?.value)
        try {
          setLoading("loading");
          const stateId: number = selectedState?.value ?? 0;
          const response = await getCities(stateId);
          setCities(
            response.data.map((city: { id: number; value: string }) => ({
              value: city.id,
              label: city.value,
            }))
          );
          setLoading("idle");
        } catch (error) {
          handleError(error);
        }
    };

    fetchCities();
  }, [selectedState?.value]);

  const handleCityChange = async (selectedOption: SelectOption | null) => {
    try {
      if (!selectedOption) {
        setSelectedCity(null);
        setSelectedZip(null);
        setZip([]);
        setError("cityId", { type: "custom", message: "City is required" });
        setError("zipCode", {
          type: "custom",
          message: "Zip Code is required",
        });
        const zipOption = { value: "", label: "" };
        setValue("zipCode", zipOption);
        return;
      } else {
        setValue("cityId", {
          value: Number(selectedOption.value),
          label: selectedOption.label,
        });
        clearErrors("cityId");
        setSelectedCity({
          value: Number(selectedOption.value),
          label: selectedOption.label,
        });
        setSelectedZip(null);
        setZip([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const fetchZipCode = async () => {
      if (selectedCity?.value)
        try {
          setLoading("loading");
          const response = await getZipCode(
            selectedState?.value ?? 0,
            selectedCity?.value ?? 0
          );
          setZip(
            response?.data.map((val: { id: string; value: string }) => ({
              value: val.id,
              label: val.value,
            }))
          );
          setLoading("idle");
        } catch (error) {
          handleError(error);
        }
    };

    fetchZipCode();
  }, [selectedCity?.value, selectedState?.value]);

  const handleZipCodeChange = async (val: SelectOption | null) => {
    try {
      if (!val) {
        setSelectedZip(null);
        clearErrors("zipCode");
        return;
      } else {
        setLoading("loading");

        const res = await getStateAndCityBasedOnZipCode(val.label);
        const { cityId, city, stateId, state } = res.data;

        setSelectedZip({ value: val.value, label: val.label });
        setSelectedCity({ value: cityId, label: city });
        setSelectedState({ value: stateId, label: state });

        setValue("zipCode", { value: val.label, label: val.label });
        setValue("cityId", { value: Number(cityId), label: city });
        setValue("stateId", { value: Number(stateId), label: state });

        clearErrors(["cityId", "stateId", "zipCode"]);
        setLoading("idle");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmit = async (data: AddEditFormDataType) => {
    const {
      facilityNetworkName,
      facilityNetworkAlias,
      phone,
      address,
      stateId,
      cityId,
      zipCode,
    }: AddEditFormDataType = data;

    if (!selectedState?.value) {
      showToast("error", "Please select state");
      return;
    }

    if (!selectedCity?.value) {
      showToast("error", "Please select city");
      return;
    }

    if (!selectedZip?.label) {
      showToast("error", "Please select zip code");
      return;
    }

    if (!facilityNetworkAdminDetails.length) {
      showToast("error", "Please Add Facility Network Admin Details");
      return;
    }

    try {
      setLoading("loading");

      const commonPayload = {
        facilityNetworkName,
        facilityNetworkAlias,
        phone,
        address,
        stateId: stateId.value,
        cityId: cityId.value,
        zipCode: zipCode.label,
      };
      if (id) {
        const updatePayload = {
          ...commonPayload,
          updatedBy: userId ?? "",
          facilityNetworkId: id,
          isActive,
          facilityNetworkAdminUpdate: facilityNetworkAdminDetails.map(
            (item) => ({
              ...item,
              facilityNetworkId: id,
            })
          ),
        };
        const res = await updateFacilityNetwork(updatePayload);
        showToast("success", res?.message);
      } else {
        const addPayload = {
          ...commonPayload,
          createdBy: userId,
          isActive: true,
          facilityNetworkAdminDetails,
        };
        const res = await addFacilityNetwork(addPayload);
        showToast("success", res?.message);
      }

      setLoading("idle");
      setTimeout(() => {
        navigate("/manage-facility-network");
      }, 100);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    setLoading("error");

    if (isAxiosError(error)) {
      showToast(
        "error",
        error.response?.data?.message || "Something went wrong"
      );
    } else if (error instanceof Error) {
      showToast("error", error.message || "Something went wrong");
    } else {
      showToast("error", "Something went wrong");
    }
  };

  return (
    <div className="add-wrapper-section">
      {loading === "loading" && <Loader />}
      <div className="d-flex justify-content-between align-items-center my-1">
        <h4>{id ? "Edit Facility Network" : "Add New Facility Network"}</h4>
        <CustomButton
          className="btn btn-outline-primary"
          onClick={() => navigate("/manage-facility-network")}
        >
          <span className="material-symbols-outlined me-2">
            keyboard_backspace
          </span>
          Back
        </CustomButton>
      </div>
      <div className="card card-section mb-3">
        <div className="card-header">
          <h6>Basic Information</h6>
        </div>
        <div className="card-body">
          <Row>
            <Col xs={12}>
              <Row>
                <Col md="3" lg="3" className="mb-3">
                  <Label>
                    Facility Network Name<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="facilityNetworkName"
                    placeholder="Facility Network Name"
                    invalid={!!errors.facilityNetworkName}
                    {...register("facilityNetworkName")}
                  />
                  <FormFeedback>
                    {errors.facilityNetworkName?.message}
                  </FormFeedback>
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    Facility Network Alias<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="facilityNetworkAlias"
                    placeholder="Facility Network Alias"
                    invalid={!!errors.facilityNetworkAlias}
                    {...register("facilityNetworkAlias")}
                  />
                  <FormFeedback>
                    {errors.facilityNetworkAlias?.message}
                  </FormFeedback>
                </Col>

                <Col md="3" lg="3">
                  <Label>
                    Phone<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="phone"
                    placeholder="Phone Number"
                    invalid={!!errors.phone}
                    {...register("phone", {
                      onChange: (e) => {
                        const formattedNumber: string = formatPhoneNumber(
                          e.target.value
                        );
                        setValue("phone", formattedNumber);
                      },
                    })}
                  />
                  <FormFeedback>{errors.phone?.message}</FormFeedback>
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    Address<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="address"
                    placeholder="Address"
                    invalid={!!errors.address}
                    {...register("address")}
                  />
                  <FormFeedback>{errors.address?.message}</FormFeedback>
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    State<span className="asterisk">*</span>
                  </Label>
                  <Controller
                    name="stateId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="stateId"
                        name="stateId"
                        className={`${errors.stateId ? "is-invalid" : ""}`}
                        invalid={!!errors.stateId}
                        value={selectedState}
                        onChange={(state) => {
                          field.onChange(state);
                          handleStateChange(state);
                        }}
                        options={states?.map((state: SelectOption) => ({
                          value: state?.value,
                          label: state?.label,
                        }))}
                        placeholder="Select State"
                        noOptionsMessage={(): string => "No State Found"}
                        isSearchable={true}
                        isClearable={true}
                      />
                    )}
                  />
                  {!selectedState && (
                    <CustomErrorMessage error={errors.stateId} />
                  )}
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    City<span className="asterisk">*</span>
                  </Label>
                  <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="cityId"
                        name="cityId"
                        value={selectedCity}
                        onChange={(city) => {
                          field.onChange(city);
                          handleCityChange(city);
                        }}
                        className={`${errors.cityId ? "is-invalid" : ""}`}
                        options={cities?.map((city: SelectOption) => ({
                          value: city?.value,
                          label: city?.label,
                        }))}
                        invalid={!!errors.cityId}
                        placeholder="Select City"
                        noOptionsMessage={(): string => "No City Found"}
                        isClearable={true}
                        isSearchable={true}
                      />
                    )}
                  />
                  {!selectedCity && (
                    <CustomErrorMessage error={errors.cityId} />
                  )}
                </Col>
                <Col md="3" lg="3">
                  <Label className="">
                    Zip Code<span className="asterisk">*</span>
                  </Label>
                  {selectedState || selectedCity ? (
                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          id="zipCode"
                          name="zipCode"
                          value={selectedZip}
                          onChange={(val) => {
                            field.onChange(val);
                            handleZipCodeChange(val);
                          }}
                          options={zip?.map((zipCode) => ({
                            value: zipCode?.value,
                            label: zipCode?.label,
                          }))}
                          invalid={!!errors.zipCode}
                          placeholder="Select Zip Code"
                          noOptionsMessage={(): string => "No Zip Code Found"}
                          isClearable={true}
                          isSearchable={true}
                        />
                      )}
                    />
                  ) : (
                    <ZipCodeSelect
                      selectedZip={selectedZip}
                      handleZipCodeChange={handleZipCodeChange}
                      control={control}
                      errors={errors}
                    />
                  )}
                  {!selectedZip && (
                    <CustomErrorMessage error={errors.zipCode} />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <div className="card card-section">
        <div className="card-header">
          <h6>Facility Network Admin Details</h6>
        </div>
        <FacilityNetworkAdminDetails
          facilityNetworkAdminDetails={facilityNetworkAdminDetails}
          setFacilityNetworkAdminDetails={setFacilityNetworkAdminDetails}
        />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-wrapper">
          <CustomButton type="submit" className="btn btn-primary">
            Save
          </CustomButton>
          <CustomButton
            className="btn btn-cancel"
            onClick={() => navigate("/manage-facility-network")}
          >
            Cancel
          </CustomButton>
        </div>
      </Form>
    </div>
  );
};

export default AddEditFacilityNetwork;
