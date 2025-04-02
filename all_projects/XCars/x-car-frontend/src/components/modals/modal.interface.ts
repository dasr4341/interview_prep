import { ReactNode } from 'react';

export interface IModal {
  heading?: string;
  onClose?: () => void;
  children: ReactNode;
}
