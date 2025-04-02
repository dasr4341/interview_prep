import React from 'react';

export default function JsonIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none" className={className || ''}>
      <path
        d="M14.7708 12H16.2083C17.2669 12 18.125 11.1046 18.125 10V3C18.125 1.89543 17.2669 1 
        16.2083 1H9.5C8.44145 1 7.58333 1.89543 7.58333 3V4.5M2.79167 19H9.5C10.5585 19 11.4167 18.1046 11.4167 
        17V10C11.4167 8.89543 10.5585 8 9.5 8H2.79167C1.73312 8 0.875 8.89543 0.875 10V17C0.875 18.1046 1.73312 19 2.79167 19Z"
        stroke="#8585A1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
