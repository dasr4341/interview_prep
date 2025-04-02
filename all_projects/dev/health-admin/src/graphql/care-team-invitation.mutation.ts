import { gql } from '@apollo/client';

export const careTeamInvitation = gql`
  mutation InviteCareTeams($careTeamMembers: [String!]!) {
  pretaaHealthInviteCareTeams(careTeamMembers: $careTeamMembers)
}
`;
