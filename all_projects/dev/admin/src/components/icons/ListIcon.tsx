/* eslint-disable max-len */
import React from 'react';

export default function ListIcon({ className }: { className?: string }) {
  return (
    <>
      <svg
        className={className}
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="2" rx="1" fill="currentColor" />
        <rect y="5" width="16" height="2" rx="1" fill="currentColor" />
        <rect y="10" width="16" height="2" rx="1" fill="currentColor" />
      </svg>
    </>
  );
}
