import { gql } from '@apollo/client';

export const SupporterAcceptInvitationMutation = gql`
  mutation SupporterAcceptInvitation(
    $invitationToken: String!
    $supporterFirstName: String!
    $supporterLastName: String!
    $supporterPassword: String!
  ) {
    pretaaHealthSupporterAcceptInvitation(
      invitationToken: $invitationToken
      supporterFirstName: $supporterFirstName
      supporterLastName: $supporterLastName
      supporterPassword: $supporterPassword
    ) {
      id
    }
  }
`;
