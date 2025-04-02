import { Skeleton } from '@mantine/core';
import React from 'react';

export default function PatientContactSkeletonLoading() {
  return (
    <div className="flex flex-col">
      <div className="block py-6 px-5 border-b border-gray-100 relative bg-white">
          <div className="flex items-center space-x-4">
            <Skeleton radius="xl" height={56} width={64} mr={24} />
            <div className="block w-full">
              <Skeleton height={16} mr={24} width={'33%'} />
              <Skeleton height={16} mr={24} mt={8} width={'20%'} />
            </div>
          </div>
        </div>
    </div>
  );
}
