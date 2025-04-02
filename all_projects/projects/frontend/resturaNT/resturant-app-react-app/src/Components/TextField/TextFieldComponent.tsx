import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function TextFieldComponent({
  extraStyle,
  iconType,
  icon,
  name,
  type,
  placeholder,
  register,
}: {
    extraStyle?: string;
  iconType?: string;
  icon?: JSX.Element;
  name?: string;
  placeholder: string;
  type?: 'text' | 'password' | string;
  register: UseFormRegisterReturn,
}) {

  return (
    <div className='flex flex-col mb-2'>
      <div className='flex relative '>
        <span className={` ${iconType} rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l 
        border-b  border-gray-300 text-gray-500 shadow-sm text-sm`}>
          {icon}
        </span>
        <input
          {...register}
          type={type || 'text'}
          className={` ${iconType === 'hidden' ? 'rounded' : 'rounded-r-lg'} 
            ${extraStyle}
          flex-1 appearance-none border border-gray-300 w-full py-2 px-4 ${name === 'password' ? 'pr-8' : ''} bg-white text-gray-700 
          placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-black 
          focus:border-transparent
         
          `}
          placeholder={placeholder}
        
        />
      </div>
    </div>
  );
}
