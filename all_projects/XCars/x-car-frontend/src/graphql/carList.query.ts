import { graphql } from '@/generated/gql';

export const CAR_LIST_QUERY = graphql(`
  query GetCarsUser(
    $page: Float
    $limit: Float
    $searchString: String
    $filter: [CarsFilterInput!]
    $suggestedColumn: String
  ) {
    getCarsUser(
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
        gallery {
          id
          fileType
          thumbnail
          createdAt
          updatedAt
          documents {
            documentType
            fileName
            id
            path
          }
        }
        lead
        userId
        updatedAt
        createdAt
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
