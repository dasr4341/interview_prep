import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class QuotationInput {
  adminId: string;

  @Field(() => String)
  @IsUUID(undefined, { message: 'Car Id is invalid!' })
  carId: string;

  @Field(() => Number)
  noOfLeads: number;

  @Field(() => Number)
  validityDays: number;

  @Field(() => Number)
  amount: number;
}
