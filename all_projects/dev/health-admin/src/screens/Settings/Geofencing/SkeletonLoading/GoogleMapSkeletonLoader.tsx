import React from 'react';
import './_googleMapSkeletonLoader.scoped.scss';

export default function GoogleMapSkeletonLoader({ displayText, className }: { displayText?: string, className?: string }) {
  return (
    <div className={`custom-overlay flex justify-center text-white items-center w-full h-full ${className}`}>
      <div className=" rounded p-4 tracking-wide ">
        <span>{!!displayText?.length ? displayText : 'Loading, please wait ...'}</span>
      </div>
    </div>
  );
}
