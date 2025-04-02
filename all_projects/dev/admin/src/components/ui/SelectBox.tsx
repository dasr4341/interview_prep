import { components } from 'react-select';
import filledDownIcon from '../../assets/icons/icon-filled-down.svg';
import React from 'react';

export const customStyleSelectBox = {
  container: (provided: any) => ({
    ...provided,
    width: '100%',
    flex: 1,
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'transparent',
    borderRadius: '10px',
    borderColor: '#E5E5EF',
    minHeight: 48,
    flexWrap: 'nowrap'
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#23265B',
  }),
  valueContainer: () => ({
    padding: '8px 11px',
    display: 'flex',
    maxWidth: 'calc(100% - 40px)',
  }),
  singleValue: () => ({
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'pre'
  }) as any,
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
    // This is because react-select applies this styles to wrapper div and not to input itself.
    // So to apply styles directly to input element we need to do this.
    '& input': {
      boxShadow: 'none !important',
    },
  }),
  option: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    margin: '0px',
  }),
};

export const ValueContainer = (props: any) => {
  return (
    <components.ValueContainer {...props}>
      <div className="flex flex-row flex-wrap overflow-hidden">
        {props.children}

      </div>
    </components.ValueContainer>
  );
};

export const OptionWithCheckbox = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex flex-row space-x-2 items-center">
        <input
          data-test-id="select-row-checkbox"
          className={`appearance-none h-5 w-5 border
          border-primary-light
          checked:bg-primary-light checked:border-transparent
          rounded-md form-tick`}
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <label>{props.label}</label>
      </div>
    </components.Option>
  );
};

export const OptionItem = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex flex-row space-y-2 items-center" 
         data-test-item="option-item"
         data-test-id={`option-item-${props.value}`}>
        <label>{props.label}</label>
      </div>
    </components.Option>
  );
};

export const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={filledDownIcon} alt="filled-icon" />
    </components.DropdownIndicator>
  );
};

export const cursorStyleSelectInput = {
  control: (base: any) => ({
    ...base,
    cursor: 'pointer',
  }),
  option: (base: any) => ({
    ...base,
    cursor: 'pointer',
  }),
};
