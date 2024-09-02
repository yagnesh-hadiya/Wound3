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
import { AddEditFacilitySchema } from "../../helpers/schemas/AddEditFacilitySchema";
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
  FacilityAdminDetailsType,
} from "../../types/ManageFacilitiesType";
import ZipCodeSelect from "../manageStaff/ZipCodeSelect";
import {
  addFacility,
  getFacilityById,
  getFacilityNetworkList,
  getFacilityTypeList,
  updateFacility,
} from "../../services/ManageFacilityServices";
import FacilityAdminDetails from "./facilityAdminDetails/FacilityAdminDetails";

const AddEditFacility: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
    setError,
    clearErrors,
  } = useForm<AddEditFormDataType>({
    resolver: yupResolver(AddEditFacilitySchema),
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedFacilityType, setSelectedFacilityType] =
    useState<SelectOption | null>(null);
  const [selectedFacilityNetwork, setSelectedFacilityNetwork] =
    useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [selectedZip, setSelectedZip] = useState<SelectOption | null>(null);
  const [facilityType, setFacilityType] = useState<SelectOption[]>([]);
  const [facilityNetwork, setFacilityNetwork] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [zip, setZip] = useState<SelectOption[]>([]);
  const [facilityAdminDetails, setFacilityAdminDetails] = useState<
    FacilityAdminDetailsType[]
  >([]);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading("loading");

        const [facilityNetworkRes, facilityTypeRes, userIdRes, statesRes] =
          await Promise.all([
            getFacilityNetworkList(),
            getFacilityTypeList(),
            getUserId(),
            getStates(),
          ]);

        setFacilityNetwork(
          facilityNetworkRes?.data.map(
            (val: { id: number; value: string }) => ({
              value: val.id,
              label: val.value,
            })
          )
        );

        setFacilityType(
          facilityTypeRes?.data.map((val: { id: number; value: string }) => ({
            value: val.id,
            label: val.value,
          }))
        );

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
        const res = await getFacilityById(id);
        if (res) {
          const {
            facilityName,
            facilityAlias,
            phone,
            facilityTypeId,
            facilityNetworkId,
            address,
            stateId,
            cityId,
            zipCode,
            state,
            city,
            facilityAdminDetails,
            isActive,
          } = res.data;

          const formattedPhone = formatPhoneNumber(phone);

          const facilityTypeOption: SelectOption = facilityType?.find(
            (type) => type.value === facilityTypeId
          ) || { value: 0, label: "" };
          const facilityNetworkOption: SelectOption = facilityNetwork?.find(
            (type) => type.value == facilityNetworkId
          ) || { value: 0, label: "" };
          const stateOption = { value: Number(stateId), label: state };
          const cityOption = { value: Number(cityId), label: city };
          const zipOption = { value: zipCode, label: zipCode };

          setValue("facilityName", capitalize(facilityName));
          setValue("facilityAlias", capitalize(facilityAlias));
          setValue("facilityTypeId", facilityTypeOption);
          setValue("facilityNetworkId", facilityNetworkOption);
          setValue("phone", formattedPhone);
          setValue("address", address);
          setValue("stateId", stateOption);
          setValue("cityId", cityOption);
          setValue("zipCode", zipOption);

          if (facilityTypeOption) {
            setSelectedFacilityType(facilityTypeOption);
          }
          setSelectedFacilityNetwork(facilityNetworkOption);
          setSelectedState(stateOption);
          setSelectedCity(cityOption);
          setSelectedZip(zipOption);
          setIsActive(isActive);
          setFacilityAdminDetails(facilityAdminDetails);
          setLoading("idle");
        }
      } catch (error) {
        handleError(error);
      }
    };

    if (id) {
      getFacilityByIds(id);
    }
  }, [id, setValue, facilityType, facilityNetwork]);

  const handleFacilityNetworkChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      if (!selectedOption) {
        setSelectedFacilityNetwork(null);
        setError("facilityNetworkId", {
          type: "custom",
          message: "Facility Network Type is required",
        });
        setValue("facilityNetworkId", { value: 0, label: "" });
        return;
      } else {
        setSelectedFacilityNetwork(selectedOption);
        clearErrors("facilityNetworkId");
        setValue("facilityNetworkId", selectedOption);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleFacilityTypeChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      if (!selectedOption) {
        setSelectedFacilityType(null);
        setError("facilityTypeId", {
          type: "custom",
          message: "Facility Type is required",
        });
        setValue("facilityTypeId", { value: 0, label: "" });
        return;
      } else {
        setSelectedFacilityType(selectedOption);
        clearErrors("facilityTypeId");
        setValue("facilityTypeId", selectedOption);
      }
    } catch (error) {
      handleError(error);
    }
  };

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
      facilityName,
      facilityAlias,
      phone,
      facilityNetworkId,
      facilityTypeId,
      address,
      stateId,
      cityId,
      zipCode,
    }: AddEditFormDataType = data;

    if (!selectedFacilityNetwork?.value) {
      showToast("error", "Please Select Facility Network Type");
      return;
    }

    if (!selectedFacilityType?.value) {
      showToast("error", "Please select facility type");
      return;
    }

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

    if (!facilityAdminDetails.length) {
      showToast("error", "Please Add Facility Staff Details");
      return;
    }

    try {
      setLoading("loading");

      const commonPayload = {
        facilityName,
        facilityAlias,
        phone,
        facilityNetworkId: facilityNetworkId.value.toString(),
        facilityTypeId: facilityTypeId.value.toString(),
        address,
        stateId: stateId.value,
        cityId: cityId.value,
        zipCode: zipCode.label,
      };
      if (id) {
        const updatePayload = {
          ...commonPayload,
          updatedBy: userId ?? "",
          facilityId: id,
          isActive,
          facilityAdminUpdate: facilityAdminDetails.map((item) => ({
            ...item,
            facilityId: id,
          })),
        };
        const res = await updateFacility(updatePayload);
        showToast("success", res?.message);
      } else {
        const addPayload = {
          ...commonPayload,
          createdBy: userId,
          isActive: true,
          facilityAdminDetails,
        };
        const res = await addFacility(addPayload);
        showToast("success", res?.message);
      }

      setLoading("idle");
      setTimeout(() => {
        navigate("/manage-facilities");
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
        <h4>{id ? "Edit Facility" : "Add New Facility"}</h4>
        <CustomButton
          className="btn btn-outline-primary"
          onClick={() => navigate("/manage-facilities")}
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
                    Facility Name<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="facilityName"
                    placeholder="Facility Name"
                    invalid={!!errors.facilityName}
                    {...register("facilityName")}
                  />
                  <FormFeedback>{errors.facilityName?.message}</FormFeedback>
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    Facility Alias<span className="asterisk">*</span>
                  </Label>
                  <CustomInput
                    id="facilityAlias"
                    placeholder="Facility Alias"
                    invalid={!!errors.facilityAlias}
                    {...register("facilityAlias")}
                  />
                  <FormFeedback>{errors.facilityAlias?.message}</FormFeedback>
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    Facility Network Type<span className="asterisk">*</span>
                  </Label>
                  <Controller
                    name="facilityNetworkId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="facilityNetworkId"
                        name="facilityNetworkId"
                        className={`${
                          errors.facilityNetworkId ? "is-invalid" : ""
                        }`}
                        invalid={!!errors.facilityNetworkId}
                        value={selectedFacilityNetwork}
                        onChange={(val) => {
                          field.onChange(val);
                          handleFacilityNetworkChange(val);
                        }}
                        options={facilityNetwork?.map((val: SelectOption) => ({
                          value: val?.value,
                          label: val?.label,
                        }))}
                        placeholder="Select Facility Network Type"
                        noOptionsMessage={(): string =>
                          "No Facility Network Type Found"
                        }
                        isSearchable={true}
                        isClearable={true}
                      />
                    )}
                  />
                  {!selectedFacilityNetwork && (
                    <CustomErrorMessage error={errors.facilityNetworkId} />
                  )}
                </Col>
                <Col md="3" lg="3">
                  <Label>
                    Facility Type<span className="asterisk">*</span>
                  </Label>
                  <Controller
                    name="facilityTypeId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="facilityTypeId"
                        name="facilityTypeId"
                        className={`${
                          errors.facilityTypeId ? "is-invalid" : ""
                        }`}
                        invalid={!!errors.facilityTypeId}
                        value={selectedFacilityType}
                        onChange={(val) => {
                          field.onChange(val);
                          handleFacilityTypeChange(val);
                        }}
                        options={facilityType?.map((val: SelectOption) => ({
                          value: val?.value,
                          label: val?.label,
                        }))}
                        placeholder="Select Facility Type"
                        noOptionsMessage={(): string =>
                          "No Facility Type Found"
                        }
                        isSearchable={true}
                        isClearable={true}
                      />
                    )}
                  />
                  {!selectedFacilityType && (
                    <CustomErrorMessage error={errors.facilityTypeId} />
                  )}
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
                <Col md="3" lg="3" className="mb-3">
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
          <h6>Facility Staff Details</h6>
        </div>
        <FacilityAdminDetails
          facilityAdminDetails={facilityAdminDetails}
          setFacilityAdminDetails={setFacilityAdminDetails}
        />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-wrapper">
          <CustomButton type="submit" className="btn btn-primary">
            Save
          </CustomButton>
          <CustomButton
            className="btn btn-cancel"
            onClick={() => navigate("/manage-facilities")}
          >
            Cancel
          </CustomButton>
        </div>
      </Form>
    </div>
  );
};

export default AddEditFacility;
