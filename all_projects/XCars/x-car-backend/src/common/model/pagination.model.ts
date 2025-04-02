import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field()
  maxPage: number;

  @Field()
  currentPage: number;

  @Field()
  total: number;

  @Field()
  limit: number;
}
