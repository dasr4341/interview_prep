import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@mantine/core';
import './_custom-field.scoped.scss';

export default function CustomInputField({
  type,
  error,
  register,
  onBlur,
  className,
  autoFocus,
  dataTestid,
  onKeyUp,
  autoComplete,
  multiline,
  tabIndex,
  placeholder,
  onKeyDown,
  pattern,
  characterLength,
  label,
  component
}: {
  type?: string;
  error: boolean;
  register?: UseFormRegisterReturn;
  onBlur?: () => void;
  className?: string;
  autoFocus?: boolean;
  dataTestid?: string;
  onKeyUp?: () => void;
  autoComplete?: string;
  multiline?: boolean;
  tabIndex?: number;
  placeholder?: any;
  onKeyDown?: (e: any) => void;
  pattern?: string;
  characterLength?: number,
  label?: string,
  component?: any;
  }) {
  return (
    <Input.Wrapper>
   <label className='label'>{label}</label>
    <Input
      variant="outlined"
      multiline={multiline}
      type={type}
      error={error}
      {...register}
      onBlur={onBlur}
      className={className}
            component={component}
      autoFocus={autoFocus}
      data-testid={dataTestid}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      autoComplete={autoComplete}
      wrapperProps={{
        tabIndex,
        className: ' border-transparent focus:border-transparent focus:ring-0 ',
        pattern: pattern,
        maxLength: characterLength
      }}
      placeholder={placeholder}
    />
    </Input.Wrapper>
  );
}
