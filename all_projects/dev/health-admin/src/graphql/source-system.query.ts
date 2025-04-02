import { gql } from '@apollo/client';

export const sourceSystem = gql`
query PretaaHealthSourceSystems {
  pretaaHealthSourceSystems {
    createdAt
    id
    name
    slug
  }
}
`;
