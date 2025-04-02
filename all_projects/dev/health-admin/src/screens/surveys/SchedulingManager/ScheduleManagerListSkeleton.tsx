import React from 'react';
import _ from 'lodash';
import { Skeleton } from '@mantine/core';

export default function ScheduleManagerListSkeleton({
  numberOfRow,
  includeHeader,
  className
}: {
  numberOfRow: number;
  includeHeader?: boolean;
  className?: string;
}) {
  return (
    <>
      {includeHeader && (
        <div className="block py-0 px-5 border-b relative">
          <div className="grid grid-cols-4 pb-5">
            <Skeleton height={16} width={'33%'} className='col-span-2' />
            <Skeleton height={16} width={'33%'} />
            <Skeleton height={16} width={'33%'} />
          </div>
        </div>
      )}
      {_.range(0, numberOfRow).map((item) => (
        <div className={`block py-6 px-5 border-b border-gray-100 bg-white ${className}`} key={item}>
          <div className="grid grid-cols-4 py-1 relative">
            <div className="col-span-2">
              <Skeleton height={16} width={'33%'} />
              <Skeleton height={12} width={'20%'} mt={12} />
            </div>
            <Skeleton height={16} width={'20%'} />
            <Skeleton height={16} width={'20%'} />
            <Skeleton height={16} width={32} radius={'xl'} className='absolute right-8' />
          </div>
        </div>
      ))}
    </>
  );
}
