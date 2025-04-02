import React from 'react';

export default function CounselorRowElementSpecial({ header, details, children, className }: { header: string; details?: string; children?: JSX.Element; className?: string }) {
  return (
    <div className={`flex flex-col ${className} `}>
      <div className="text-primary mb-2 text-base font-medium">{header}</div>
      {details && <div className="text-xss font-normal text-gray-600 uppercase">{details}</div>}
      {children}
    </div>
  );
}