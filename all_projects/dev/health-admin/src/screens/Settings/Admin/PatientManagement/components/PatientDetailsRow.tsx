import React from 'react';
import './_patient-details.scoped.scss';

export default function PatientDetailsRow({ children }: { children: JSX.Element }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 md:gap-0 gap-4 mt-10 row">{children}</div>;
}
