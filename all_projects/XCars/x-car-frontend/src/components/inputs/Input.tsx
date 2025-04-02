'use client';
import React, { FC } from 'react';
import { IInput } from './input.interface';
import { useController, useFormContext } from 'react-hook-form';

const Input: FC<IInput> = ({
  disabled,
  label,
  className,
  children,
  ...inputProps
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const { name } = { ...inputProps };
  const { field } = useController<HTMLInputElement>({
    name,
    control,
  });

  return (
    <div className="flex flex-col mt-3">
      {label && (
        <label
          htmlFor={inputProps.name}
          className="block text-sm font-bold leading-6 text-gray-500 tracking-wide capitalize"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <div
          className={` border border-gray-400  flex justify-end items-center py-2 px-4 gap-2 rounded-md  ${disabled ? 'bg-gray-100' : 'bg-white'} `}
        >
          {name === 'phone' && (
            <span
              className={`text-gray-600 text-sm -ps-2 pe-2 border-r border-r-gray-400`}
            >
              +91{' '}
            </span>
          )}
          <input
            {...field}
            {...inputProps}
            disabled={disabled}
            value={field.value ?? ''}
            type={inputProps.type ?? 'text'}
            className={`block w-full rounded-md  text-gray-900  sm:text-sm sm:leading-6 outline-none ${className}
              ${disabled ? 'cursor-not-allowed' : ''}
              `}
          />
          {children}
        </div>
        {errors[inputProps.name] && (
          <p className="text-red-500 text-xs py-2 m-1">
            {errors[inputProps.name]?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
