import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { getPatientFieldsList } from 'graphql/getSourceSystemPatientFields.query';
import catchError from 'lib/catch-error';
import { getSourceSystemPatientFields } from 'health-generatedTypes';
import { CommonColumnHeaderNames, PatientListHeaderName } from './helper/PatientManagementHelper';

export default function useSourceSystemPatientField() {
  const [agGridHeaderNames, setAgGridHeaderNames] = useState<string[]>([]);

  const [getPatientFieldsLists] = useLazyQuery<getSourceSystemPatientFields>(getPatientFieldsList, {
    onCompleted: (d) => {
      if (d.pretaaHealthSourceSystemPatientFields) {
        const formattedList = d.pretaaHealthSourceSystemPatientFields.map((e) => {
          if (e === 'primaryTherapists') {
            return 'primaryTherapistsCol';
          }
          if (e === 'caseManager') {
            return 'caseManagerCol';
          }
          return e;
        });
        // Create a Set to store unique values
        const uniqueSetOfHeaderNames = new Set([...formattedList, ...CommonColumnHeaderNames]);

        // Convert the Set back to an array
        const uniqueHeaderNameList = Array.from(uniqueSetOfHeaderNames);

        // Filter the uniqueHeaderNameList to include only items that are present in PatientListHeaderName
        const filteredList = uniqueHeaderNameList.filter((e) => PatientListHeaderName.includes(e));
        setAgGridHeaderNames(filteredList);
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    getPatientFieldsLists();
  }, []);

  return {
    agGridHeaderNames,
  };
}
