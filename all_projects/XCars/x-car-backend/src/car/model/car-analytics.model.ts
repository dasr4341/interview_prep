import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Pagination } from 'src/common/model/pagination.model';
import { Response } from 'src/common/model/response.model';

@ObjectType()
class RangeObject {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class SalesDetails {
  @Field(() => String)
  fileType: string;

  @Field(() => Number)
  count: number;
}

@ObjectType()
class ProductsSold {
  @Field(() => Number)
  totalRevenue: number;

  @Field(() => Number)
  totalProductsSoldCount: number;

  @Field(() => [SalesDetails])
  sales: SalesDetails[];
}

@ObjectType()
class QuotationsSold {
  @Field(() => Number)
  totalActiveQuotationCount: number;

  @Field(() => Number)
  totalPendingQuotationCount: number;

  @Field(() => Number)
  totalCancelledQuotationCount: number;

  @Field(() => Number)
  totalExpiredQuotationCount: number;
}

@ObjectType()
export class CarAnalytics {
  @Field(() => QuotationsSold)
  quotationDetails: QuotationsSold;

  @Field(() => Number)
  totalLeadCount: number;

  @Field(() => Number)
  totalViewCount: number;

  @Field(() => ProductsSold)
  productDetails: ProductsSold;

  @Field(() => [RangeObject])
  totalLeadsInRange: RangeObject[];

  @Field(() => [RangeObject])
  totalViewsInRange: RangeObject[];

  @Field(() => [RangeObject])
  totalProductSoldInRange: RangeObject[];
}

@ObjectType()
export class CarAnalyticsResponse extends Response {
  @Field(() => CarAnalytics)
  data: CarAnalytics;
}

@ObjectType()
export class CarViewerUser {
  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;
}

@ObjectType()
export class CarSingleView {
  @Field(() => String)
  rowId: string;

  @Field(() => String)
  ipAddress: string;

  @Field(() => Number)
  viewsCount: number;

  @Field(() => Date)
  latestViewedAt: Date;

  @Field(() => String)
  userAgent: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  userId: string;

  @Field(() => CarViewerUser, { nullable: true })
  @IsOptional()
  user: CarViewerUser;
}

@ObjectType()
export class CarViewers extends Response {
  @Field(() => [CarSingleView], { nullable: true })
  data: CarSingleView[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
