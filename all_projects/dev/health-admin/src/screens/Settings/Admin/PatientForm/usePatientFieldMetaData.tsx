import { useLazyQuery } from '@apollo/client';
import { getPatientFieldMetaQuery } from 'graphql/getPatientFieldMeta.query';
import { PatientFieldMetaQuery, PatientFieldMetaQueryVariables } from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import useQueryParams from 'lib/use-queryparams';
import { useEffect, useState } from 'react';

interface PatientMeta {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
  gender: boolean;
  genderIdentity: boolean;
  intakeDate: boolean;
  dischargeDate: boolean;
  dob: boolean;
  primaryTherapist: boolean;
  caseManager: boolean;
  additionalCareTeam: boolean;
  patientContacts: string[];
}

export default function usePatientFieldMetaData() {
  const query = useQueryParams();
  const [patientMetaData, setPatientData] = useState<PatientMeta>();

  const [getPatientFieldMetaData] = useLazyQuery<PatientFieldMetaQuery, PatientFieldMetaQueryVariables>(
    getPatientFieldMetaQuery,
    {
      onCompleted: (d) => {
        setPatientData(d.pretaaHealthPatientFieldMeta);
      },
      onError: (e) => catchError(e, true),
    }
  );

  useEffect(() => {
    if (query.patientId) {
      getPatientFieldMetaData({
        variables: {
          patientId: String(query.patientId),
        },
      });
    }
  }, [query.patientId]);

  return {
    patientMetaData,
  };
}
