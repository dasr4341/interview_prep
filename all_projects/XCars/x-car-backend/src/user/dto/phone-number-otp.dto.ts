import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class PhoneNumberOtpInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phoneNumber: string;
}
