import React, { FC, ReactNode } from 'react';

interface IDealerAnalyticsCard {
  icon: ReactNode;
  data?: number | string;
  name?: string | number;
  info?: string;
  className?: string;
  dataClassName?: string;
  nameClassName?: string;
  containerClasses?: string;
}

const AnalyticsCard: FC<IDealerAnalyticsCard> = ({
  icon,
  data,
  name,
  className,
  dataClassName,
  nameClassName,
  containerClasses,
}) => {
  return (
    <div
      className={`px-2 py-4 rounded-2xl font-bold shadow-md flex gap-2 items-center justify-center ${containerClasses} `}
    >
      <div className={`${className} text-gray-900 p-4 rounded-full`}>
        {icon}
      </div>
      <div
        className={`capitalize ${dataClassName ? dataClassName : 'text-xl'}`}
      >
        {data && <>{data}</>}
        <div
          className={`${nameClassName ? nameClassName : 'text-gray-800 text-sm'} font-normal capitalize tracking-wide`}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
