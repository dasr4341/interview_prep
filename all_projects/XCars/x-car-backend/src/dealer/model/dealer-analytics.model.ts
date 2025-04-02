import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class DealerLead {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  leadId?: string;

  @Field(() => Boolean, { nullable: true })
  seen?: boolean;

  @Field(() => String, { nullable: true })
  note?: string;
}

@ObjectType()
class MonthlyLeads {
  @Field(() => String)
  month: string;

  @Field(() => [DealerLead])
  data: DealerLead[];

  @Field(() => Number)
  totalMonthlyLeads: number;
}

@ObjectType()
class YearlyLeads {
  @Field(() => Int)
  year: number;

  @Field(() => [MonthlyLeads])
  data: MonthlyLeads[];
}

@ObjectType()
class CarsAnalytics {
  @Field(() => Int)
  totalCarsPosted: number;

  @Field(() => Int)
  totalCarsApproved: number;

  @Field(() => Int)
  totalCarsPending: number;

  @Field(() => Int)
  totalCarsDisabled: number;
}

@ObjectType()
class LeadDetails {
  @Field(() => [YearlyLeads], { nullable: true })
  assignedLeads?: [YearlyLeads];

  @Field(() => Number, { nullable: true })
  totalUnAssignedLeadsCount?: number;

  @Field(() => Number, { nullable: true })
  totalAssignedLeadsCount?: number;

  @Field(() => [DealerRangeObject], { nullable: true })
  totalLeadsInRange?: DealerRangeObject[];
}

@ObjectType()
class DealerRangeObject {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class QuotationsDetails {
  @Field(() => Number, { nullable: true })
  activeQuotations: number;

  @Field(() => Number, { nullable: true })
  paidQuotations: number;

  @Field(() => Number, { nullable: true })
  pendingQuotations: number;

  @Field(() => Number, { nullable: true })
  cancelQuotations: number;

  @Field(() => Number, { nullable: true })
  expiredQuotations: number;

  @Field(() => [DealerRangeObject], { nullable: true })
  totalActiveQuotationsInRange?: DealerRangeObject[];

  @Field(() => [DealerRangeObject], { nullable: true })
  totalPendingQuotationsInRange?: DealerRangeObject[];

  @Field(() => [DealerRangeObject], { nullable: true })
  totalCancelQuotationsInRange?: DealerRangeObject[];

  @Field(() => [DealerRangeObject], { nullable: true })
  totalPaidQuotationsInRange?: DealerRangeObject[];

  @Field(() => [DealerRangeObject], { nullable: true })
  totalExpireQuotationsInRange?: DealerRangeObject[];
}

@ObjectType()
class DealerAnalyticsReport {
  @Field(() => CarsAnalytics, { nullable: true })
  cars?: CarsAnalytics;

  @Field(() => LeadDetails, { nullable: true })
  leads?: LeadDetails;

  @Field(() => QuotationsDetails, { nullable: true })
  quotations: QuotationsDetails;
}

@ObjectType()
export class DealerAnalyticsResponse extends Response {
  @Field(() => DealerAnalyticsReport)
  data: DealerAnalyticsReport;
}
