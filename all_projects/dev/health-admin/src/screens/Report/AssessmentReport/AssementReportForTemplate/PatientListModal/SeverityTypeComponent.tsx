import React from 'react';

export default function SeverityTypeComponent({
  value,
  description
}: {
  value: string;
  description: string;
}) {
  return (
    <div>
      <div className="text-base mt-2">{value}</div>
      <div className="font-medium text-xss text-gray-600 pb-3">
       {description}
      </div>
    </div>
  );
}
