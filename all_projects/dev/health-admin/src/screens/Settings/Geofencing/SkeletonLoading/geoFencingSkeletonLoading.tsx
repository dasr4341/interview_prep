import React from 'react';
import _ from 'lodash';
import { Skeleton } from '@mantine/core';

export default function geoFencingSkeletonLoading({
  numberOfRow,
  includeHeader,
  className
}: {
    numberOfRow: number;
    includeHeader?: boolean;
    className?: string
}) {
  return (
    <>
      {includeHeader && <div className="block py-6 px-5 mt-16 border-b relative">
        <div className="grid grid-cols-5 gap-6">
          <Skeleton height={16} width={'20%'} />
          <Skeleton height={16} width={'20%'} />
          <Skeleton height={16} width={'20%'} />
          <Skeleton height={16} width={'20%'} />
          <Skeleton height={16} width={'20%'} />
        </div>
      </div>}
      { 
        _.range(0, numberOfRow).map((item) => (
          <div className={` ${className} block py-6 px-5 border-b border-gray-100 relative bg-white`} key={item}>
            <div className="flex items-center space-x-4">
              <div className="flex justify-between w-full">
                <Skeleton height={16} width={'20%'} mr={24} />
                <Skeleton height={16} width={'20%'} mr={24} />
                <Skeleton height={16} width={'20%'} mr={24} />
                <Skeleton height={16} width={'20%'} mr={24} />
                <Skeleton height={16} width={'20%'} mr={0} />
              </div>
            </div>
          </div>
        ))
      }
    </>
  );
}
