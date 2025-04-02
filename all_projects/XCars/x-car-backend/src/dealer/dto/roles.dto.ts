import { ArgsType, Field } from '@nestjs/graphql';
import { Roles } from '@prisma/client';

@ArgsType()
export class RoleInput {
  @Field(() => Roles)
  role: Roles;
}
