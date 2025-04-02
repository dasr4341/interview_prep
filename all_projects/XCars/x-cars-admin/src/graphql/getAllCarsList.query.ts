import { graphql } from '@/generated/gql';

export const GET_ALL_CARS = graphql(`
  query GetCarsAdmin(
    $page: Float
    $limit: Float
    $searchString: String
    $filter: [CarsFilterInput!]
    $suggestedColumn: String
  ) {
    getCarsAdmin(
      page: $page
      limit: $limit
      searchString: $searchString
      filter: $filter
      suggestedColumn: $suggestedColumn
    ) {
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
          createdAt
          updatedAt
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
