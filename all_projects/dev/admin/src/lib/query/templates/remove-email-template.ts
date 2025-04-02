import { gql } from '@apollo/client';

export const RemoveEmailTemplate = gql`
  mutation PretaaDeleteEmailTemplate(
    $id: String!
  ) {
    pretaaDeleteEmailTemplate (
      id: $id
    ) {
      id
    }
  }
`;

