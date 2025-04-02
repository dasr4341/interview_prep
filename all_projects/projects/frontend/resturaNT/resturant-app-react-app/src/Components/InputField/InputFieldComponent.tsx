import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function InputFieldComponent({
  iconType,
  icon,
  name,
  type,
  placeholder,
  register,
  disabled,
  paddingRight
}: {
  iconType?: string;
  icon?: JSX.Element;
  name?: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  disabled?: boolean;
  paddingRight?: boolean;
}) {
  return (
    <>
      <div className='flex relative '>
        <span className={` ${iconType} rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l 
        border-b  border-gray-300 text-gray-500 shadow-sm text-sm`}>
          {icon}
        </span>
        <input
          type={type || 'text'}
          placeholder={placeholder}
          className={`${iconType === 'hidden' ? 'rounded-lg' : 'rounded-r-lg'}
          flex-1 appearance-none border border-gray-300 w-full py-2 px-4 
          ${name === 'password' ? 'pr-8' : ''} bg-white text-gray-500 placeholder-gray-400 shadow text-base 
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:border-black 
          ${paddingRight ? 'pr-8' : ''}`}
          {...register}
          disabled={disabled}
        />
      </div>
    </>
  );
}

