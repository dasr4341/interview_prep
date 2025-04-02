import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class VerifyPhoneNumberOtpInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phoneNumber: string;

  @Field(() => String)
  otp: string;
}
