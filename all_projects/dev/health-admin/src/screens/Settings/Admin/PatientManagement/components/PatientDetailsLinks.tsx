import React from 'react';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';

export default function PatientDetailsLinks({ title, extra, className }: { title: string; extra?: string; className?: string; }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${className}`}>
      <div className="font-normal text-base text-primary">
        {title} <span className="text-orange"> {extra}</span>
      </div>
      <div>
        <DisclosureIcon />
      </div>
    </div>
  );
}
