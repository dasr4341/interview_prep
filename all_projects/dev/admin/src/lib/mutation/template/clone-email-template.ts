import { gql } from '@apollo/client';

export const CloneEmailTemplateMutation = gql`
  mutation CloneEmailTemplate($id: String!) {
    pretaaCloneEmailTemplate(id: $id) {
      id
      text
      title
      creator {
        id
        name
      }
    }
  }
`;
