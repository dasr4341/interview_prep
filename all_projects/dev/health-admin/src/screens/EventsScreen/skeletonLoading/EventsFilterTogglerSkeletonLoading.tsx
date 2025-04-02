import { Skeleton } from '@mantine/core';
import React from 'react';

export default function EventsFilterTogglerSkeletonLoading() {
  return (
    <div className=" p-2 m-2 flex-1">
      <Skeleton height={24} />
    </div>
  );
}
