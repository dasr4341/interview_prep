import { graphql } from '@/generated/gql';

export const DEALER_QUOTATION_LIST = graphql(`
  query GetDealerQuotations(
    $page: Float
    $limit: Float
    $carId: String
    $dealerId: String
  ) {
    getDealerQuotations(
      page: $page
      limit: $limit
      carId: $carId
      dealerId: $dealerId
    ) {
      message
      success
      data {
        key
        quotations {
          id
          adminDetail {
            firstName
            lastName
            email
          }
          status
          carId
          quotationDetails {
            noOfLeads
            validityDays
            amount
            currency
            expiryDate
            startDate
          }
          car {
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
              createdAt
              updatedAt
            }
          }
        }
      }
      pagination {
        maxPage
        currentPage
        total
        limit
      }
    }
  }
`);
