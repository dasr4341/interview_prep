import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaymentId {
  @Field(() => String)
  paymentId: string;
}
