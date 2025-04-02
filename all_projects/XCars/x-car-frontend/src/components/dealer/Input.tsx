import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  error,
  disabled = false,
  children,
}) => {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col relative">
      <label className="block text-md font-semibold leading-6 text-gray-500 tracking-wide capitalize">
        {label}
      </label>
      <div
        className={`flex items-center border rounded overflow-hidden ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {name === 'phone' && (
          <span
            className={`text-gray-600 text-sm px-2 border-r border-r-gray-400`}
          >
            +91{' '}
          </span>
        )}
        <input
          className={`flex-1 p-2 ps-3 text-[15px] outline-none ${disabled ? 'cursor-not-allowed' : ''}`}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {children}
      </div>
      <p
        className={`text-red-500 text-[12px] absolute left-0 bottom-[-18px] ${error ? 'visible' : 'invisible'}`}
      >
        {error ?? 'error'}
      </p>
    </div>
  );
};

export default Input;
