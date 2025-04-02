import { useLazyQuery } from '@apollo/client';
import { patientDetailsQuery } from 'graphql/patientDetails.query';
import {
  PatientDetails,
  PatientDetailsVariables,
  PatientDetails_pretaaHealthPatientDetails,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface PatientDetailsStateInterface {
  data?: PatientDetails_pretaaHealthPatientDetails;
}

export default function useGetPatientDetails(patientId?: string) {
  const { id } = useParams();
  const [patientDetailsState, setPatientDetailsState] = useState<PatientDetailsStateInterface>();
  const [callApi, { loading }] = useLazyQuery<PatientDetails, PatientDetailsVariables>(patientDetailsQuery, {
    onCompleted: (d) => {
      setPatientDetailsState({ data: d.pretaaHealthPatientDetails });
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    if (patientId || id) {
      callApi({
        variables: {
          patientId: patientId ? patientId : String(id),
        },
      });
    }
  }, [patientId, id]);

  return {
    loading,
    patientDetailsState,
  };
}
