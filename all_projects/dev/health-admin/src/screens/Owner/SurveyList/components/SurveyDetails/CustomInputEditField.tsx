import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import './_survey-details.scoped.scss';

export default function CustomInputEditField({ register, className, autoFocus }:
  { register: UseFormRegisterReturn; className: string; autoFocus?: boolean }) {
  return (
    <input
      autoFocus={autoFocus}
        type="text"
        {...register}
        className={` w-full rounded p-4   edit-input-field ${className} ${  'placeholder-opacity-70'}`}
      />
  );
}
