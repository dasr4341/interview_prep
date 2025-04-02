import { graphql } from '@/generated/gql';

export const DEALERS_LIST = graphql(`
  query ViewAllDealers(
    $dealerFilter: [UserFilterInput!]
    $limit: Float
    $page: Float
  ) {
    viewAllDealers(dealerFilter: $dealerFilter, limit: $limit, page: $page) {
      message
      success
      data {
        id
        firstName
        lastName
        companyName
        location
        status
        email
        phoneNumber
        totalCars
        totalActiveQuotation
        totalPendingQuotation
        documents {
          fileType
          docs {
            id
            fileName
            path
            amount
            currency
            thumbnail
            createdAt
            updatedAt
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
