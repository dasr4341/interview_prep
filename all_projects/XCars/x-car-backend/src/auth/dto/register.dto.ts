import { ArgsType, Field } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class DealerRegisterInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phoneNumber: string;

  role: Roles;
}

@ArgsType()
export class UserRegisterInput extends DealerRegisterInput {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  role: Roles;
}
