import { Field, ObjectType } from '@nestjs/graphql';
import { SalesDetails } from 'src/car/model/car-analytics.model';
import { Response } from 'src/common/model/response.model';

@ObjectType()
class RangeDetails {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class ProductsSoldDetails {
  @Field(() => Number)
  totalPaid: number;

  @Field(() => [SalesDetails])
  sales: SalesDetails[];
}

@ObjectType()
class AnalyticsReport {
  @Field(() => Number)
  totalCarsApplied: number;

  @Field(() => [RangeDetails])
  leads: RangeDetails[];

  @Field(() => [RangeDetails])
  products: RangeDetails[];

  @Field(() => ProductsSoldDetails)
  productDetails: ProductsSoldDetails;
}

@ObjectType()
export class UserAnalyticsReport extends Response {
  @Field(() => AnalyticsReport, { nullable: true })
  data: AnalyticsReport;
}

@ObjectType()
export class UserAnalytics {
  @Field()
  id: string;

  @Field(() => String)
  userAgent: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  ipAddress?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
