import { gql } from '@apollo/client';

export const patientVisibilityMutation = gql`
  mutation TogglePatientsVisibility($selectAll: Boolean!, $patientsId: [String!]!, $hidden: Boolean!) {
    pretaaHealthTogglePatientsVisibility(selectAll: $selectAll, patientsId: $patientsId, hidden: $hidden)
  }
`;
