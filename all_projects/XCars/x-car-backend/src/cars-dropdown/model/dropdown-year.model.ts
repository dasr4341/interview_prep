import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from '../../common/model/response.model';

@ObjectType()
export class DropdownYear extends Response {
  @Field(() => [String], { nullable: true })
  manufacturingYears?: string[];
}
