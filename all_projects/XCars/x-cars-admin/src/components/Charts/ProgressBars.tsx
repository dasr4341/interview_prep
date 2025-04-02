import React from 'react';
import { Progress } from '@mantine/core';
import { SalesDetails } from '@/generated/graphql';

const ProgessBars = ({ chartData }: { chartData: SalesDetails[] }) => {
  const totalValue = chartData.reduce(
    (acc: number, item: { count: number }) => acc + item.count,
    0
  );
  return (
    <>
      {chartData.map((data, index) => {
        const percentage = ((data.count / totalValue) * 100).toFixed(2);
        return (
          <div key={index} className=" flex flex-col gap-1 w-full">
            <div className=" flex w-full justify-between font-semibold text-sm text-gray-600">
              <span>{data.fileType}</span> <span>{percentage}%</span>
            </div>
            <Progress
              color="#1114ef"
              radius="lg"
              value={Number(percentage)}
              striped
            />
          </div>
        );
      })}
    </>
  );
};

export default ProgessBars;
