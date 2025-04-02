import { gql } from '@apollo/client';

export const getPatientFieldsList = gql`
query getSourceSystemPatientFields {
  pretaaHealthSourceSystemPatientFields
}
`;