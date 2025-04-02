/*  */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PatientDetailsRow from './components/PatientDetailsRow';
import PatientDetailsRowElement from './components/PatientDetailsRowElement';
import { format } from 'date-fns';
import { config } from 'config';
import UserDetailsSkeleton from '../skeletonLoading/UserDetailsSkeleton';
import DateFormat from 'components/DateFormat';
import { useLazyQuery } from '@apollo/client';
import { GetPatientDetails, GetPatientDetailsVariables, GetPatientDetails_pretaaHealthPatientDetails } from 'health-generatedTypes';
import { getPatientDetails } from 'graphql/getPatientDetails.query';

export default function UserDetails() {
  const { id } = useParams();
  const [patientDetailsState, setPatientDetailsState] = useState<GetPatientDetails_pretaaHealthPatientDetails>();

  const [getPatientsDetailsData, { loading: patientsDetailsLoading }] =
  useLazyQuery<GetPatientDetails, GetPatientDetailsVariables>(
    getPatientDetails,
    {
      onCompleted: (data) => {
        if (data) {
          setPatientDetailsState(data.pretaaHealthPatientDetails);
        }
      }
    });

    useEffect(() => {
      getPatientsDetailsData({
        variables: {
          patientId: String(id)
        }
      });
    }, []);

  return (
    <>
      {patientsDetailsLoading && <UserDetailsSkeleton />}
      {!patientsDetailsLoading && patientDetailsState && (
        <>
          <div className="rounded-xl bg-white p-6 border border-border">
            <PatientDetailsRow>
              <>
                <PatientDetailsRowElement
                  title="Intake Date"
                  content={
                    (
                      <>
                        {patientDetailsState.patientDetails?.intakeDate ? 
                        format(new Date(patientDetailsState.patientDetails?.intakeDate), config.dateFormat) : 'N/A'}
                      </>
                    )
                  }
                />
                <PatientDetailsRowElement
                  title="Discharge Date"
                  content={
                    (
                      <>
                        {patientDetailsState.patientDetails?.dischargeDate ? 
                        format(new Date(patientDetailsState.patientDetails?.dischargeDate), config.dateFormat) : 'N/A'}
                      </>
                    )
                  }
                />
                <PatientDetailsRowElement
                  title="Date Of Onboarding"
                  content={
                    patientDetailsState.patientDetails?.intakeDate ? format(new Date(patientDetailsState.patientDetails?.intakeDate), config.dateFormat) : 'N/A'
                  }
                />
              </>
            </PatientDetailsRow>
            <PatientDetailsRow>
              <>
                <PatientDetailsRowElement title="Email" content={patientDetailsState?.email} />

                <PatientDetailsRowElement
                  title="Phone Number"
                  content={patientDetailsState?.patientDetails?.phone || 'N/A'}
                />
              </>
            </PatientDetailsRow>
            <hr className="mt-8 bg-gray-500 mb-4" />

            <div className=" space-y-4">
              {patientDetailsState.patientContactList?.patientContacts
                ?.filter((el) => el.fullName || el.phone || el.email)
                .map((el) => {
                  return (
                    <div key={el.id}>
                      <PatientDetailsRow>
                        <>
                          <PatientDetailsRowElement title="Emergency Contact" content={el.fullName || el.email} />
                          <PatientDetailsRowElement title="Phone Number" content={el.phone || 'N/A'} />
                        </>
                      </PatientDetailsRow>
                    </div>
                  );
                })}
            </div>

            <PatientDetailsRow>
              <>
                <PatientDetailsRowElement
                  title="Last login"
                  content={
                    (
                      <>
                        {patientDetailsState.lastLoginTime ? (
                          <DateFormat date={patientDetailsState.lastLoginTime} />
                        ) : (
                          'N/A'
                        )}
                      </>
                    ) || 'N/A'
                  }
                />
                <PatientDetailsRowElement
                  title="Friends / Family"
                  content={
                    patientDetailsState.patientContactList?.suppoters?.map((x) => x.firstName || null)?.length
                      ? 'YES'
                      : 'NO'
                  }
                />
                <PatientDetailsRowElement
                  title="Status"
                  content={patientDetailsState.active ? 'Active' : 'Inactive'}
                />
              </>
            </PatientDetailsRow>
            <PatientDetailsRow>
              <>
                <PatientDetailsRowElement title="Location" content={patientDetailsState.patientDetails?.patientLocation?.locationName || 'N/A'} />
              </>
            </PatientDetailsRow>
            <PatientDetailsRow>
              <>
                <PatientDetailsRowElement
                  title="Bed Name"
                  content={patientDetailsState.patientDetails?.bedName || 'N/A'}
                />
                <PatientDetailsRowElement
                  title="Room #"
                  content={patientDetailsState.patientDetails?.room || 'N/A'}
                />
              </>
            </PatientDetailsRow>
          </div>
        </>
      )}
    </>
  );
}
