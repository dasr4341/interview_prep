import { gql } from '@apollo/client';

export const getPatientFieldMetaQuery = gql`
query PatientFieldMetaQuery($patientId: String!) {
  pretaaHealthPatientFieldMeta(patientId: $patientId)
}
`;
