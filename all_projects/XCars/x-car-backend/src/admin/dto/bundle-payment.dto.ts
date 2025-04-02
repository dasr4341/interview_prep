import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class BundlePayment {
  @IsUUID(undefined, { message: 'Car Id is invalid!' })
  @Field(() => String)
  carId: string;

  @Field(() => [String])
  productIds: string[];

  @Field(() => String)
  name: string;

  @Field(() => Int)
  amount: number;

  @Field(() => Int, { nullable: true })
  discountedAmount: number;
}
