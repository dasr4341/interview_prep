import React, { ReactNode, createContext, useMemo, useState } from 'react';

import { PatientFormFields } from './helper/PatientFormHelper';
interface PatientFormContext {
  patientDetail: PatientFormFields;
  patientContact?: any;
  updatePatientDetail: React.Dispatch<
    React.SetStateAction<PatientFormFields>
  >;
  updatePatientContact: React.Dispatch<React.SetStateAction<any>>;
}
const defaultFormContextData: PatientFormContext = {
  patientDetail: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    genderIdentity: '',
    intakeDate: '',
    dischargeDate: '',
    dob: '',
  },
  updatePatientContact: () => {/**/},
  updatePatientDetail: () => {/**/},
};
export const PatientDetailContext = createContext<PatientFormContext>(
  defaultFormContextData
);

export default function AddPatientContext({
  children,
}: {
  children: ReactNode;
}) {
  const [PatientDetailsData, setPatientDetailsData] =
    useState<PatientFormFields>({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      genderIdentity: '',
      intakeDate: '',
      dischargeDate: '',
      dob: '',
    });
  const [PatientContactData, setPatientContactData] = useState<any>({});

  return (
    <PatientDetailContext.Provider
      value={useMemo(() => {
        return {
          patientDetail: PatientDetailsData,
          updatePatientDetail: setPatientDetailsData,
          patientContact: PatientContactData,
          updatePatientContact: setPatientContactData,
        };
      }, [
        PatientDetailsData,
        PatientContactData,
      ])}>
      {children}
    </PatientDetailContext.Provider>
  );
}
