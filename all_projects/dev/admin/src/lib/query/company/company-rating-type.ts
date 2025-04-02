import { gql } from '@apollo/client';

export const CompanyRatingTypeQuery = gql`
  query CompanyRatingTypeQuery {
    pretaaGetRatingTypes {
      id
      status
    }
  }
`;

export default CompanyRatingTypeQuery;
