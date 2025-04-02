import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from '../../common/model/response.model';

@ObjectType()
export class DropdownModels extends Response {
  @Field(() => [String], { nullable: true })
  modelNames?: string[];
}
