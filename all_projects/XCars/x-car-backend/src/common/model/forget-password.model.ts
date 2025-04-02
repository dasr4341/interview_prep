import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from './response.model';

@ObjectType()
export class ForgetPasswordResponse extends Response {
  @Field(() => String, { nullable: true })
  token: string;
}
