import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class EmailOtpInput {
  @Field(() => String)
  @IsEmail()
  email: string;
}
