import { gql } from '@apollo/client';

export const clientSendInvitation = gql`
 mutation AdminInviteSuperAdmin(
  $accountId: String!
  $email: String!
  $firstName: String
  $lastName: String
) {
  pretaaHealthAdminInviteSuperAdmin(
    accountId: $accountId
    email: $email
    firstName: $firstName
    lastName: $lastName
  )
}
`;
