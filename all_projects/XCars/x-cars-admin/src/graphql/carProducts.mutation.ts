import { graphql } from '@/generated/gql';

export const uploadCarProductsQuery = `
  mutation UploadCarProducts(
    $files: [Upload!]!
    $documentType: DocumentTypeDocumentType!
    $amount: Float!
    $carId: String!
    $fileType: String!
    $uploadCarProductsId: String
    $discountedAmount: Float
  ) {
    uploadCarProducts(
      files: $files
      documentType: $documentType
      amount: $amount
      carId: $carId
      fileType: $fileType
      id: $uploadCarProductsId
      discountedAmount: $discountedAmount
    ) {
      message
      success
    }
  }
`;
export const UPLOAD_CAR_PRODUCTS = graphql(`
  mutation UploadCarProducts(
    $files: [Upload!]!
    $documentType: DocumentTypeDocumentType!
    $amount: Float!
    $carId: String!
    $fileType: String!
    $uploadCarProductsId: String
    $discountedAmount: Float
  ) {
    uploadCarProducts(
      files: $files
      documentType: $documentType
      amount: $amount
      carId: $carId
      fileType: $fileType
      id: $uploadCarProductsId
      discountedAmount: $discountedAmount
    ) {
      message
      success
    }
  }
`);

export const DELETE_PRODUCT = graphql(`
  mutation DeleteProduct($productIds: [String!]!) {
    deleteProduct(productIds: $productIds) {
      message
      success
    }
  }
`);

export const DELETE_PRODUCT_BUNDLE = graphql(`
  mutation DeleteBundle($bundleId: String!) {
    deleteBundle(bundleId: $bundleId) {
      message
      success
    }
  }
`);
