import React from 'react';

export default function CircleCloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 21 21"
      className={className || ''}>
      <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)">
        <circle cx="8.5" cy="8.5" r="8" />
        <path d="m5.5 5.5l6 6m0-6l-6 6" />
      </g>
    </svg>
  );
}
