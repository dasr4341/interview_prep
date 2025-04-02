import { gql } from '@apollo/client';

export const deleteNote = gql`
  mutation DeleteNote($id: String!) {
    pretaaNoteDelete(id: $id) {
      id
    }
  }
`;
