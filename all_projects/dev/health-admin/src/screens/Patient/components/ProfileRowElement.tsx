import React from 'react';

export default function ProfileRowElement({ header, details, children, className }: { header: string; details?: string | number; children?: JSX.Element; className?: string }) {
  return (
    <div className={`mb-6 flex flex-col bg-white ${className} `}>
      <div className="text-gray-600 mb-2  text-xss font-medium">{header}</div>
      {details && <div className="text-primary text-base font-normal">{details}</div>}
      {children}
    </div>
  );
}
