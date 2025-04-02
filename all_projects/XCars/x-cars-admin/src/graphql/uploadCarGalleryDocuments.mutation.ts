import { graphql } from '@/generated/gql';

export const uploadCarGalleryDocumentsQuery = `
  mutation UploadCarGalleryDocuments(
  $files: [Upload!]!
  $documentType: DocumentTypeDocumentType!
  $carId: String!
  $fileType: String!
  $isThumbnail: Boolean!
  $uploadCarGalleryDocumentsId: String
) {
  uploadCarGalleryDocuments(
    files: $files
    documentType: $documentType
    carId: $carId
    fileType: $fileType
    isThumbnail: $isThumbnail
    id: $uploadCarGalleryDocumentsId
  ) {
    message
    success
  }
}

`;

export const UPLOAD_CAR_GALLERY = graphql(`
  mutation UploadCarGalleryDocuments(
    $files: [Upload!]!
    $documentType: DocumentTypeDocumentType!
    $carId: String!
    $fileType: String!
    $isThumbnail: Boolean!
    $uploadCarGalleryDocumentsId: String
  ) {
    uploadCarGalleryDocuments(
      files: $files
      documentType: $documentType
      carId: $carId
      fileType: $fileType
      isThumbnail: $isThumbnail
      id: $uploadCarGalleryDocumentsId
    ) {
      message
      success
    }
  }
`);
