import React from 'react';

export default function ReloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className || ''}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none">
      <path
        d="M1.5 1.5V6.5M1.5 6.5H6.5M1.5 6.5L3.70024 4.52556C4.85108 
        3.37674 6.34413 2.63303 7.95444 2.40649C9.56474 2.17995 11.2051 2.48284 12.6282 
        3.26953C14.0514 4.05622 15.1803 5.28409 15.8449 6.76814M16.5 16.5V11.5M16.5 11.5L11.5 
        11.5M16.5 11.5L14.2997 13.4745C13.1489 14.6233 11.6558 15.367 10.0455 15.5935C8.43524 
        15.8201 6.79492 15.5172 5.37174 14.7305C3.94857 13.9438 2.81963 12.7159 2.15503 11.2319"
        stroke="#3B7AF7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
