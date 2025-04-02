import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
class Prefill {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  contact: string;
}

@ObjectType()
class Order {
  @Field(() => String)
  id: string;

  @Field(() => Number)
  amount: number;

  @Field(() => Number, { nullable: true })
  amount_paid?: number;

  @Field(() => String)
  currency: string;

  @Field(() => String, { nullable: true })
  receipt?: string;

  @Field(() => String, { nullable: true })
  attempts?: string;

  @Field(() => Number, { nullable: true })
  amount_due?: number;

  @Field(() => Prefill)
  prefill: Prefill;

  @Field(() => String)
  order_id: string;
}

@ObjectType()
export class RazorpayOrderApp extends Response {
  @Field(() => Order)
  order: Order;
}

@ObjectType()
class Theme {
  @Field(() => String)
  color: string;
}

@ObjectType()
class OrderDetails {
  @Field(() => String)
  id: string;

  @Field(() => String)
  entity: string;

  @Field(() => String)
  amount: string;

  @Field(() => String)
  currency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  order_id: string;

  @Field(() => String)
  name: string;

  @Field(() => Theme)
  theme: Theme;

  @Field(() => Prefill)
  prefill: Prefill;
}

@ObjectType()
export class RazorpayOrderWeb extends Response {
  @Field(() => OrderDetails)
  order: OrderDetails;
}
