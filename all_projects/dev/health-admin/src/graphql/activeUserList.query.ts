import { gql } from '@apollo/client';

/**
 * Role: Pretaa Admin
 * Feature  Get Active User list for billing 
 */
export const getActiveUser = gql`
  query AdminActiveUserList($facilityId: String!, $startDate: DateTime!, $endDate: DateTime!) {
    pretaaHealthAdminActiveUserList(facilityId: $facilityId, startDate: $startDate, endDate: $endDate) {
      id
      fullName
      email
      numberOfReports
      numberOfAssesmentCompleted
    }
  }
`;