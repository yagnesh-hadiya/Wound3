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
import ModulePermissions from "./ModulePermissions";
import ZipCodeSelect from "./ZipCodeSelect";
import { getUserId } from "../../helpers/tokens";
import { formatPhoneNumber, showToast } from "../../helpers";
import {
  addStaff,
  getCities,
  getModuleList,
  getStaffByUserId,
  getStateAndCityBasedOnZipCode,
  getStates,
  getZipCode,
  updateStaff,
} from "../../services/ManageStaffServices";
import {
  AddEditFormDataType,
  ModuleType,
  ModuleMapping,
} from "../../types/ManageStaffType";
import { capitalize } from "../../helpers";
import { isAxiosError } from "axios";
import { SelectOption } from "../../types/Index";
import { AddEditStaffSchema } from "../../helpers/schemas/AddEditStaffSchema";

const AddEditStaff: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
    setError,
    clearErrors,
  } = useForm<AddEditFormDataType>({
    resolver: yupResolver(AddEditStaffSchema),
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
  const [lstModuleMapping, setLstModuleMapping] = useState<ModuleMapping[]>([]);
  const [modules, setModules] = useState<ModuleType[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading("loading");

        const [moduleRes, userIdRes, statesRes] = await Promise.all([
          getModuleList(),
          getUserId(),
          getStates(),
        ]);

        setModules(moduleRes?.data);
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
    const getStaffByIds = async (id: string) => {
      try {
        setLoading("loading");
        const res = await getStaffByUserId(id);
        if (res && res.data1) {
          const { data1, data2 } = res;
          const {
            firstName,
            lastName,
            phone,
            emailAddress,
            address,
            stateId,
            cityId,
            zipCode,
            state,
            city,
          } = data1;

          const formattedPhone = formatPhoneNumber(phone);
          const stateOption = { value: Number(stateId), label: state };
          const cityOption = { value: Number(cityId), label: city };
          const zipOption = { value: zipCode, label: zipCode };

          setValue("firstName", capitalize(firstName));
          setValue("lastName", capitalize(lastName));
          setValue("phone", formattedPhone);
          setValue("emailAddress", emailAddress);
          setValue("address", address);
          setValue("stateId", stateOption);
          setValue("cityId", cityOption);
          setValue("zipCode", zipOption);

          setSelectedState(stateOption);
          setSelectedCity(cityOption);
          setSelectedZip(zipOption);

          setLstModuleMapping(data2);
          setLoading("idle");
        }
      } catch (error) {
        handleError(error);
      }
    };

    if (id) {
      getStaffByIds(id);
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
      firstName,
      lastName,
      phone,
      emailAddress,
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

    try {
      setLoading("loading");

      const commonPayload = {
        firstName,
        lastName,
        phone,
        emailAddress,
        address,
        stateId: stateId.value,
        cityId: cityId.value,
        zipCode: zipCode.label,
        lstModuleMapping,
      };

      if (id) {
        const updatePayload = {
          ...commonPayload,
          userId: id ?? "",
          updatedBy: userId ?? "",
        };
        const res = await updateStaff(updatePayload);
        showToast("success", res?.message);
      } else {
        const addPayload = {
          ...commonPayload,
          active: true,
          createdBy: userId,
        };
        const res = await addStaff(addPayload);
        showToast("success", res?.message);
      }

      setLoading("idle");
      setTimeout(() => {
        navigate("/manage-staff");
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
        <h4>{id ? "Edit Staff" : "Add New Staff"}</h4>
        <CustomButton
          className="btn btn-outline-primary"
          onClick={() => navigate("/manage-staff")}>
          <span className="material-symbols-outlined me-2">
            keyboard_backspace
          </span>
          Back
        </CustomButton>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
                      First Name<span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      id="firstName"
                      placeholder="First Name"
                      invalid={!!errors.firstName}
                      {...register("firstName")}
                    />
                    <FormFeedback>{errors.firstName?.message}</FormFeedback>
                  </Col>
                  <Col md="3" lg="3">
                    <Label>
                      Last Name<span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      id="lastName"
                      placeholder="Last Name"
                      invalid={!!errors.lastName}
                      {...register("lastName")}
                    />
                    <FormFeedback>{errors.lastName?.message}</FormFeedback>
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
                      Email Address<span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      id="emailAddress"
                      placeholder="Email Address"
                      invalid={!!errors.emailAddress}
                      {...register("emailAddress")}
                    />
                    <FormFeedback>{errors.emailAddress?.message}</FormFeedback>
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
            <h6>Module Permissions</h6>
          </div>
          <ModulePermissions
            lstModuleMapping={lstModuleMapping}
            setLstModuleMapping={setLstModuleMapping}
            modules={modules}
          />
        </div>
        <div className="btn-wrapper">
          <CustomButton type="submit" className="btn btn-primary">
            Save
          </CustomButton>
          <CustomButton
            className="btn btn-cancel"
            onClick={() => navigate("/manage-staff")}
          >
            Cancel
          </CustomButton>
        </div>
      </Form>
    </div>
  );
};

export default AddEditStaff;
