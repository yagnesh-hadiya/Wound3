import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  Button,
  FormFeedback,
} from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import { Form } from "react-router-dom";
import { showToast } from "../../helpers";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddEditFilterFormType } from "../../types/ManageSettingType";
import { AddEditSettingSchema } from "../../helpers/schemas/AddEditSettingSchema";
import CustomMultiSelect from "../../components/custom/CustomMultiSelect";
import {
  addFilterItem,
  getFilterById,
  getFlagList,
  updateFilterItem,
} from "../../services/ManageSettingServices";
import { getUserId } from "../../helpers/tokens";
import Loader from "../../components/custom/CustomSpinner";
import {
  CheckboxValueType,
  LoadingType,
  SelectOption,
} from "../../types/Index";
import CustomSelect from "../../components/custom/CustomSelect";
import CustomErrorMessage from "../../components/custom/CustomErrorMessage";

type AddFilterModalProps = {
  isOpen: boolean;
  toggle: () => void;
  refetchData: () => void;
  selectedFilterId: string | null;
};

const filterTypeList = [
  { value: 1, label: "Flag" },
  { value: 2, label: "Facility" },
  { value: 3, label: "Provider" },
  { value: 4, label: "Patient" },
];

const AddEditFilter: React.FC<AddFilterModalProps> = ({
  isOpen,
  toggle,
  selectedFilterId,
  refetchData,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<AddEditFilterFormType>({
    resolver: yupResolver(AddEditSettingSchema),
  });

  const [loading, setLoading] = useState<LoadingType>("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedFilterType, setSelectedFilterType] =
    useState<SelectOption | null>(null);
  const [selectedFilterFlag, setSelectedFilterFlag] = useState<
    CheckboxValueType[]
  >([]);
  const [selectedFilterTag, setSelectedFilterTag] =
    useState<SelectOption | null>(null);
  const [flagListOption, setFlagListOption] = useState<CheckboxValueType[]>([]);
  const [filterTagOption, setFilterTagOption] = useState<SelectOption[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading("loading");
      try {
        const user = await getUserId();
        setUserId(user);
        const payload =
          selectedFilterType?.value == 2
            ? "Facility"
            : selectedFilterType?.value == 3
            ? "Provider"
            : selectedFilterType?.value == 4
            ? "Patient"
            : "FlagMaster";
        const flagResponse = await getFlagList(payload);

        if (flagResponse?.data) {
          if (selectedFilterType?.value == 1) {
            setFlagListOption(
              flagResponse.data.map((val: { id: string; value: string }) => ({
                value: val.id,
                label: val.value,
                checked: false,
              }))
            );
          } else {
            setFilterTagOption(
              flagResponse.data.map((val: { id: string; value: string }) => ({
                value: val.id,
                label: val.value,
              }))
            );
          }
        }
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading("idle");
      }
    };
    if (selectedFilterType?.value) {
      fetchInitialData();
    }
  }, [selectedFilterType?.value]);

  useEffect(() => {
    const fetchFilterData = async () => {
      if (!selectedFilterId) return;
      setLoading("loading");

      try {
        // Fetch filter details
        const response = await getFilterById(selectedFilterId);
        if (!response?.data) return;

        const {
          filterName,
          filterType,
          flags,
          facilityId,
          patientId,
          providerId,
        } = response.data;

        // Determine filter type option
        const filterTypeOption: SelectOption = filterTypeList.find(
          (type) => type.label === filterType
        ) || { value: 0, label: "" };

        setValue("filterName", filterName);
        setValue("filterType", filterTypeOption);

        setSelectedFilterType(filterTypeOption);

        // Handle filter type-specific data
        if (filterTypeOption.value === 1) {
          // Filter type is Flag
          setSelectedFilterFlag(
            flags.map((val: { flagId: string; flag: string }) => ({
              value: val.flagId,
              label: val.flag,
              checked: true,
            }))
          );
        } else {
          // Filter type is Facility, Provider, or Patient
          const flagResponse = await getFlagList(filterType);
          const selectedTag = flagResponse.data.find(
            (type: { id: string }) =>
              type.id == (facilityId || patientId || providerId)
          );

          setSelectedFilterTag(
            selectedTag
              ? {
                  value: selectedTag.id,
                  label: selectedTag.value,
                }
              : null
          );
        }
      } catch (error) {
        console.error(error);
        showToast("error", "Something went wrong");
      } finally {
        setLoading("idle");
      }
    };

    fetchFilterData();
  }, [selectedFilterId, setValue]);

  const handleFilterTypeChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      setLoading("loading");
      if (!selectedOption) {
        setSelectedFilterType(null);
        setSelectedFilterFlag([]);
        setSelectedFilterTag(null);
        setError("filterType", {
          type: "custom",
          message: "Filter Type is required",
        });
        setValue("filterType", { value: 0, label: "" });
        return;
      }
      setSelectedFilterType({
        value: Number(selectedOption.value),
        label: selectedOption.label,
      });
      setSelectedFilterTag(null);
      setSelectedFilterFlag([]);
      setValue("filterType", {
        value: Number(selectedOption.value),
        label: selectedOption.label,
      });
      clearErrors("filterType");
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading("idle");
    }
  };
  console.log("first", errors);

  const handleSelectedFilterTagChange = async (
    selectedOption: SelectOption | null
  ): Promise<void> => {
    try {
      setLoading("loading");
      if (!selectedOption) {
        setSelectedFilterTag(null);
        setSelectedFilterFlag([]);
        return;
      }
      setSelectedFilterTag({
        value: selectedOption.value,
        label: selectedOption.label,
      });
      setSelectedFilterFlag([]);
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading("idle");
    }
  };

  const onSubmit = async (data: AddEditFilterFormType) => {
    if (!selectedFilterFlag.length && selectedFilterType?.value === 1) {
      return showToast("error", "Please Select Flag");
    }
    if (!selectedFilterTag?.label?.length && selectedFilterType?.value !== 1) {
      const entity =
        selectedFilterType?.value === 2
          ? "Facility"
          : selectedFilterType?.value === 3
          ? "Provider"
          : selectedFilterType?.value === 4
          ? "Patient"
          : "";

      return showToast("error", `Please Add ${entity}`);
    }

    const transformedFilterFlagsAdd = selectedFilterFlag.map((flag) => ({
      flagId: flag.value,
    }));
    const payload = {
      filterName: data.filterName,
      patientId:
        selectedFilterType?.value == 4
          ? selectedFilterTag?.value?.toString()
          : "",
      providerId:
        selectedFilterType?.value == 3
          ? selectedFilterTag?.value?.toString()
          : "",
      facilityId:
        selectedFilterType?.value == 2
          ? selectedFilterTag?.value?.toString()
          : "",
      filterType: selectedFilterType?.label,
      filterFlagsAdd: transformedFilterFlagsAdd,
    };

    setLoading("loading");
    try {
      if (selectedFilterId) {
        const response = await updateFilterItem({
          ...payload,
          filterId: selectedFilterId,
          updatedBy: userId,
        });
        showToast("success", response?.message);
        refetchData();
      } else {
        const response = await addFilterItem({
          ...payload,
          operationBy: userId,
        });
        showToast("success", response?.message);
      }
      refetchData();
      toggle();
    } catch (error) {
      console.error(error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading("idle");
    }
  };

  const handleMultiSelectChange = (values: CheckboxValueType[]) => {
    // Create a Set to filter out duplicates
    const uniqueValues: CheckboxValueType[] = Array.from(
      new Set(values.map((v) => v.value))
    )
      .map((value) => values.find((v) => v.value === value)!)
      .filter((value): value is CheckboxValueType => value !== undefined);

    setSelectedFilterFlag(uniqueValues);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      {loading === "loading" && <Loader />}
      <ModalHeader toggle={toggle}>
        {selectedFilterId ? "Edit" : "Add New"} Filter
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="12" className="mb-3">
              <Label for="filterName">
                Filter Name<span className="asterisk">*</span>
              </Label>
              <CustomInput
                id="filterName"
                placeholder="Filter Name"
                invalid={!!errors.filterName}
                {...register("filterName")}
              />
              <FormFeedback>{errors.filterName?.message}</FormFeedback>
            </Col>
            <Col md="12" className="mb-3">
              <Label>
                Filter Type<span className="asterisk">*</span>
              </Label>
              <Controller
                name="filterType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="filterType"
                    name="filterType"
                    value={selectedFilterType}
                    onChange={(val) => {
                      field.onChange(val);
                      handleFilterTypeChange(val);
                    }}
                    className={`${errors.filterType ? "is-invalid" : ""}`}
                    options={filterTypeList}
                    invalid={!!errors.filterType}
                    placeholder="Select Filter Type"
                    noOptionsMessage={() => "No Filter Type Found"}
                    isClearable
                    isSearchable
                  />
                )}
              />
              {!selectedFilterType && (
                <CustomErrorMessage error={errors.filterType} />
              )}
            </Col>
            <Col md="12">
              <Label>
                Add{" "}
                {selectedFilterType?.label === "Facility"
                  ? "Facility"
                  : selectedFilterType?.label === "Provider"
                  ? "Provider"
                  : selectedFilterType?.label === "Patient"
                  ? "Patient"
                  : "Flags"}
              </Label>
              {selectedFilterType?.label === "Flag" ? (
                <CustomMultiSelect
                  options={flagListOption}
                  value={selectedFilterFlag}
                  placeholder="Add Flag"
                  openMenu={false}
                  onChange={handleMultiSelectChange}
                  isDisabled={!selectedFilterType?.value}
                />
              ) : (
                <CustomSelect
                  id="filterTag"
                  name="filterTag"
                  value={selectedFilterTag}
                  onChange={(val) => {
                    handleSelectedFilterTagChange(val);
                  }}
                  options={filterTagOption}
                  placeholder="Add Filter"
                  noOptionsMessage={() => "No Filter Found"}
                  isClearable
                  isSearchable
                  isDisabled={!selectedFilterType?.value}
                />
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

export default AddEditFilter;
