import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
class Range {
  @Field(() => Date, { nullable: true })
  start?: Date;

  @Field(() => Date, { nullable: true })
  end?: Date;
}

@ArgsType()
export class CarAnalytics {
  @Field(() => String)
  carId: string;

  @Field(() => Range, { nullable: true })
  lead?: Range;

  @Field(() => Range, { nullable: true })
  views?: Range;

  @Field(() => Range, { nullable: true })
  product?: Range;
}
