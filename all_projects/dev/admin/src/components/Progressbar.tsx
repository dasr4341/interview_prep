import React from 'react';

export default function ProgressBar({
  className,
  percentage,
  text,
  color
}: {
  className?: string;
  percentage: number;
  text?: string;
  color?: string;
}) {

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex flex-row justify-between text-gray-150 items-center">
        <span className="text-sm font-medium">{text}</span>
        <span className="flex flex-row font-extrabold gap-1">
          <h3 className="text-lg">
            {percentage.toString()}
          </h3>
          <span className="text-base pt-1">%</span>
        </span>
      </div>
      <div className="bg-gray-350 rounded-lg w-full h-5">
        <div className={`${color} h-5 rounded-lg`}
          style={{ width: percentage.toString() + '%' }}>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-2">
        <span></span>
        <span className="text-gray-350 font-medium text-sm">
          {100 - percentage}%
        </span>
      </div>
    </div>

  );
}
