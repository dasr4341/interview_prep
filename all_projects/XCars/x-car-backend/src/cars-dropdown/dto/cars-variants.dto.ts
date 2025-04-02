import { ArgsType, Field } from '@nestjs/graphql';
import { FuelType, TransmissionType } from '@prisma/client';

@ArgsType()
export class CarsVariant {
  @Field(() => String)
  company?: string;

  @Field(() => String)
  year?: string;

  @Field(() => String)
  model?: string;

  @Field(() => TransmissionType)
  transmissionType?: TransmissionType;

  @Field(() => FuelType)
  fuelType?: FuelType;
}
