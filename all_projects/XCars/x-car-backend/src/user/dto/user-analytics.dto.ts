import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
class UserInputRange {
  @Field(() => Date, { nullable: true })
  start?: Date;

  @Field(() => Date, { nullable: true })
  end?: Date;
}

@ArgsType()
export class UserAnalytics {
  @Field(() => UserInputRange, { nullable: true })
  leadRange?: UserInputRange;

  @Field(() => UserInputRange, { nullable: true })
  productPurchasedRange?: UserInputRange;
}
