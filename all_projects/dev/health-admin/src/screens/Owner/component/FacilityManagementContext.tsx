import React, { ReactNode, createContext, useMemo, useState } from 'react';

interface FacilityManagementData {
  startDate: Date | string | null;
  endDate: Date | string | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | string | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | string |  null>>;
}

const defaultContextData: FacilityManagementData = {
  startDate: '',
  setStartDate: () => {},
  endDate: '',
  setEndDate: () => {},
};

export const FacilityManagementContextData = createContext<FacilityManagementData>(defaultContextData);

export default function FacilityManagementContext({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState<Date | string | null>(null);
  const [endDate, setEndDate] = useState<Date | string | null>(null);
  return (
    <FacilityManagementContextData.Provider
      value={useMemo(() => {
        return {
          startDate: startDate,
          setStartDate: setStartDate,
          endDate: endDate,
          setEndDate: setEndDate,
        };
      }, [startDate, endDate])}>
      {children}
    </FacilityManagementContextData.Provider>
  );
}
