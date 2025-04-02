import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';
import { registrationNumberRegex } from 'src/common/regex/registration-number.regex';

@ArgsType()
export class CarRegistrationNumberInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Enter registration number' })
  @Matches(registrationNumberRegex, {
    message: 'Registration number is not valid',
  })
  registrationNumber: string;
}
