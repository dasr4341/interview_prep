import { graphql } from '@/generated/gql';

export const GET_CAR_BUNDLE = graphql(`
  query GetCarBundle($bundleId: String!, $carId: String!) {
    getCarBundle(bundleId: $bundleId, carId: $carId) {
      message
      success
      data {
        id
        fileType
        thumbnail
        amount
        bundledItems {
          CarProduct {
            id
            fileType
            amount
            productType
            thumbnail
            createdAt
            updatedAt
            CarProductDocuments {
              documentType
              fileName
              path
            }
          }
        }
      }
    }
  }
`);
