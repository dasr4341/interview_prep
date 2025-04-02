import { ArgsType, Field } from '@nestjs/graphql';
import { FileType } from 'src/common/types/upload-file-type';

@ArgsType()
export class UploadUserDocument {
  @Field(() => String)
  fileType: string;

  @Field(() => FileType)
  uploadCategory: FileType;

  @Field(() => String)
  dealerId: string;
}
