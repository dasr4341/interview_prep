import { registerEnumType } from '@nestjs/graphql';
import { createEnumFromObject, getColumnNames } from '../helper';
import { UserTableFilterEnum } from './user-filter.enum';

export const CarTableFilterEnum = createEnumFromObject(
  getColumnNames({ tableName: 'Car' }),
);
registerEnumType(CarTableFilterEnum, { name: 'CarTableFilterEnum' });

export const CarTableFilter = {
  ...CarTableFilterEnum,
  ...UserTableFilterEnum,
} as const;

registerEnumType(CarTableFilter, { name: 'CarTableFilter' });
