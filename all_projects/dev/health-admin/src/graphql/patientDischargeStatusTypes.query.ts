import { gql } from '@apollo/client';

export const patientDischargeStatusQuery =  gql`query PatientDischargeStatusTypes {
    pretaaHealthsPatientDischargeStatusTypes
  }`;