import { registerEnumType } from '@nestjs/graphql';
import { createEnumFromObject, getColumnNames } from '../helper';

export const DealerLeadTableFilterEnum = createEnumFromObject(
  getColumnNames({ tableName: 'DealerLeads' }),
);

registerEnumType(DealerLeadTableFilterEnum, {
  name: 'DealerLeadTableFilterEnum',
});
