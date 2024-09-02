import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Label,
  FormFeedback,
  FormGroup,
  Button,
} from "reactstrap";
import Loader from "../../components/custom/CustomSpinner";
import CustomErrorMessage from "../../components/custom/CustomErrorMessage";
import CustomInput from "../../components/custom/CustomInput";
import CustomSelect from "../../components/custom/CustomSelect";
import CustomButton from "../../components/custom/CustomBtn";
import Calendar from "../../assets/images/calendar.svg";
import { formatDateString, formatPhoneNumber } from "../../helpers";
import { SelectOption } from "../../types/Index";
import ZipCodeSelect from "../manageStaff/ZipCodeSelect";
import { AddEditPatientProps } from "../../types/ManagePatientType";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEditPatientForm: React.FC<AddEditPatientProps> = ({
  loading,
  id,
  control,
  handleSubmit,
  onSubmit,
  errors,
  register,
  setValue,
  selectedInsuranceType,
  handleInsuranceTypeChange,
  insuranceType,
  selectedGender,
  handleGenderChange,
  gender,
  dateOfBirth,
  setDateOfBirth,
  selectedState,
  handleStateChange,
  states,
  selectedCity,
  handleCityChange,
  cities,
  selectedZip,
  handleZipCodeChange,
  zip,
  profileImageUrl,
  handleDeleteImage,
  profileImage,
  handleDocUpload,
  selectedFacility,
  selectedProvider,
  handleFacilityChange,
  handleProviderChange,
  facility,
  provider,
}) => {
  const navigate = useNavigate();

  return (
    <div className="add-wrapper-section">
      {loading === "loading" && <Loader />}
      <div className="d-flex justify-content-between align-items-center my-1">
        <h4>{id ? "Edit Patient" : "Add New Patient"}</h4>
        <CustomButton
          className="btn btn-outline-primary"
          onClick={() => navigate(-1)}
        >
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
                  <Col md="3" lg="3">
                    <Label>
                      Select Insurance Type<span className="asterisk">*</span>
                    </Label>
                    <Controller
                      name="insuranceTypeId"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          id="insuranceTypeId"
                          name="insuranceTypeId"
                          className={`${
                            errors.insuranceTypeId ? "is-invalid" : ""
                          }`}
                          value={selectedInsuranceType}
                          invalid={!!errors.insuranceTypeId}
                          onChange={(val) => {
                            field.onChange(val);
                            handleInsuranceTypeChange(val);
                          }}
                          options={insuranceType?.map((val: SelectOption) => ({
                            value: val?.value,
                            label: val?.label,
                          }))}
                          placeholder="Select Insurance Type"
                          noOptionsMessage={(): string =>
                            "No Insurance Type Found"
                          }
                          isSearchable={true}
                          isClearable={true}
                        />
                      )}
                    />
                    {!selectedInsuranceType && (
                      <CustomErrorMessage error={errors.insuranceTypeId} />
                    )}
                  </Col>
                  <Col md="3" lg="3">
                    <Label>
                      Patient Health ID<span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      id="patientHealthID"
                      placeholder="Patient Health ID"
                      invalid={!!errors.patientHealthID}
                      {...register("patientHealthID", {
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const input = e.target;
                          input.value = input.value.replace(/\D/g, "");
                          setValue("patientHealthID", input.value);
                        },
                      })}
                      maxLength={10}
                    />
                    <FormFeedback>
                      {errors.patientHealthID?.message}
                    </FormFeedback>
                  </Col>
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
                      Select Gender<span className="asterisk">*</span>
                    </Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          id="gender"
                          name="gender"
                          value={selectedGender}
                          className={`${errors.gender ? "is-invalid" : ""}`}
                          invalid={!!errors.gender}
                          onChange={(val) => {
                            field.onChange(val);
                            handleGenderChange(val);
                          }}
                          options={gender?.map((val: SelectOption) => ({
                            value: val?.value,
                            label: val?.label,
                          }))}
                          placeholder="Select Gender"
                          noOptionsMessage={(): string =>
                            "No Gender list Found"
                          }
                          isSearchable={true}
                          isClearable={true}
                        />
                      )}
                    />
                    {!selectedGender && (
                      <CustomErrorMessage error={errors.gender} />
                    )}
                  </Col>
                  <Col md="3" lg="3">
                    <Label>
                      Date Of Birth<span className="asterisk">*</span>
                    </Label>
                    <div className="date-range">
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field: { onBlur, onChange } }) => (
                          <ReactDatePicker
                            showYearDropdown
                            showMonthDropdown
                            scrollableYearDropdown
                            isClearable={true}
                            selected={dateOfBirth}
                            maxDate={new Date()}
                            popperPlacement="bottom"
                            yearDropdownItemNumber={100}
                            onChange={(date) => {
                              onChange(date);
                              onBlur();
                              setDateOfBirth(date);
                            }}
                            dateFormat="h:mm aa"
                            className="custom-select-picker-all contract-select"
                            customInput={
                              <div className="calendar-wrapper">
                                <CustomInput
                                  invalid={!!errors.dateOfBirth}
                                  value={
                                    dateOfBirth
                                      ? formatDateString(
                                          dateOfBirth.toDateString()
                                        )
                                      : ""
                                  }
                                  readOnly
                                  placeholder="Date Of Birth"
                                />
                                {!dateOfBirth && !errors.dateOfBirth && (
                                  <img
                                    src={Calendar}
                                    className="calendar-icon"
                                  />
                                )}
                              </div>
                            }
                          />
                        )}
                      />
                    </div>
                    {!dateOfBirth && (
                      <CustomErrorMessage error={errors.dateOfBirth} />
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
                        onChange: (e: { target: { value: string } }) => {
                          const formattedNumber: string = formatPhoneNumber(
                            e.target.value
                          );
                          setValue("phone", formattedNumber);
                        },
                      })}
                    />
                    <FormFeedback>{errors.phone?.message}</FormFeedback>
                  </Col>
                  <Col md="3" lg="3" className="mb-3">
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
                  <Col md="3" lg="3" className="mb-3">
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
                          value={selectedState}
                          className={`${errors.stateId ? "is-invalid" : ""}`}
                          invalid={!!errors.stateId}
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
                    <Label>
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
                  <Col md="6" lg="6">
                    <Label>
                      Profile Image<span className="asterisk">*</span>
                    </Label>
                    {profileImageUrl && (
                      <div className="selected-profile-image">
                        <img
                          src={profileImageUrl}
                          alt="profile"
                          width={"180px"}
                          height={"120px"}
                        />
                        <Button color="white" close onClick={handleDeleteImage}>
                          X
                        </Button>
                      </div>
                    )}
                    {!profileImageUrl && (
                      <FormGroup>
                        <div
                          className={`file-picker-wrapper ${
                            errors.profileImage && "file-picker-invalid"
                          }`}
                        >
                          <div className="file-picker-label-wrapper">
                            <Label
                              for="profileImage"
                              className="file-picker-label"
                            >
                              Upload File
                            </Label>
                          </div>
                          {profileImage?.name && (
                            <p className="file-para">
                              Your Document name is: {profileImage?.name}
                            </p>
                          )}
                          <p className="file-para">
                            Supported Formats: .jpg, .jpeg, .png up to 1.5 MB
                          </p>
                          <Controller
                            name="profileImage"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <CustomInput
                                id="profileImage"
                                type="file"
                                invalid={!!errors.profileImage}
                                title="Click here to upload"
                                accept=".jpg, .jpeg, .png"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleDocUpload(e);
                                  field.onChange(
                                    e.target.files ? e.target.files[0] : null
                                  );
                                }}
                                style={{ display: "none" }}
                              />
                            )}
                          />
                        </div>
                        {!profileImage && (
                          <CustomErrorMessage error={errors.profileImage} />
                        )}
                      </FormGroup>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        <div className="card card-section mb-3">
          <div className="card-header">
            <h6>Select Facility & Provider</h6>
          </div>
          <div className="card-body">
            <Row>
              <Col xs={12}>
                <Row>
                  <Col md="3" lg="3">
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
                          className={`${errors.facilityId ? "is-invalid" : ""}`}
                          invalid={!!errors.facilityId}
                          onChange={(val) => {
                            field.onChange(val);
                            handleFacilityChange(val);
                          }}
                          options={facility?.map((val: SelectOption) => ({
                            value: val?.value,
                            label: val?.label,
                          }))}
                          placeholder="Select Facility"
                          noOptionsMessage={(): string => "No Facility Found"}
                          isSearchable
                          isClearable
                          value={selectedFacility}
                        />
                      )}
                    />
                    {!selectedFacility && (
                      <CustomErrorMessage error={errors.facilityId} />
                    )}
                  </Col>
                  <Col md="3" lg="3">
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
                          className={`${errors.providerId ? "is-invalid" : ""}`}
                          invalid={!!errors.providerId}
                          onChange={(val) => {
                            field.onChange(val);
                            handleProviderChange(val);
                          }}
                          options={provider?.map((val: SelectOption) => ({
                            value: val?.value,
                            label: val?.label,
                          }))}
                          placeholder="Select Provider"
                          noOptionsMessage={(): string => "No Provider Found"}
                          isSearchable
                          isClearable
                          isDisabled={!selectedFacility?.value}
                          value={selectedProvider}
                        />
                      )}
                    />
                    {!selectedProvider && (
                      <CustomErrorMessage error={errors.providerId} />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        <div className="btn-wrapper">
          <CustomButton type="submit" className="btn btn-primary">
            Save
          </CustomButton>
          <CustomButton className="btn btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </CustomButton>
        </div>
      </Form>
    </div>
  );
};

export default AddEditPatientForm;
