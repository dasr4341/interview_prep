import { gql } from '@apollo/client';

export const addCompanyRatingsMutation = gql`
  mutation PretaaAddCompanyRatingsMutation(
  $pretaaAddCompanyRatingsRatingId: Int!
  $pretaaAddCompanyRatingsCompanyId: String!
  $pretaaAddCompanyRatingsComment: String!
) {
  pretaaAddCompanyRatings(
    ratingId: $pretaaAddCompanyRatingsRatingId
    companyId: $pretaaAddCompanyRatingsCompanyId
    comment: $pretaaAddCompanyRatingsComment
  ) {
    id
    ratingId
    comment
  }
}`;
