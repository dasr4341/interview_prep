import { ReactNode } from 'react';
interface IRoute {
  name: string;
  path: string;
  icon?: ReactNode;
  // eslint-disable-next-line no-unused-vars
  build?: (id: string) => string;
}

export interface IRoutesDataType extends IRoute {
  children: { [key: string]: IRoute };
}
