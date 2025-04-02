import { ReactNode } from 'react';

export interface IRoutesDataType {
  item: {
    name: string;
    path: string;
    children?: ReactNode;
  };
  classes: string;
  children?: ReactNode;
  onClick?: () => void;
}
