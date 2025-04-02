import { graphql } from '@/generated/gql';

export const GET_CAR_LIST_VIEWED_BY_USER = graphql(`
  query GetCarListViewedByUser($userId: String!, $page: Float, $limit: Float) {
    getCarListViewedByUser(userId: $userId, page: $page, limit: $limit) {
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
