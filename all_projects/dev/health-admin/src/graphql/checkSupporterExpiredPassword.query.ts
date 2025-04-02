import { gql } from '@apollo/client';

export const CheckSupporterExpiredPassword = gql`
  query CheckSupporterExpiredLink($invitationToken: String!) {
    pretaaHealthCheckSupporterExpiredLink(invitationToken: $invitationToken) {
      email
    }
  }
`;