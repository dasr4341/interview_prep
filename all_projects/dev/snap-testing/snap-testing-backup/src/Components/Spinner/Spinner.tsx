import React from 'react';
import './SpinnerStyle.scss';

export default function Spinner({ className }: { className?: string }) {
  return (
    <>
      <svg className={`${className} spinner`} viewBox='0 0 50 50'>
        <circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth='5'></circle>
      </svg>
    </>
  );
}
