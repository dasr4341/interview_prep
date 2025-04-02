import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateOrderInput {
  @Field(() => String)
  QuotationId: string;

  dealerId: string;
}
