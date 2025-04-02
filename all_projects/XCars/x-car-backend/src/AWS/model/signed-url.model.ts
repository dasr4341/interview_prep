import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class SignedURLGenerate extends Response {
  @Field(() => String)
  data: string;
}
