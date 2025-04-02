import { gql } from '@apollo/client';

export const getIntegrationConnectorTypes = gql`
  query IntegrationConnectorTypes {
    pretaaListAvailableConnectors
  }
`;