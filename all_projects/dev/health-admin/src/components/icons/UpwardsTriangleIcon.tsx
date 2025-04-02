import React from 'react';

export default function UpwardsTriangleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 6 4" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 1L5 3L1 3L3 1Z" fill="#202030" stroke="#202030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
