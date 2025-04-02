import { gql } from '@apollo/client';

export const GetRatingQuery = gql`
  query GetRatingDetails($ratingId: String!) {
    pretaaGetRatingDetails(ratingId: $ratingId) {
      id
      userId
      ratingId
      companyId
      comment
      createdAt
      user {
        id
        firstName
        lastName
        department
      }
      rating {
        id
        status
      }
    }
  }
`;
