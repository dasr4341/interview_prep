import { gql } from '@apollo/client';

export const supporterContactDetailsQuery = gql`
  query SupporterContactDetails($supporterId: String!) {
    pretaaHealthSupporterDetails(supporterId: $supporterId) {
      email
      firstName
      lastName
      mobilePhone
    }
  }
`;
