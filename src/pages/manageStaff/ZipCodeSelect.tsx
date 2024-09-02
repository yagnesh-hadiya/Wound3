import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { components } from "react-select";
import { getAllZipCode } from "../../services/ManageStaffServices";
import { Controller } from "react-hook-form";
import { SelectOption } from "../../types/Index";

type ZipCodeSelectProps = {
  selectedZip: SelectOption | null;
  handleZipCodeChange: (val: SelectOption | null) => Promise<void>;
  control: any;
  errors: any;
};

const ZipCodeSelect: React.FC<ZipCodeSelectProps> = ({
  selectedZip,
  handleZipCodeChange,
  control,
  errors,
}: ZipCodeSelectProps) => {
  const perPage: number = 10;

  const loadOptions: LoadOptions<SelectOption, any, { page: number }> = async (
    inputValue,
    loadedOptions,
    additional = { page: 0 }
  ) => {
    if (inputValue.length >= 1 && inputValue.length < 3) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: 0,
        },
      };
    }

    const pageNo: number = additional.page * perPage;
    const response = await getAllZipCode(pageNo, perPage, inputValue);
    const options = response?.data.map(
      (val: { id: string; value: string }) => ({
        value: val.id,
        label: val.value,
      })
    );
    console.log(loadedOptions);
    return {
      options: [...options],
      hasMore: response.totalRecords > additional.page * perPage,
      additional: {
        page: additional.page + 1,
      },
    };
  };
  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: errors.zipCode ? "#dc3545" : base.borderColor,
      "&:hover": {
        borderColor: errors.zipCode ? "#dc3545" : base["&:hover"].borderColor,
      },
    }),
  };
  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        <p className="center-align text-align mb-0">{props.label}</p>
      </components.Option>
    );
  };
  return (
    <Controller
      name="zipCode"
      control={control}
      render={({ field }) => (
        <AsyncPaginate
          loadOptions={loadOptions}
          value={selectedZip}
          onChange={(val) => {
            field.onChange(val);
            handleZipCodeChange(val);
          }}
          components={{ Option: CustomOption }}
          additional={{ page: 0 }}
          placeholder="Select Zip Code"
          noOptionsMessage={(): string => "No Zip Code Found"}
          isClearable={true}
          styles={customStyles}
        />
      )}
    />
  );
};

export default ZipCodeSelect;
