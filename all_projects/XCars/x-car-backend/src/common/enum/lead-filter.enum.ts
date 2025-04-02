import { registerEnumType } from '@nestjs/graphql';
import { createEnumFromObject, getColumnNames } from '../helper';

export const LeadTableFilterEnum = createEnumFromObject(
  getColumnNames({ tableName: 'Leads' }),
);

registerEnumType(LeadTableFilterEnum, { name: 'LeadTableFilterEnum' });
