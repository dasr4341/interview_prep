import { registerEnumType } from '@nestjs/graphql';
import { createEnumFromObject, getColumnNames } from '../helper';

export const UserTableFilterEnum = createEnumFromObject(
  getColumnNames({ tableName: 'User' }),
);

registerEnumType(UserTableFilterEnum, { name: 'UserTableFilterEnum' });
