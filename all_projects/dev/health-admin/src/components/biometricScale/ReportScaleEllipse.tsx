import React from 'react';
import './_biometricScale.scoped.scss';


export default function ReportScaleEllipse({
  className
}: {
  className: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className || ''}
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill="none">
      <path
        d="M16.6226 19.8524C12.497 21.8456 7.5368 20.1169 5.54362 15.9913C3.55043 
        11.8657 5.27908 6.90551 9.40467 4.91233C13.5303 2.91914 18.4905 4.64779 20.4837
         8.77337C22.4769 12.899 20.7482 17.8592 16.6226 19.8524Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
    </svg>
  );
}
