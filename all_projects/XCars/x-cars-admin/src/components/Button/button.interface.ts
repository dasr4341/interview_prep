import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  buttonType?: 'primary' | 'formSubmit';
}
