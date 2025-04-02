import { ReactNode } from 'react';
import { ImSpinner7 } from 'react-icons/im';

export default function Button({
  text,
  type,
  style,
  classes,
  children,
  onClick,
  disabled,
  size,
  loading,
  align,
  testId,
}: {
  classes?: Array<string> | string;
  children?: ReactNode;
  text?: string;
  style?: 'outline' | 'primary' | 'bg-none' | 'danger' | 'other' | 'no-outline' | 'secondary';
  size?: 'md' | 'lg' | 'xs';
  type?: 'button' | 'submit';
  align?: 'left' | 'right' | 'center';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  testId?: string;
}) {
  const getClassFromType = (styleType: string | undefined) => {
    switch (styleType) {
      case 'outline':
        return `btn-light hover:border-primary 
          hover:bg-primary hover:text-white`;

      case 'bg-none':
        return 'hover:opacity-60 justify-center';

      case 'danger':
        return 'btn-danger';

      case 'other':
        return ' justify-center ';

      case 'no-outline':
        return 'underline';

      case 'secondary':
        return 'btn-secondary';

      case 'primary':
      default:
        return `btn hover:border-primary 
        hover:bg-primary hover:text-white`;
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
      data-testid={testId}
      disabled={disabled}
      type={type ? type : 'submit'}
      onClick={() => onClick && onClick()}
      className={`${getClassFromType(style)} 
        ${getSize(size)} ${getAlign(align)} flex items-center ${
        Array.isArray(classes) ? classes?.join(' ') : classes
      } 
        ${disabled ? 'cursor-not-allowed' : ''}`}>
      {children}
      {text}
      {loading ? <ImSpinner7 className="animate-spin ml-2" data-testid="loading" /> : ''}
    </button>
  );
}
