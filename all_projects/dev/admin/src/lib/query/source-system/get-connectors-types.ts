import { gql } from '@apollo/client';

export const getSourceConnectorTypesQuery = gql`
  query GetSourceConnectorTypes {
    pretaaListConnectorTypes
  }
`;