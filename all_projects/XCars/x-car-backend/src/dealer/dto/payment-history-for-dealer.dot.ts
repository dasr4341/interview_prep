import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaymentHistoryForDealer {
  @Field(() => String)
  dealerId: string;

  @Field(() => String)
  invoiceId: string;
}
