import { InputType, Int, Field } from '@nestjs/graphql';
import { FuelType, TransmissionType, CarStatus } from '@prisma/client';
import { Matches } from 'class-validator';
import { registrationNumberRegex } from 'src/common/regex/registration-number.regex';

@InputType()
export class CreateCarInput {
  userId: string;

  @Field(() => Int)
  launchYear: number;

  @Field(() => Int)
  totalRun: number;

  @Field(() => Int)
  noOfOwners: number;

  @Field(() => String)
  model: string;

  @Field(() => String)
  variant: string;

  @Field(() => String)
  companyName: string;

  @Field(() => String)
  @Matches(registrationNumberRegex, {
    message: 'Registration number is not valid',
  })
  registrationNumber: string;

  @Field(() => FuelType)
  fuelType: FuelType;

  @Field(() => TransmissionType)
  transmission: TransmissionType;

  status: CarStatus;
}
