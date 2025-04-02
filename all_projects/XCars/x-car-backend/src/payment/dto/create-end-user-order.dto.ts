import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateEndUserOrderInput {
  @Field(() => String)
  carId: string;

  @Field(() => String, { nullable: true })
  bundleId?: string;

  @Field(() => [String], { nullable: true })
  products?: string[];

  userId: string;
}
