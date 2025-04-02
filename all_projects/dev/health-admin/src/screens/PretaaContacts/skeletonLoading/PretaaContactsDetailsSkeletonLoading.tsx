import { Skeleton } from '@mantine/core';
import React from 'react';

export default function PretaaContactsDetailsSkeletonLoading() {
  return (
    <div>
      <Skeleton height={80} />
      <Skeleton height={128} mt={32} />
    </div>
  );
}
