import React, { ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function TextArea({
  className,
  placeholder,
  register,
  children,
}: {
  className?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  children?: ReactNode;
}) {
  return (
    <div className="relative">
      <textarea
        placeholder={placeholder || ''}
        className={`rounded-lg flex-1 appearance-none border border-gray-300 w-full
             text-gray-750  text-xsm font-normal px-4 py-5 
            focus:outline-none focus:ring-0 hover:border-yellow-550 focus:border-transparent ${className}`}
        {...register}
      />
      {children}
    </div>
  );
}
