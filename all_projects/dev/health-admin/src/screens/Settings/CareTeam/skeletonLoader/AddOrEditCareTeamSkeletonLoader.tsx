import { Skeleton } from '@mantine/core';
import React from 'react';

export default function AddOrEditCareTeamSkeletonLoader() {
  return (
    <section className=' lg:w-8/12 xl:w-1/2 2xl:w-1/3 space-y-6'>
      <div>
        <label className=" text-xsm font-normal text-gray-750 mb-2">
          First Name
        </label>
        <Skeleton height={48} mt={8} />
      </div>

      <div>
        <label className=" text-xsm font-normal text-gray-750 mb-2">
          Last Name
        </label>
        <Skeleton height={48} mt={8} />
      </div>

      <div>
        <label className=" text-xsm font-normal text-gray-750 mb-2">
          Email
        </label>
        <Skeleton height={48} mt={8} />
      </div>

      <div>
        <label className=" text-xsm font-normal text-gray-750 mb-2">
          Phone Number
        </label>
        <Skeleton height={48} mt={8} />
      </div>
      <div className=' flex flex-row space-x-6'>
        <Skeleton height={24} width={96} mt={8} />
        <Skeleton height={24} width={96} mt={8} />
        <Skeleton height={24} width={96} mt={8} />
      </div>
        <Skeleton height={48}/>
    </section>
  );
}
