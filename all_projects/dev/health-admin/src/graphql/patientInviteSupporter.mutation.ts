import { gql } from '@apollo/client';

export const patientInviteSupporterMutation = gql`
  mutation SubmitSupporterByPatient($email: String!, $invitationType: InvitationTypes!) {
    pretaaHealthSubmitSupporterByPatient(email: $email, invitationType: $invitationType)
  }
`;
