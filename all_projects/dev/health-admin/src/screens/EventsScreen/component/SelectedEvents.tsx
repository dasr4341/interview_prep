import React from 'react';
import { BsX } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

export default function SelectedEvent({
  label,
  onClick,
}: {
  label: string;
  onClick: (label?: any) => void;
}) {
  const location = useLocation();
  return (
    <button className="flex items-center mr-2 rounded-full bg-gray-350 px-5 py-2 text-xs mb-2.5">
      {label}{' '}
      {!location.pathname.includes('/assessment-stats') && (
        <div onClick={() => onClick(label)}>
          <BsX className="text-xmd" />
        </div>
      )}
    </button>
  );
}
