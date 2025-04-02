import { graphql } from '@/generated/gql';

export const uploadDealerDocumentQuery = `
mutation UploadUserDocument($files: [Upload!]!, $fileType: String!, $uploadCategory: FileType!, $dealerId: String!) {
  uploadUserDocument(files: $files, fileType: $fileType, uploadCategory: $uploadCategory, dealerId: $dealerId) {
    message
    success
  }
}
`;
export const UPLOAD_DEALER_DOCUMENT = graphql(`
  mutation UploadUserDocument(
    $files: [Upload!]!
    $fileType: String!
    $uploadCategory: FileType!
    $dealerId: String!
  ) {
    uploadUserDocument(
      files: $files
      fileType: $fileType
      uploadCategory: $uploadCategory
      dealerId: $dealerId
    ) {
      message
      success
    }
  }
`);
