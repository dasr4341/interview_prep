import { gql } from '@apollo/client';

export const updateEmployeeStatus = gql`
  mutation EmployeeActiveToggle($empDetailId: String!) {
    pretaaHealthEmployeeActiveToggle(empDetailId: $empDetailId)
  }
`;
