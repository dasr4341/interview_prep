import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetQuotationInput {
  @Field(() => String, { nullable: true })
  @IsUUID(undefined, { message: 'Car Id is invalid!' })
  @IsOptional()
  carId?: string;

  @Field(() => String, { nullable: true })
  @IsUUID(undefined, { message: 'Car Id is invalid!' })
  @IsOptional()
  quotationId?: string;

  @Field(() => String, { nullable: true })
  @IsUUID(undefined, { message: 'Car Id is invalid!' })
  @IsOptional()
  dealerId?: string;
}
