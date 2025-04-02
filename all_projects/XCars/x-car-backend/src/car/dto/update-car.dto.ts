import { InputType, Field } from '@nestjs/graphql';
import { CarStatus } from '@prisma/client';

@InputType()
export class UpdateCarStatus {
  @Field(() => String)
  id: string;

  @Field(() => CarStatus)
  carStatus: CarStatus;
}
