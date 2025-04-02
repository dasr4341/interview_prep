import { graphql } from '@/generated/gql';
export const CAR_DETAIL_QUERY = graphql(`
  query GetCarDetailUser($carId: String!) {
    getCarDetailUser(carId: $carId) {
      message
      success
      data {
        id
        launchYear
        totalRun
        noOfOwners
        model
        companyName
        variant
        registrationNumber
        fuelType
        transmission
        status
        createdAt
        gallery {
          id
          fileType
          thumbnail
          createdAt
          updatedAt
          documents {
            id
            fileName
            path
            documentType
          }
        }
        lead
        products {
          amount
          currency
          discountedAmount
          documents {
            documentType
            id
            fileName
            path
          }
          fileType
          id
          productType
          thumbnail
        }
      }
    }
  }
`);
