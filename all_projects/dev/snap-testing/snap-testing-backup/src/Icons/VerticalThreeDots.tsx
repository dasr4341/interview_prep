import React from 'react';

export default function VerticalThreeDots({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      className={className || ''}
      preserveAspectRatio='xMidYMid meet'
      viewBox='0 0 256 256'>
      <path
        fill='currentColor'
        d='M140 192a12 12 0 1 1-12-12a12 12 0 0 1 12 12ZM128 76a12 12 0 1 0-12-12a12 12 0 0 0 12 12Zm0 40a12 12 0 1 0 12 12a12 12 0 0 0-12-12Z'
      />
    </svg>
  );
}
