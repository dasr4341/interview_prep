'use client';
import React, { FC } from 'react';
import { IInput } from './input.interface';
import { useController, useFormContext } from 'react-hook-form';

const Input: FC<IInput> = ({ className, children, ...inputProps }) => {
  const { control, register } = useFormContext();
  const { name } = { ...inputProps };
  const {
    fieldState: { error },
  } = useController<HTMLInputElement>({
    name,
    control,
  });

  return (
    <div className="flex flex-col">
      <label
        htmlFor="email"
        className="block text-sm font-semibold leading-6 text-gray-800"
      >
        {inputProps.id}
      </label>
      <div className="mt-2">
        <div className=" border flex justify-end items-center py-2 px-4 rounded-md bg-white ">
          <input
            {...inputProps}
            type={inputProps.type ?? 'text'}
            className={`block w-full rounded-md  text-gray-900  sm:text-sm sm:leading-6 outline-none ${className}`}
            {...register(name)}
          />
          {children}
        </div>
        {error && (
          <p className="text-red-500 text-xs py-2 m-1">{error?.message}</p>
        )}
      </div>
    </div>
  );
};

export default Input;
