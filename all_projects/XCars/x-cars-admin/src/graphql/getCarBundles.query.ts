import { graphql } from '@/generated/gql';

export const GET_CAR_BUNDLES = graphql(`
  query GetCarBundles($carId: String!) {
    getCarBundles(carId: $carId) {
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
