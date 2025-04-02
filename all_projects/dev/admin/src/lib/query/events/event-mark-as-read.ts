import { gql } from '@apollo/client';

export const EventMarkAsReadMutation = gql`
  mutation EventMarkAsRead($id: String!, $where: UserEventsWhereInput) {
  updateReadAtEvent(id: $id) {
    id
    userEvents(where: $where) {
      readAt
      flaggedAt
      hideAt
    }
  }
}
`;