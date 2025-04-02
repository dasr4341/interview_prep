import React from 'react';

export default function MapIcon({ className }: { className?: string }) {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none" className={className || ''}>
        <path
          d="M6.5 3.16667L1.5 1.5V14.8333L6.5 16.5M6.5 3.16667L11.5
 1.5M6.5 3.16667V16.5M11.5 1.5L16.5 3.16667V16.5L11.5 14.8333M11.5 1.5V14.8333M11.5
 14.8333L6.5 16.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
