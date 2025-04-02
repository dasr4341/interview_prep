import { registerEnumType } from '@nestjs/graphql';

export enum LeadTypes {
  LEAD = 'LEAD',
  HOT_LEAD = 'HOT_LEAD',
}

registerEnumType(LeadTypes, { name: 'LeadTypes' });
