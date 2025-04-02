import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class ContactDataDTO {
  @Field(() => String)
  carId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(10)
  alternatePhone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  alternateEmail?: string;

  @Field(() => String)
  @IsString()
  message: string;
}
