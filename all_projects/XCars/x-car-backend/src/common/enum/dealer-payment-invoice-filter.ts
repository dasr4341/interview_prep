import { registerEnumType } from '@nestjs/graphql';
import { createEnumFromObject, getColumnNames } from '../helper';

export const DealerInvoiceTableFilterEnum = createEnumFromObject(
  getColumnNames({ tableName: 'InvoiceRecord' }),
);

registerEnumType(DealerInvoiceTableFilterEnum, {
  name: 'DealerInvoiceTableFilterEnum',
});
