import { Skeleton } from '@mantine/core';
import React from 'react';

function DetailSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton width={'70%'} height={12} />
      <Skeleton width={'90%'} height={24} mt={6} />
    </div>
  );
}

export default function UserDetailsSkeleton() {
  return (
    <div className="rounded-xl bg-white p-6 border border-border">
      <div className=" grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6 ">
        <DetailSkeleton />
        <DetailSkeleton />
        <DetailSkeleton />
      </div>
      <div className=" grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6 mt-4 ">
        <DetailSkeleton />
        <DetailSkeleton />
      </div>
      <hr className="mt-8 bg-gray-500 mb-4" />
      <div className=" grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6 mt-8">
        <DetailSkeleton />
        <DetailSkeleton />
        <DetailSkeleton />
        <DetailSkeleton />
      </div>
      <div className=" grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6  mt-8">
        <DetailSkeleton />
      </div>
    </div>
  );
}
