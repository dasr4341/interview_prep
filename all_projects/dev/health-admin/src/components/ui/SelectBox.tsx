import React from 'react';
import { components } from 'react-select';
import filledDownIcon from '../../assets/icons/icon-filled-down.svg';

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
    flexWrap: 'nowrap',
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
  singleValue: () =>
    ({
      maxWidth: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'pre',
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
    backgroundColor: '#000',

    '&:hover': {
      backgroundColor: '#5e4949',
    },
    '&:focused': {
      backgroundColor: '#000',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    margin: '0px',
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#000',
  }),
};

export const customStylesSelectBoxOne = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    borderColor: '#E5E5EF',
    boxShadow: ' 0 !important',
    padding: '7px 6px',
    borderRadius: '8px',
    fontSize: '16px',
    '&:hover': {
      borderColor: '#ffcc01',
    },
  }),
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#4B4C4E',
      boxShadow: ' 0 !important',
    };
  },
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.data.value ? '#4b4c4e' : '#B0B0C6',
  }),
};

export const ValueContainer = (props: any) => {
  return (
    <components.ValueContainer {...props}>
      <div className="flex flex-row flex-wrap overflow-hidden">{props.children}</div>
    </components.ValueContainer>
  );
};

export const OptionWithCheckbox = (props: any) => {
  return (
    <components.Option {...props}>
      <div>
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
      </div>
    </components.Option>
  );
};

export const CustomOption = ({ innerProps, label, data, isSelected, isMulti }) => (
  <div
    {...innerProps}
    className={`${
      isSelected && !isMulti ? 'bg-pt-secondary text-white' : 'hover:bg-pt-secondary hover:text-white'
    } pl-4 pr-2 py-2 transition ease-in-out duration-200 border-b last:border-0 border-gray-300 cursor-pointer`}>
      {isMulti && (
        <input
        data-test-id="select-row-checkbox"
        className={`appearance-none h-5 w-5 -mt-1 border
        border-primary-light
        checked:bg-primary-light checked:border-transparent
        rounded-md form-tick mr-2`}
          type="checkbox"
          checked={isSelected}
          onChange={() => null}
        />
      )}
      
    <label className="font-bold text-base ">{label}</label>

    <div className="text-sm font-normal ">{data.description}</div>
  </div>
);

export const OptionItem = (props: any) => {
  return (
    <components.Option {...props}>
      <div
        className="flex flex-row space-y-2 items-center"
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
      <img
        src={filledDownIcon}
        alt="filled-icon"
      />
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
