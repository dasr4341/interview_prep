import {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  name?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  children?: ReactNode;
}
