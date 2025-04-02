import { Scalar, CustomScalar } from '@nestjs/graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ValueNode } from 'graphql';

@Scalar('Upload', () => GraphQLUpload)
export class UploadScalar implements CustomScalar<any, any> {
  description = 'Upload custom scalar type';

  parseValue(value: FileUpload) {
    return value; // value comes from the client
  }

  serialize(value: any) {
    return value; // value sent to the client
  }

  parseLiteral(ast: ValueNode) {
    return null;
  }
}
