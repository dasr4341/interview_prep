import { ObjectType, Field } from '@nestjs/graphql';
import { Response } from '../../common/model/response.model';
import { FuelType, TransmissionType } from '@prisma/client';

@ObjectType()
class CarVariant {
  @Field(() => String)
  variantName: string;

  @Field(() => TransmissionType)
  transmissionType: TransmissionType;

  @Field(() => FuelType)
  fuelType: FuelType;
}

@ObjectType()
export class DropdownVariant extends Response {
  @Field(() => [CarVariant], { nullable: true })
  variant?: CarVariant[];
}
