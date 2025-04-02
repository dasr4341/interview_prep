import { ReactNode } from 'react';

export interface IInput {
  disabled?: boolean;
  label: string;
  className?: string;
  name?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  children?: ReactNode;
}
