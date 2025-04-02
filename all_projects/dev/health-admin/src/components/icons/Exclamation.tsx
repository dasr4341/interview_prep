import React from 'react';

export default function Exclamation({ className }: { className ?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 34 34"
      className={className || ''}
      fill="none">
      <path
        d="M17 25.3333L17 13.6667M17 8.68327V8.66662M32 17C32 25.2843 25.2843 32 17 32C8.71573 32 2 25.2843 2 17C2 8.71573 8.71573 2 17 2C25.2843 2 32 8.71573 32 17Z"
        stroke="#3B7AF7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
