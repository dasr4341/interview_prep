import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class AdminLoginInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;
}
