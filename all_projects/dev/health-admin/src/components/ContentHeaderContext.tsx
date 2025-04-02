import React, { ReactNode, createContext, useMemo, useState } from 'react';

interface HeaderDataType {
  headerHeight: number;
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
}

const defaultFormContextData: HeaderDataType = {
 headerHeight: 0,
 setHeaderHeight: () => {/**/}
};

export const HeaderContext = createContext<HeaderDataType>(
  defaultFormContextData
);

export default function ContentHeaderContext({
  children,
}: {
  children: ReactNode;
}) {
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  return (
    <HeaderContext.Provider
      value={useMemo(() => {
        return {
         headerHeight: headerHeight,
         setHeaderHeight: setHeaderHeight
         
        };
      }, [headerHeight])}>
      {children}
    </HeaderContext.Provider>
  );
}
