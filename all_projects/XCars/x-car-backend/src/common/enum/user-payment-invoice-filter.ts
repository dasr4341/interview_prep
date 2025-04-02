import { registerEnumType } from '@nestjs/graphql';
import { createEnumFromObject, getColumnNames } from '../helper';

export const UserInvoiceTableFilterEnum = createEnumFromObject(
  getColumnNames({ tableName: 'InvoiceRecord' }),
);

registerEnumType(UserInvoiceTableFilterEnum, {
  name: 'UserInvoiceTableFilterEnum',
});
