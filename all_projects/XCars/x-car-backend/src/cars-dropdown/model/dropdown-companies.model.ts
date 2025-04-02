import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from '../../common/model/response.model';

@ObjectType()
export class DropdownCompanies extends Response {
  @Field(() => [String], { nullable: true })
  companies?: string[];
}
