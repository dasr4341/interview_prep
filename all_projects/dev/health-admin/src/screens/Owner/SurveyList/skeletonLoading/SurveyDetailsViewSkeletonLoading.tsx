import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SurveyDetailsViewSkeletonLoading() {
  return (
    <div className="pt-8  grid md:grid-cols-1 flex-1 grid-cols-1 gap-2 md:text-left gap-y-8">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-y-4 md:gap-x-6">
        <div className="flex flex-col">
          <div className="font-normal text-xsm text-pt-gray-600 pb-3">Name</div>
          <Skeleton height={32} />
        </div>

        <div className="flex flex-col">
          <div className="font-normal text-xsm text-pt-gray-600 pb-3">Description</div>
          <Skeleton height={32} />
        </div>

        <div className="flex flex-col">
          <div className="font-normal text-xsm text-pt-gray-600 pb-3">Code</div>
          <Skeleton height={32} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="font-normal text-xsm text-pt-gray-600 pb-3">Title:</div>
        <Skeleton height={32} />
      </div>

      <div className="flex flex-col pl-4"></div>

      <div className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <div className="font-normal text-xsm text-pt-gray-600 pb-3">Created on:</div>
          <Skeleton height={32} />
        </div>
        <div className="flex flex-col">
          <div className="font-normal text-xsm text-pt-gray-600 pb-3">updated on:</div>
          <Skeleton height={32} />
        </div>
      </div>
    </div>
  );
}
