import React from 'react';

export default function CounselorRow4({ children, className }: { children: JSX.Element, className?:string }) {
  return <div className={`grid grid-cols-2 gap-2 md:gap-0 md:grid-cols-4 ${className}`}>{children}</div>;
}