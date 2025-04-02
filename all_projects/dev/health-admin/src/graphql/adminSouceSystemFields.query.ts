import { gql } from '@apollo/client';

export const adminSourceSystemFormFields = gql`
query AdminSourceSystemFields($sourceSystemId: String!) {
  pretaaHealthAdminSourceSystemFields(sourceSystemId: $sourceSystemId) {
    id
    name
    placeholder
    order
    sourceSystemId
    createdAt
    deletedAt
  }
}
`;