import { registerEnumType } from '@nestjs/graphql';

export enum Roles {
  ADMIN = 'ADMIN',
  DEALER = 'DEALER',
  USER = 'USER',
}

registerEnumType(Roles, {
  name: 'Roles',
  description: 'User roles',
});
