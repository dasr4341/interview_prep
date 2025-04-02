import { gql } from '@apollo/client';

/**
 * Role: pretaa admin 
 * if location available then all payload sends with this request and created multiple facilities 
 */
export const pretaaAdminCreateFacilityForEMR = gql`
  mutation AdminCreateFacilityForEMR(
    $accountId: String!
    $dynamicFields: [SourceSystemFieldInput!]!
    $sourceSystemId: String!
    $locations: [AdminFacilityKipuLocationArgs!]
  ) {
    pretaaHealthAdminCreateFacilityForEmr(
      accountId: $accountId
      dynamicFields: $dynamicFields
      sourceSystemId: $sourceSystemId
      locations: $locations
    )
  }
`;
