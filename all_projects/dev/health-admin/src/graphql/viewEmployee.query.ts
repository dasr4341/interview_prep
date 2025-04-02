import { gql } from '@apollo/client';

export const patientListQueryByEmployeeId = gql`
  query PatientListByEmployee($employeeId: String!) {
    pretaaHealthViewEmployee(employeeId: $employeeId) {
    employeeMeta {
      patients {
        mobilePhone
        active
        firstName
        email
        id
        lastLoginTime
        lastName
        patientDetails {
          intakeDate
        }
        patientContacts {
          fullName
        }
        createdAt
      }
    }
  }
  }
`;
