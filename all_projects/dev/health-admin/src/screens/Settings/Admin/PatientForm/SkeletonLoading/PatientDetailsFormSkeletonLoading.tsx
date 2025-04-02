import { Skeleton } from '@mantine/core';
import React from 'react';

export default function PatientDetailsFormSkeletonLoading() {
  return (
    <>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2"> First Name</label>
        <Skeleton height={48} />
      </div>

      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2"> Last Name</label>
        <Skeleton height={48} />
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2">Email</label>
        <Skeleton height={48} />
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2">Phone Number</label>
        <Skeleton height={48} />
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2">Gender</label>
        <Skeleton height={48} />
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2">Gender Identity</label>
        <Skeleton height={48} />
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2">Intake date</label>
        <Skeleton height={48} />
      </div>
      <div className="flex flex-col w-full">
        <label className=" text-xsm font-normal text-gray-750 mb-2">Discharge date</label>
        <Skeleton height={48} />
      </div>
    </>
  );
}
