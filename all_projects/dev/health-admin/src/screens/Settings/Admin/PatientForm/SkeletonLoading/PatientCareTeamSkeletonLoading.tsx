import React from 'react';

import { Skeleton } from '@mantine/core';
import DeleteIcon from 'components/icons/DeleteIcon';

export default function PatientCareTeamSkeletonLoading() {
  return (
    <div className="flex flex-col mt-8">
      <div className="flex justify-between py-3 border-b border-gray-300">
        <Skeleton
          height={24}
          width={96}
        />
        <div className="flex gap-3">
          <Skeleton
            height={24}
            width={96}
          />
          <DeleteIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>
      <div className="flex justify-between py-3 border-b border-gray-300">
        <Skeleton
          height={24}
          width={96}
        />
        <div className="flex gap-3">
          <Skeleton
            height={24}
            width={96}
          />
          <DeleteIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
