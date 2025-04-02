import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class PaymentVerification extends Response {
  @Field(() => String)
  carId: string;
}

@ObjectType()
class Data {
  @Field(() => String)
  paymentId: string;
}

@ObjectType()
export class UserPaymentVerification extends Response {
  @Field(() => Data)
  data: Data;
}
