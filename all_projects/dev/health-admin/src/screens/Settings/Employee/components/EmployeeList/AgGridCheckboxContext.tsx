import React, { ReactNode, createContext, useMemo, useState } from 'react';

interface AgGridCheckboxData {
filterData: string[];
setFilterData: React.Dispatch<React.SetStateAction<string[]>>;
isFilterChanged?: boolean;
setIsFilterChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultFormContextData: AgGridCheckboxData = {
 filterData: [],
 setFilterData: () =>  [],
 isFilterChanged: false,
 setIsFilterChanged: () => {}
};

export const AgGridCheckboxContextData = createContext<AgGridCheckboxData>(
  defaultFormContextData
);

export default function AgGridCheckboxContext({
  children,
}: {
  children: ReactNode;
}) {
  const [filterData, setFilterData] = useState<string[]>([]);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  return (
    <AgGridCheckboxContextData.Provider
    value={useMemo(() => {
      return {
      filterData: filterData,
      setFilterData: setFilterData,
      isFilterChanged: isFilterChanged,
      setIsFilterChanged: setIsFilterChanged
      };
    }, [filterData, isFilterChanged])}>
    {children}
  </AgGridCheckboxContextData.Provider>
  );
}
