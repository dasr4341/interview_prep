import React, { ReactNode } from 'react';
import './_patient-details.scoped.scss';

export default function PatientDetailsRowElement({ title, content, children }: { title: string; content?: string | ReactNode; children?: JSX.Element }) {
  return (
    <div className='flex items-center'>
      <div className="flex flex-col">
        <div className=" font-medium row-title text-gray-600">{title}</div>
        <div className="font-normal text-base mt-1 text-primary">{content}</div>
      </div>
      {children && <div className='ml-4'>{children}</div>}
   </div>
  );
}
