import React, { ReactNode, createContext, useMemo, useState } from 'react';

interface PretaaContactContextData {
  deleteContactId: string;
  setDeleteContactId: React.Dispatch<React.SetStateAction<string>>;
  contactType: string;
  setContactType: React.Dispatch<React.SetStateAction<string>>;
}

export const PretaaContactContext = createContext<PretaaContactContextData>({
  deleteContactId: '',
  setDeleteContactId: () => {/**/},
  contactType: '',
  setContactType: () => {/**/}
});

export default function PretaaContactContextList({
  children,
}: {
  children: ReactNode;
}) {
  const [deleteId, setDeleteId] = useState('');
  const [contactTypes, setContactTypes] = useState('');

  return (
    <PretaaContactContext.Provider
      value={useMemo(() => {
        return {
          deleteContactId: deleteId,
          setDeleteContactId: setDeleteId,
          contactType: contactTypes,
          setContactType: setContactTypes
        };
      }, [deleteId, contactTypes])}>
      {children}
    </PretaaContactContext.Provider>
  );
}
