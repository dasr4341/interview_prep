import React, { ReactNode, createContext, useMemo, useState } from 'react';
import { DynamicField, FacilityKipuLocationArgs } from './lib/FacilityFormHelper';
import { AdminCreateFacility_pretaaHealthAdminCreateFacility_locations } from 'health-generatedTypes';

interface FacilityFormResponse {
  dynamicFieldValue: DynamicField[];
  setDynamicFieldValue: React.Dispatch<React.SetStateAction<DynamicField[]>>;
  facilitiesLocations: AdminCreateFacility_pretaaHealthAdminCreateFacility_locations[] | null;
  setFacilitiesLocation: React.Dispatch<React.SetStateAction<AdminCreateFacility_pretaaHealthAdminCreateFacility_locations[]>>;
  dynamicLocationField: FacilityKipuLocationArgs[] | null;
  setDynamicLocationField: React.Dispatch<React.SetStateAction<FacilityKipuLocationArgs[]>>;
}

const defaultFormContextData: FacilityFormResponse = {
  dynamicFieldValue: [
    {
      id: '',
      value: '',
    },
  ],
  facilitiesLocations: [],
  dynamicLocationField: [],
  setDynamicLocationField: () => { /**/ },
  setDynamicFieldValue: () => {
    /**/
  },
  setFacilitiesLocation: () => { /**/ },

};

export const FacilityFormContextData = createContext<FacilityFormResponse>(defaultFormContextData);

export default function FacilityFormContext({ children }: { children: ReactNode }) {
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [facilitiesLocation, setFacilitiesLocation] = useState<AdminCreateFacility_pretaaHealthAdminCreateFacility_locations[]>([]);
  const [dynamicLocationField, setDynamicLocationField] = useState<FacilityKipuLocationArgs[]>([]);

  return (
    <FacilityFormContextData.Provider
      value={useMemo(() => {
        return {
          dynamicFieldValue: dynamicFields,
          setDynamicFieldValue: setDynamicFields,
          facilitiesLocations: facilitiesLocation,
          setFacilitiesLocation: setFacilitiesLocation,
          dynamicLocationField: dynamicLocationField,
          setDynamicLocationField: setDynamicLocationField
        };
      }, [dynamicFields, dynamicLocationField, facilitiesLocation])}>
      {children}
    </FacilityFormContextData.Provider>
  );
}
