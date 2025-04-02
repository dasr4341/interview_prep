import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';
import { Lead } from './lead.model';
import { Pagination } from 'src/common/model/pagination.model';

@ObjectType()
export class LeadModel extends Response {
  @Field(() => [Lead])
  data: [Lead];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}

@ObjectType()
export class UnassignedLeadModel extends Response {
  @Field(() => [Lead], { nullable: true })
  data?: [Lead];
}
