import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';
import { Token } from 'src/common/model/sign-in-response.model';
@ObjectType()
export class VerifyRegistrationWithPhoneNumber extends Response {
  @Field(() => Token, { nullable: true })
  signInToken?: Token;

  @Field(() => String, { nullable: true })
  dealerId?: string;
}
