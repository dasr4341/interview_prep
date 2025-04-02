import { gql } from '@apollo/client';

export const OktaUpdateMutation = gql`
  mutation UpdateOktaClientDetails(
    $apikey: String!
    $domain: String!
    $clientId: String!
  ) {
    pretaaUpdateOktaClientDetails(
      apiKey: $apikey
      domain: $domain
      clientId: $clientId
    ) {
      id
    }
  }
`;
