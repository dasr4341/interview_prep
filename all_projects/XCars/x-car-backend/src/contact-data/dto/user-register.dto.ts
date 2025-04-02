import { Field, InputType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';

@InputType()
export class ContactFormRegisterInput {
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  role: Roles;
}
