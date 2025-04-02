import React from 'react';
import { IButton } from './button.interface';
import { Loader } from '../Icons/Loader';

const Button: React.FC<IButton> = ({
  loading,
  className,
  onClick,
  children,
  buttonType,
  ...buttonProps
}) => {
  const getButtonStyles = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-grayColor text-white px-4 py-2 rounded-md ';
      case 'formSubmit':
        return 'p-3 my-5 w-full bg-gray-300 rounded-lg font-medium';
      default:
        return 'p-3 my-5 w-full bg-blue-300 rounded-lg font-medium';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`  outline-none 
                ${
                  buttonProps.disabled
                    ? ' text-gray-500 cursor-not-allowed'
                    : 'hover:scale-[1.015]'
                }
                ${getButtonStyles(buttonType!)} ${className} `}
      {...buttonProps}
    >
      <div className=" flex justify-center gap-2 bg-transparent items-center min-h-8">
        {loading && <Loader />}
        {children}
      </div>
    </button>
  );
};

export default Button;
