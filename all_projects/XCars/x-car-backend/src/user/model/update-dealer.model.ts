import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';
import { User } from 'src/common/model/user.model';

@ObjectType()
export class UpdateDealer extends Response {
  @Field(() => User)
  data: User;
}
