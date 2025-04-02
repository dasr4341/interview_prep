import React from 'react';
import { SlGraph } from 'react-icons/sl';
import { IconType } from 'react-icons/lib';

const StatsCard = ({
  total,
  subTotal,
  title,
  Icon,
  loading,
}: {
  total: number;
  subTotal: number;
  title: string;
  Icon: IconType;
  loading: boolean;
}) => {
  let totalCount = `${total}`;
  const percentage = total ? (subTotal / total) * 100 : 0;
  if (total >= 1000000) {
    totalCount = `${(total / 1000000).toFixed(2)}M`;
  } else if (total >= 100000) {
    totalCount = `${(total / 100000).toFixed(2)}L`;
  } else if (total >= 1000) {
    totalCount = `${(total / 1000).toFixed(2)}K`;
  }
  return (
    <div className="p-4 w-full bg-white flex flex-col gap-4 rounded-2xl shadow-md">
      <div className="flex flex-row gap-4">
        <div className=" bg-red-50 rounded-full  p-2 flex justify-center items-center">
          <Icon className="text-2xl" />
        </div>
        <div className=" text-gray-700 text-lg">{title}</div>
      </div>
      <div className="flex flex-row justify-between items-center gap-8 ">
        <div className="text-gray-800 text-xl font-bold">{totalCount}</div>
        <div className="flex items-center gap-2 text-xs">
          <div className=" rounded-lg px-2 py-0.5 bg-green-200  text-gray-700 flex flex-row items-center gap-1">
            <SlGraph /> {loading ? '...' : percentage.toFixed(1)}%{' '}
          </div>
          <div className="text-gray-500 ">
            In past seven days {loading ? '...' : subTotal}{' '}
            {title.toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
