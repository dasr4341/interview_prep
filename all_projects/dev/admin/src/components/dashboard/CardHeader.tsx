import React, { ReactNode } from 'react';

export default function CardHeader({ leftText, children } : { leftText: string, children?: ReactNode }) {
  return (
    <div className="flex flex-row justify-between
     font-medium text-gray-600">
      <span className="text-base">
        {leftText}
      </span>
      {children &&
      <div className="flex items-center space-x-2 text-xs">
        {children}
      </div>
      }
    </div>
  );
}
