import React from 'react';
import { fullNameController } from './fullName';
import { Skeleton } from '@mantine/core';
import useGetPatientDetails from 'customHooks/useGetPatientDetails';

export default function PatientNameCard({ patientId }: { patientId: string }) {
  const {patientDetailsState, loading } = useGetPatientDetails(patientId);

  return (
    <React.Fragment>
      {loading && (
        <div className="font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
          <Skeleton
            height={20}
            width={50}
          />
        </div>
      )}
      {!loading && (
        <div className="flex flex-col py-6 px-5 border-b border-gray-100 relative bg-white border rounded-xl">
          <h3 className="font-bold text-base">
            {fullNameController(patientDetailsState?.data?.firstName, patientDetailsState?.data?.lastName)}
          </h3>
        </div>
      )}
    </React.Fragment>
  );
}
