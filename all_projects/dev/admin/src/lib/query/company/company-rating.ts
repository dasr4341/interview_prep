import { gql } from '@apollo/client';

export const GetCompanyRatingQuery = gql`
  query GetCompanyRating(
    $companyId: String!
  ) {
    pretaaGetCompanyRating(companyId: $companyId) {
      id
      createdAt
      ratingId
      comment
      rating {
        id
        status
      }
      user {
        firstName
        lastName
        department
      }
    }
  }
`;
