import { gql } from '@apollo/client';

export const bulkInvitePatientsMutation = gql`
  mutation BulkInvitePatients($emails: [String!]!, $facilityId: String) {
    pretaaHealthBulkInvitePatients(emails: $emails, facilityId: $facilityId) {
      invalidEmails
      registeredEmails
    }
  }
`;
