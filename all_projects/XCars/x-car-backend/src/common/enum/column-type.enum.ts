import { registerEnumType } from '@nestjs/graphql';

export enum TableColumnType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ENUM = 'enum',
  DATE = 'date',
}

registerEnumType(TableColumnType, { name: 'TableColumnType' });
