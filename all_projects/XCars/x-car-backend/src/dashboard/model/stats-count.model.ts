import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class LeadsCount {
  @Field(() => Number)
  totalLeads: number;

  @Field(() => Number)
  totalHotAssignedLeads: number;

  @Field(() => Number)
  totalColdAssignedLeads: number;

  @Field(() => Number)
  totalHotUnassignedLeads: number;

  @Field(() => Number)
  totalColdUnassignedLeads: number;

  @Field(() => Number)
  inPast7DaysLeads: number;
}

@ObjectType()
export class CarsCount {
  @Field(() => Number)
  totalCars: number;

  @Field(() => Number)
  totalPendingCars: number;

  @Field(() => Number)
  totalSoldCars: number;

  @Field(() => Number)
  inPast7DaysSoldCars: number;

  @Field(() => Number)
  totalDisabledCars: number;

  @Field(() => Number)
  totalApprovedCars: number;

  @Field(() => Number)
  inPast7DaysApprovedCars: number;
}

@ObjectType()
export class GetStatsCountModel {
  @Field(() => LeadsCount)
  leads: LeadsCount;

  @Field(() => CarsCount)
  cars: CarsCount;

  @Field(() => Number)
  totalDealers: number;

  @Field(() => Number)
  totalCustomers: number;

  @Field(() => Number)
  totalVisitors: number;

  @Field(() => Number)
  inPast7DaysVisitors: number;
}

@ObjectType()
export class GetStatsCountResponseModel extends Response {
  @Field(() => GetStatsCountModel)
  data: GetStatsCountModel;
}
