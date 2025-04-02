import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentType } from '@prisma/client';

@ObjectType()
export class CarGalleryDocuments {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  fileName?: string;

  @Field(() => DocumentType)
  documentType: DocumentType;

  @Field(() => String)
  path: string;

  @Field(() => Boolean)
  thumbnail?: boolean;

  @Field(() => String)
  carId: string;
}
