import { ReactNode } from 'react';
import { ImSpinner7 } from 'react-icons/im';

export default function Button({
  text,
  type,
  buttonStyle,
  classes,
  children,
  onClick,
  disabled,
  size,
  loading,
  align,
  testId,
  tabIndex,
  className,
  form
}: {
  classes?: Array<string> | string;
  children?: ReactNode;
  text?: string;
  buttonStyle?: 'outline' | 'primary' | 'bg-none' | 'danger' | 'other' | 'no-outline' | 'secondary' | 'gray' | 'gray-no-hover' | 'green' | 'black' | 'blue';
  size?: 'md' | 'lg' | 'xs';
  type?: 'button' | 'submit';
  align?: 'left' | 'right' | 'center';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  testId?: string;
  tabIndex?: number;
    className?: string;
    form?: string
}) {
  const getClassFromType = (styleType: string | undefined) => {
    switch (styleType) {
      case 'outline':
        return 'btn-light hover:border-primary hover:bg-primary hover:text-white';

      case 'bg-none':
        return 'hover:opacity-60 justify-center';

      case 'danger':
        return 'btn-light border-pt-red-800 text-pt-red-800 hover:border-pt-red-800 hover:bg-pt-red-800  hover:text-white';

      case 'other':
        return ' justify-center ';

      case 'no-outline':
        return 'underline';

      case 'secondary':
        return 'btn-secondary';

      case 'gray':
        return 'bg-gray-350 text-black rounded-xl hover:bg-gray-400';

      case 'gray-no-hover':
        return 'bg-gray-200 text-gray-500 rounded-xl';

      case 'green':
        return 'bg-pt-green-600 text-white rounded-xl hover:bg-pt-green-500';

      case 'black':
        return 'bg-black text-white rounded-xl hover:bg-gray-400';

      case 'blue':
        return 'bg-primary-light text-white rounded-xl hover:bg-primary px-4';

      case 'primary':
      default:
        return `btn hover:border-yellow-800 
        hover:bg-yellow-800 hover:text-black`;
    }
  };

  const getSize = (sizeState: string | undefined) => {
    switch (sizeState) {
      case 'lg':
        return 'px-18 h-14';

      case 'md':
        return 'py-2 px-6';

      case 'xs':
        return 'p-0';
      default:
        return 'px-6 md:px-14 h-11';
    }
  };

  const getAlign = (alignState: string | undefined) => {
    switch (alignState) {
      case 'left':
        return 'justify-start';

      case 'right':
        return 'justify-end';

      default:
        return 'justify-center';
    }
  };

  return (
    <button
      form={form}
      data-testid={testId}
      disabled={disabled}
      tabIndex={tabIndex}
      type={type ? type : 'submit'}
      onClick={() => onClick && onClick()}
      className={`${getClassFromType(buttonStyle)} ${className}
        ${getSize(size)} ${getAlign(align)} flex items-center ${Array.isArray(classes) ? classes?.join(' ') : classes} 
        ${disabled ? 'cursor-not-allowed' : ''}`}>
      {children}
      {text}
      {loading ? <ImSpinner7 className="animate-spin ml-2" data-testid="loading" /> : ''}
    </button>
  );
}
