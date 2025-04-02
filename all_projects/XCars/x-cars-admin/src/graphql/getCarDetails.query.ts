import { graphql } from '@/generated/gql';

export const GET_CARS_DETAILS = graphql(`
  query GetCarDetailAdmin($carId: String!) {
    getCarDetailAdmin(carId: $carId) {
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
        updatedAt
        userId
        quotation {
          id
          status
          createdAt
          quotationDetails {
            noOfLeads
            validityDays
            amount
            currency
            expiryDate
            startDate
          }
        }
        user {
          id
          firstName
          lastName
          companyName
          location
          status
          email
          phoneNumber
          documents {
            id
            userId
            fileName
            path
          }
        }
        products {
          id
          fileType
          productType
          amount
          discountedAmount
          currency
          thumbnail
          documents {
            id
            fileName
            path
            documentType
          }
          createdAt
          updatedAt
        }
        gallery {
          id
          fileType
          thumbnail
          documents {
            id
            fileName
            path
            documentType
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`);
