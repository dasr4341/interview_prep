import { ArgsType, Field } from '@nestjs/graphql';
import { DocumentType } from '@prisma/client';

@ArgsType()
export class UploadCarProducts {
  @Field(() => DocumentType)
  documentType: DocumentType;

  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Number)
  amount: number;

  @Field(() => Number, { nullable: true })
  discountedAmount: number;

  @Field(() => String)
  carId: string;

  @Field(() => String)
  fileType: string;
}

//comment
@ArgsType()
export class UploadCarGalleryDocuments {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => DocumentType)
  documentType: DocumentType;

  @Field(() => String)
  carId: string;

  @Field(() => String)
  fileType: string;

  @Field(() => Boolean)
  isThumbnail: boolean;
}
