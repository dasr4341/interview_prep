import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class FilterOperators extends Response {
  @Field(() => GraphQLJSONObject)
  data?: { [key: string]: string[] };
}
