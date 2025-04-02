import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from './response.model';

@ObjectType()
export class Token {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@ObjectType()
export class SignInResponse extends Response {
  @Field({ nullable: true })
  signInToken?: Token;
}
