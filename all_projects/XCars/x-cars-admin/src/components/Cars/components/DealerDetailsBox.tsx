import { User } from '@/generated/graphql';
import React from 'react';
import InfoTag from './Infotag';

export const DealerDetailsBox = ({
  data,
  className,
}: {
  data?: User;
  className: string;
}) => {
  return (
    <div
      className={`" flex justify-between flex-col gap-8 shadow-md rounded-lg p-2 md:p-5 bg-white text-gray-700 " ${className}`}
    >
      <div className=" flex flex-col font-bold text-blue-800 ">
        <span className=" text-xl">
          {`${data?.firstName} ${data?.lastName?.length ? data?.lastName : ''} `}
        </span>
        <span className=" font-medium tracking-wider my-1 text-sm text-gray-500">
          {`${data?.phoneNumber || ''}${data?.email ? ' / ' + data?.email : ''}`}
        </span>
      </div>

      <div className=" flex flex-wrap gap-2 ">
        {data?.companyName && (
          <InfoTag label="Company Name" value={`${data?.companyName}`} />
        )}
        {data?.location && (
          <InfoTag label="Address" value={`${data?.location}`} />
        )}
      </div>
    </div>
  );
};
