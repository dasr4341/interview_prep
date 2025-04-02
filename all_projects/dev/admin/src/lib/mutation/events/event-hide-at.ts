import { gql } from '@apollo/client';

export const hideUserEventMutation = gql`
  mutation HideUserEventMutation(
    $id: String!
    $where: UserEventsWhereInput
  ) {
    hideUserEvent(id: $id) {
      id
      userEvents(where: $where) {
        hideAt
      }
    }
  }
`;