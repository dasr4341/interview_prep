import React from 'react';
import './_countingcolumn.scoped.scss';

export default function CountingColumn({
  className,
  num,
  unit,
  currency,
  label,
}: {
  className?: string;
  num: number;
  unit?: string;
  currency?: string;
  label?: string;
}) {
  return (
    <div
      className={`flex flex-col mt-4
        md:border-l md:border-gray-600 first:border-0 first:border-l-0
        md:pl-6 first:pl-0 column-num ${className}`}>
      <div>
        <sup className="font-bold text-base text-gray-150">{currency ? currency : '$'}</sup>
        <span className="font-bold text-md text-gray-150 pl-1">{num}</span>
        <sub className="font-bold text-base text-gray-150 unit">{unit ? unit : 'K'}</sub>
      </div>
      <div className="text-sm text-gray-600 text-label">{label ? label : 'Stage'}</div>
    </div>
  );
}
