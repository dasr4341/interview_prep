/* eslint-disable max-len */
import React from 'react';

export default function SublistIcon({ className }: { className?: string }) {
  return (
    <>
      <svg
        className={className}
        width="21"
        height="18"
        viewBox="0 0 21 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect
          x="1.5"
          y="0.75"
          width="18"
          height="1.5"
          rx="0.75"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="8.25"
          width="4.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="15.75"
          width="4.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line x1="5.75" y1="3" x2="5.75" y2="16.5" stroke="currentColor" />
        <line x1="12.75" y1="9.5" x2="5.25" y2="9.5" stroke="currentColor" />
        <line x1="12.75" y1="17" x2="5.25" y2="17" stroke="currentColor" />
      </svg>
    </>
  );
}
