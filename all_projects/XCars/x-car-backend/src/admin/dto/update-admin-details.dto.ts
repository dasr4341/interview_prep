import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UpdateAdminDetailsInput {
  userId: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
