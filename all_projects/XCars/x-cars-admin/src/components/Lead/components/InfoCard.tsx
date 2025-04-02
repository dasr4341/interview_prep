import React from 'react';

const InfoCard = ({
  label,
  value,
  isTag,
}: {
  label: string;
  value: string | number | undefined | null;
  isTag?: boolean;
}) => (
  <>
    {value ? (
      <div className="flex col-span-1 flex-col justify-start">
        <div className="text-gray-600 text-sm capitalize ">{label}</div>
        <div
          className={`text-gray-700 font-semibold ${isTag ? 'text-xs mt-1 py-1 px-2 border border-blue-500 text-blue-500 rounded-md' : ''}`}
        >
          {value}
        </div>
      </div>
    ) : (
      <></>
    )}
  </>
);

export default InfoCard;
