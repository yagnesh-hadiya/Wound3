import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUserId } from "../../helpers/tokens";
import { formatDate, formatPhoneNumber, showToast } from "../../helpers";
import {
  getCities,
  getStateAndCityBasedOnZipCode,
  getStates,
  getZipCode,
} from "../../services/ManageStaffServices";
import { capitalize } from "../../helpers";
import { isAxiosError } from "axios";
import { SelectOption } from "../../types/Index";
import { AddEditPatientSchema } from "../../helpers/schemas/AddEditPatientSchema";
import {
  addPatient,
  getGenderList,
  getPatientByUserId,
  updatePatient,
} from "../../services/ManagePatientServices";
import { getInsuranceTypeList } from "../../services/ManagePatientServices";
import { AddEditFormDataType } from "../../types/ManagePatientType";
import "react-datepicker/dist/react-datepicker.css";
import AddEditPatientForm from "./AddEditPatientForm";
import { getFacilityList } from "../../services/ManageFacilityServices";
import { getProvidersList } from "../../services/ManageProviderServices";

const AddEditPatient: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
    setError,
    clearErrors,
  } = useForm<AddEditFormDataType>({
    resolver: yupResolver(AddEditPatientSchema),
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<"loading" | "idle" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [selectedZip, setSelectedZip] = useState<SelectOption | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<SelectOption | null>(
    null
  );
  const [selectedProvider, setSelectedProvider] = useState<SelectOption | null>(
    null
  );
  const [selectedInsuranceType, setSelectedInsuranceType] =
    useState<SelectOption | null>(null);
  const [selectedGender, setSelectedGender] = useState<SelectOption | null>(
    null
  );

  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [zip, setZip] = useState<SelectOption[]>([]);
  const [facility, setFacility] = useState<SelectOption[]>([]);
  const [provider, setProvider] = useState<SelectOption[]>([]);
  const [insuranceType, setInsuranceType] = useState<SelectOption[]>([]);
  const [gender, setGender] = useState<SelectOption[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [bucketSpecifier, setBucketSpecifier] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading("loading");

        const [
          facilityRes,
          providerRes,
          genderRes,
          insuranceTypeRes,
          userIdRes,
          statesRes,
        ] = await Promise.all([
          getFacilityList(),
          getProvidersList(),
          getGenderList(),
          getInsuranceTypeList(),
          getUserId(),
          getStates(),
        ]);

        setFacility(
          facilityRes?.data.map((val: { id: number; value: string }) => ({
            value: val.id,
            label: val.value,
          }))
        );
        setProvider(
          providerRes?.data.map((val: { id: number; value: string }) => ({
            value: val.id,
            label: val.value,
          }))
        );
        setGender(
          genderRes?.data.map((val: { id: number; value: string }) => ({
            value: val.id,
            label: val.value,
          }))
        );
        setInsuranceType(
          insuranceTypeRes?.data.map((val: { id: number; value: string }) => ({
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

    fetchAllData().catch(handleError);
  }, []);

  useEffect(() => {
    const getProviderByIds = async (id: string) => {
      try {
        setLoading("loading");
        const res = await getPatientByUserId(id);
        if (res && res.data) {
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
            patientHealthID,
            facilityId,
            insuranceTypeId,
            genderId,
            dateOfBirth,
            profilePicUrl,
            bucketSpecifier,
            fileName,
            providerId,
          } = res.data;

          const formattedPhone = formatPhoneNumber(phone);
          const facilityOption: SelectOption = facility?.find(
            (type) => type.value === facilityId
          ) || { value: 0, label: "" };
          const providerOption: SelectOption = provider?.find(
            (type) => type.value === providerId
          ) || { value: 0, label: "" };
          const insuranceOption: SelectOption = insuranceType?.find(
            (type) => type.value == insuranceTypeId
          ) || { value: 0, label: "" };
          const genderOption: SelectOption = gender?.find(
            (type) => type.value == genderId
          ) || { value: 0, label: "" };
          const stateOption = { value: Number(stateId), label: state };
          const cityOption = { value: Number(cityId), label: city };
          const zipOption = { value: zipCode, label: zipCode };

          setValue("facilityId", facilityOption);
          setValue("providerId", providerOption);
          setValue("insuranceTypeId", insuranceOption);
          setValue("gender", genderOption);
          setValue("patientHealthID", patientHealthID);
          setValue("phone", formattedPhone);
          setValue("firstName", capitalize(firstName));
          setValue("lastName", capitalize(lastName));
          setValue("phone", formattedPhone);
          setValue("emailAddress", emailAddress);
          setValue("address", address);
          setValue("stateId", stateOption);
          setValue("cityId", cityOption);
          setValue("zipCode", zipOption);
          setValue("dateOfBirth", dateOfBirth);
          setValue("profileImage", profilePicUrl);

          setSelectedState(stateOption);
          setSelectedCity(cityOption);
          setSelectedZip(zipOption);
          setSelectedFacility(facilityOption);
          setSelectedProvider(providerOption);
          setSelectedInsuranceType(insuranceOption);
          setSelectedGender(genderOption);
          setDateOfBirth(new Date(dateOfBirth));
          setProfileImageUrl(profilePicUrl);
          setBucketSpecifier(bucketSpecifier);
          setFileName(fileName);

          setLoading("idle");
        }
      } catch (error) {
        handleError(error);
      }
    };

    if (id) {
      getProviderByIds(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, facility, gender, insuranceType]);

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
      patientHealthID,
      stateId,
      cityId,
      zipCode,
      facilityId,
      providerId,
      insuranceTypeId,
      gender,
      dateOfBirth,
      profileImage,
    } = data;

    const requiredFields = [
      { field: selectedInsuranceType, message: "Please Select Insurance Type" },
      { field: selectedGender, message: "Please Select Gender" },
      { field: selectedState, message: "Please Select State" },
      { field: selectedCity, message: "Please Select City" },
      { field: selectedZip, message: "Please Select Zip Code" },
      { field: selectedFacility, message: "Please Select Facility" },
      { field: selectedProvider, message: "Please Select Provider" },
    ];

    for (const { field, message } of requiredFields) {
      if (!field?.value) {
        showToast("error", message);
        return;
      }
    }

    if (!profileImage) {
      showToast("error", "Please Select Profile Image");
      return;
    }

    const commonPayload = {
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      EmailAddress: emailAddress,
      Address: address,
      PatientHealthID: patientHealthID,
      StateId: stateId.value,
      CityId: cityId.value,
      ZipCode: zipCode.label,
      FacilityId: facilityId.value,
      ProviderId: providerId.value,
      InsuranceTypeId: insuranceTypeId.value,
      GenderId: gender.value,
      DateOfBirth: formatDate(dateOfBirth),
    };

    try {
      setLoading("loading");

      const payload = id
        ? {
            ...commonPayload,
            PatientId: id ?? "",
            UpdatedBy: userId ?? "",
            BucketSpecifier: bucketSpecifier,
            ProfileImage: profileImage?.name ? profileImage : "",
            FileName: fileName,
          }
        : {
            ...commonPayload,
            IsActive: true,
            CreatedBy: userId,
            ProfileImage: profileImage,
          };
      const res = id ? await updatePatient(payload) : await addPatient(payload);

      showToast("success", res?.message);

      setLoading("idle");
      setTimeout(() => {
        navigate(-1);
      }, 100);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!selectedFacility?.value) return;

    const fetchProviders = async () => {
      setLoading("loading");
      try {
        const val = await getProvidersList(selectedFacility.value.toString());
        setProvider(
          val.data.map((provider: { id: number; value: string }) => ({
            value: provider.id,
            label: provider.value,
          }))
        );
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading("idle");
      }
    };
    fetchProviders();
  }, [selectedFacility]);

  const handleSelectChange = async (
    selectedOption: SelectOption | null,
    setSelectedOption: React.Dispatch<
      React.SetStateAction<SelectOption | null>
    >,
    setValueKey: keyof AddEditFormDataType,
    errorMessage: string
  ): Promise<void> => {
    try {
      if (!selectedOption) {
        setSelectedOption(null);
        setError(setValueKey, {
          type: "custom",
          message: errorMessage,
        });
        setValue(setValueKey, { value: 0, label: "" });
        return;
      } else {
        setSelectedOption(selectedOption);
        clearErrors(setValueKey);
        setValue(setValueKey, selectedOption);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleFacilityChange = (selectedOption: SelectOption | null) => {
    handleSelectChange(
      selectedOption,
      setSelectedFacility,
      "facilityId",
      "Facility is required"
    );
    setSelectedProvider(null);
    setError("providerId", { type: "custom", message: "Provider is required" });
    setValue("providerId", { value: 0, label: "" });
  };

  const handleProviderChange = (selectedOption: SelectOption | null) =>
    handleSelectChange(
      selectedOption,
      setSelectedProvider,
      "providerId",
      "Provider is required"
    );

  const handleInsuranceTypeChange = (selectedOption: SelectOption | null) =>
    handleSelectChange(
      selectedOption,
      setSelectedInsuranceType,
      "insuranceTypeId",
      "Insurance Type is required"
    );

  const handleGenderChange = (selectedOption: SelectOption | null) =>
    handleSelectChange(
      selectedOption,
      setSelectedGender,
      "gender",
      "Gender is required"
    );

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

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const acceptedTypes = [".jpg", ".jpeg", ".png"];
      const selectedFile = files[0];
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!acceptedTypes.includes("." + extension)) {
        showToast("error", "Unsupported file format");
        return;
      }

      const maxSizeInBytes = 1.5 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        showToast("error", "File size exceeds the limit of 1.5MB");
        return;
      }
      setProfileImageUrl(URL.createObjectURL(selectedFile));
      setProfileImage(selectedFile);
      setValue("profileImage", selectedFile);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setProfileImageUrl(null);
    setValue("profileImage", null);
  };

  return (
    <AddEditPatientForm
      loading={loading}
      id={id}
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      register={register}
      setValue={setValue}
      selectedInsuranceType={selectedInsuranceType}
      handleInsuranceTypeChange={handleInsuranceTypeChange}
      insuranceType={insuranceType}
      selectedGender={selectedGender}
      handleGenderChange={handleGenderChange}
      gender={gender}
      dateOfBirth={dateOfBirth}
      setDateOfBirth={setDateOfBirth}
      selectedState={selectedState}
      handleStateChange={handleStateChange}
      states={states}
      selectedCity={selectedCity}
      handleCityChange={handleCityChange}
      cities={cities}
      selectedZip={selectedZip}
      handleZipCodeChange={handleZipCodeChange}
      zip={zip}
      profileImageUrl={profileImageUrl}
      handleDeleteImage={handleDeleteImage}
      profileImage={profileImage}
      handleDocUpload={handleDocUpload}
      selectedFacility={selectedFacility}
      handleFacilityChange={handleFacilityChange}
      facility={facility}
      selectedProvider={selectedProvider}
      handleProviderChange={handleProviderChange}
      provider={provider}
    />
  );
};

export default AddEditPatient;
