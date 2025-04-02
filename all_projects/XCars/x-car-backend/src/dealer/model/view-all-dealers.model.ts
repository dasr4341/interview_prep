import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from 'src/common/model/pagination.model';
import { Response } from 'src/common/model/response.model';
import { DealerDetails } from './dealer-details.model';

@ObjectType()
export class ViewAllDealers extends Response {
  @Field(() => [DealerDetails], { nullable: true })
  data: DealerDetails[];

  @Field(() => Pagination)
  pagination: Pagination;
}
