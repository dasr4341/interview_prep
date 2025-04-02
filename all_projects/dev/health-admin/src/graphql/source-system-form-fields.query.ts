import { gql } from '@apollo/client';

export const sourceSystemFormFields = gql`
  query PretaaHealthSourceSystemFields($sourceSystemId: String!) {
  pretaaHealthSourceSystemFields(sourceSystemId: $sourceSystemId) {
    createdAt
    deletedAt
    # use id for Register input field
    id
    name
    order
    placeholder
    sourceSystemId
  }
}
`;