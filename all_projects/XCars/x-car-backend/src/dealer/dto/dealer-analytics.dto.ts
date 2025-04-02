import { Field, InputType } from '@nestjs/graphql';

@InputType()
class DealerRange {
  @Field(() => Date, { nullable: true })
  start?: Date;

  @Field(() => Date, { nullable: true })
  end?: Date;
}
@InputType()
export class DealerAnalyticsDto {
  @Field(() => String)
  dealerId: string;

  @Field(() => DealerRange, { nullable: true })
  lead?: DealerRange;

  @Field(() => DealerRange, { nullable: true })
  quotation?: DealerRange;
}
