import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@ArgsType()
export class UpdateDealerInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  dealerId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  companyName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  file?: FileUpload;
}

@ArgsType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  file?: FileUpload;
}
