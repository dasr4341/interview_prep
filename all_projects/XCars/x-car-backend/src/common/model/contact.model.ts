import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContactMessage {
  @Field(() => String)
  message: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ContactsData {
  @Field(() => String)
  id: string;

  @Field(() => [ContactMessage], { nullable: true })
  contactMessage?: ContactMessage[];

  @Field(() => String, { nullable: true })
  alternatePhone?: string;

  @Field(() => String, { nullable: true })
  alternateEmail?: string;

  @Field(() => String)
  carId: string;
}
