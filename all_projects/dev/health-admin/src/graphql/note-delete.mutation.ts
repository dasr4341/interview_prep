import { gql } from '@apollo/client';

export const noteDelete = gql`
mutation NoteDelete($pretaaHealthNoteDeleteId: String!) {
  pretaaHealthNoteDelete(id: $pretaaHealthNoteDeleteId) {
    deletedAt
  }
}
`;
