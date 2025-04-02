import React, { ChangeEvent, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function TextInputFields({
  className,
  placeholder,
  type,
  register,
  children,
  onChange,
  defaultValue,
  readOnly,
  ref,
  disable,
  backgroundColor
}: {
  className?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  register?: UseFormRegisterReturn;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  readOnly?: any;
  ref?: any;
  disable?: boolean;
  backgroundColor?: string
 
}) {
  return (
    <div className="relative">
      <input
        disabled={disable}
        ref={ref}
        readOnly={readOnly}
        defaultValue={defaultValue || ''}
        type={type || 'text'}
        placeholder={placeholder || ''}
        onChange={onChange}
        className={`${className} ${backgroundColor || 'bg-white'} rounded-lg border border-gray-300 text-gray-750 text-xsm 
        font-normal px-4 py-4 hover:border-yellow-550 flex-1 appearance-none w-full focus:outline-none focus:ring-0 focus:border-transparent`}
        {...register}
      />
      {children}
    </div>
  );
}
