import { gql } from '@apollo/client';

export const EventToggleFlagMutation = gql`
  mutation EventToggleFlag($id: String!, $where: UserEventsWhereInput) {
  flagUserEvent(id: $id) {
    id
    needsAttention
    userEvents(where: $where) {
      flaggedAt
      readAt
      hideAt
    }
  }
}
`;