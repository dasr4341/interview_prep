import { registerEnumType } from '@nestjs/graphql';

export enum FileType {
  DOCUMENTS = 'documents',
  IMAGES = 'images',
  PROFILE_IMAGE = 'profile_image',
}

registerEnumType(FileType, {
  name: 'FileType',
  description: 'File Upload Types',
});
