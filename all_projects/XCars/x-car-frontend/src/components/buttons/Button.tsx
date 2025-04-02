import React from 'react';
import { IButton } from './button.interface';
import { Loader } from '../icons/Loader';

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
      case 'submit':
        return 'p-3 my-5 w-full bg-gray-300 rounded-lg font-medium';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`  outline-none 
                ${buttonProps.disabled ? ' text-gray-500 cursor-not-allowed' : ''}
                ${getButtonStyles(buttonType!)} ${className} `}
      {...buttonProps}
    >
      <div className=" flex justify-center items-center min-h-4 gap-2">
        {loading && (
          <Loader className="inline w-3 h-3 text-gray-300 animate-spin dark:text-gray-100 fill-gray-100 dark:fill-gray-300 bg-transparent " />
        )}
        {children}
      </div>
    </button>
  );
};

export default Button;
