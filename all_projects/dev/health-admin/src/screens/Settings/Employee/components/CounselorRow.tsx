import React from 'react';

export default function CounselorRow({ children, className }: { children: JSX.Element, className?:string }) {
  return <div className={`grid grid-cols-1 gap-5 md:gap-0 md:grid-cols-3 ${className}`}>{children}</div>;
}
