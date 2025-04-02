import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Select from 'react-select';

import { CustomOption, DropdownIndicator } from 'components/ui/SelectBox';
import { customStyleSelectBoxCareTeam } from 'screens/Settings/Admin/PatientForm/helper/PatientFormHelper';
import './_select-care-team-type.scoped.scss';

const customStyleSelectBox = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#B0B0C6',
    };
  },
  control: (provided: any) => ({
    ...provided,
    borderRadius: '5px',
    borderColor: '#D8D8D8',
    minHeight: 48,
    flexWrap: 'nowrap',
      }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#23265B',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '8px 12px',
  }),
  singleValue: () =>
    ({
      maxWidth: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'pre',
    }) as any,
  option: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
};

export default function SelectCareTeamType({
  register,
  value,
  onInputChange,
  options,
  isLoading,
  onChange,
  className,
  isMulti = false,
  isDisabled = false
}: {
  register?: UseFormRegisterReturn;
  value?: any;
  onInputChange?: () => void;
  options: any;
  isLoading?: boolean;
  onChange: (v) => void;
  className?: string;
  isMulti?: boolean;
  isDisabled?: boolean;
}) {

  return (
    <div className={className}>
      <Select
        {...register}
        tabIndex={5}
        placeholder={<div className={`${isDisabled && 'select-placeholder-text'}`}>{isMulti ? 'Care Team Types' : 'Select Role'}</div>}
        closeMenuOnSelect={isMulti ? false : true}
        styles={isMulti ? customStyleSelectBox : customStyleSelectBoxCareTeam}
        hideSelectedOptions={false}
        className={`${className} ${isDisabled && 'opacity-50'} app-react-select w-full rounded`}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator,
          Option: CustomOption,
        }}
        onInputChange={onInputChange}
        defaultValue={value}
        value={value}
        isMulti={isMulti}
        options={options}
        onChange={(data) => onChange(data)}
        isLoading={isLoading}
        isDisabled={isDisabled}
      />
    </div>
  );
}
