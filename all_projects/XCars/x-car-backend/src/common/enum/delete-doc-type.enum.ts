import { registerEnumType } from '@nestjs/graphql';

export enum DeleteDocType {
  CAR_GALLERY = 'CAR_GALLERY',
  DEALER = 'DEALER',
}

registerEnumType(DeleteDocType, { name: 'DeleteDocType' });
