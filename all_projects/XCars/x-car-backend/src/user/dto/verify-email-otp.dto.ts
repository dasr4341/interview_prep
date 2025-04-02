import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class VerifyEmailOtpInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  otp: string;
}
