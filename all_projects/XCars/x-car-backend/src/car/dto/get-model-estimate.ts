import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetModelEstimate {
  @Field(() => String, { nullable: false })
  company: string;

  @Field(() => String, { nullable: false })
  model: string;

  @Field(() => String, { nullable: false })
  year: string;

  @Field(() => String, { nullable: false })
  fuelType: string;

  @Field(() => String, { nullable: false })
  transmissionType: string;

  @Field(() => String, { nullable: true })
  variantName?: string;
}
