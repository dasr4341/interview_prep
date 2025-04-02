import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from 'src/common/model/pagination.model';

@ObjectType()
export class GetFilteredData extends Response {
  data: any[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
