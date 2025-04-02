import { graphql } from '@/generated/gql';

export const GET_CAR_VIEWERS_LIST = graphql(`
  query GetCarViewers($carId: String!, $page: Float, $limit: Float) {
    getCarViewers(carId: $carId, page: $page, limit: $limit) {
      message
      success
      data {
        ipAddress
        viewsCount
        latestViewedAt
        userAgent
        userId
        user {
          firstName
          lastName
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
