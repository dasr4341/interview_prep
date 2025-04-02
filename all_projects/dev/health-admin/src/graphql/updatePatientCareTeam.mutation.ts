import { gql } from '@apollo/client';

export const updatePatientCareTeamMutationQuery =  gql`
mutation updatePatientCareTeamMutation(
  $selectedId: String!
  $patientId: String!
  $selectedType: CareTeamTypes!
) {
  pretaaHealthPatientCareTeamUpdateFromPatientManagement(
    selectedId: $selectedId
    patientId: $patientId
    selectedType: $selectedType
  )
}

`;