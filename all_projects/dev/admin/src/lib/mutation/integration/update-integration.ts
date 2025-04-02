import { gql } from '@apollo/client';

export const updateConnectorMutation = gql`
  mutation UpdateConnector(
    $updateUrl: String!,
    $connectorAuthData: [PretaaConnectorFormFieldInput!]!
  ) {
    pretaaUpdateConnector(
      updateUrl: $updateUrl, 
      connectorAuthData: $connectorAuthData
    )
  }
`;
