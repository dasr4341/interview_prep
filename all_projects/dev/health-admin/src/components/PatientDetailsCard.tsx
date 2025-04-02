import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { useMutation, useQuery } from '@apollo/client';
import { differenceInCalendarDays, differenceInYears, format } from 'date-fns';
import DatePicker from 'react-datepicker';

import { config } from 'config';
import {
  PatientDetails,
  PatientDetailsVariables,
  PatientDetails_pretaaHealthPatientDetails,
  SubmitDaysSober,
  SubmitDaysSoberVariables,
  UserTypeRole,
} from 'health-generatedTypes';
import ProfileRowElement from 'screens/Patient/components/ProfileRowElement';
import DaySoberEdit from './icons/DaySoberEdit';
import SafeHtml from './SafeHtml';
import { dateContentStyle, getWindowDimensions } from './EventFilterToggler';
import { submitDaysSoberMutation } from 'graphql/submitDaysSober.mutation';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import PatientDetailsCardComponentSkeletonLoading from 'screens/Patient/skeletonLoading/PatientDetailsCardComponentSkeletonLoading';
import { patientDetailsQuery } from 'graphql/patientDetails.query';
import useSelectedRole from 'lib/useSelectedRole';

interface Props {
  patientId: string;
}

export default function PatientDetailsCardComponent({ patientId }: Props) {
  const [chooseDate, setChooseDate] = useState<Date | null>();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  // copy query to local state to trigger DOM changes
  const [patient, setPatient] = useState<PatientDetails_pretaaHealthPatientDetails>();

  const isClinician = useSelectedRole({
    roles: [UserTypeRole.COUNSELLOR, UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN],
  });

  const getDateFormat = (selectedDate: string) => format(new Date(selectedDate), config.dateFormat);

  const { data, loading, refetch } = useQuery<PatientDetails, PatientDetailsVariables>(patientDetailsQuery, {
    variables: {
      patientId,
    },
    onCompleted: (d) => {
      d.pretaaHealthPatientDetails.patientDetails?.daysSober &&
        setChooseDate(new Date(d.pretaaHealthPatientDetails.patientDetails?.daysSober));
      setPatient(data?.pretaaHealthPatientDetails);
    },
    onError: (e) => catchError(e, true),
  });

  const [submitDaysSoberCallBack, { loading: submitDaysSoberLoading }] = useMutation<
    SubmitDaysSober,
    SubmitDaysSoberVariables
  >(submitDaysSoberMutation, {
    onCompleted: async (d) => {
      d.pretaaHealthSubmitDaysSober && toast.success(d.pretaaHealthSubmitDaysSober);
      const { data } = await refetch();
      setPatient(data.pretaaHealthPatientDetails);
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function patientContact() {
    const patientCnt = patient?.patientContactList?.patientContacts;
    if (!!patientCnt && !!patientCnt.length) {
      const emergencyContactData = patientCnt
        .filter((el) => el.fullName !== null )
        .map((e) => e.fullName)
        .join(', ');

      return emergencyContactData;
    }
    // if no patient contacts
    return 'None';
  }

  // display initials of patient for avatar
  function patientInitials() {
    if (patient) {
      return patient.firstName!.charAt(0) + patient.lastName!.charAt(0);
    }
    return '';
  }

  // display date of birth in format 'YYYY-MM-DD (# years old)
  function dateOfBirthString() {
    const dateOfBirth = patient?.patientDetails?.dob;
    if (dateOfBirth) {
      return `${dateOfBirth} (${differenceInYears(new Date(), new Date(dateOfBirth!))} years old)`;
    }
    return 'N/A';
  }

  // display days sober
  function calculateDaysSober() {
    if (patient?.patientDetails?.daysSober) {
      return differenceInCalendarDays(new Date(), new Date(chooseDate || new Date()));
    } else if (patient?.patientDetails?.intakeDate) {
      return differenceInCalendarDays(new Date(), new Date(patient.patientDetails.intakeDate));
    } else {
      return 'N/A';
    }
  }

  return (
    <>
      {loading && <PatientDetailsCardComponentSkeletonLoading />}
      {!loading && patient && (
        <div className="bg-white px-5 pt-6 border border-gray-200 rounded-xl my-8">
          <div className="md:flex mb-8 w-full">
            <div className="w-25">
              <div className="h-36 w-36 rounded-full bg-gray-600 flex mr-8">
                <span className="m-auto text-lg text-gray-300">{patientInitials()}</span>
              </div>
            </div>
            <div className="mx-4 md:flex-grow pt-6">
              <div className="flex justify-between items-start">
                <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5 capitalize">
                  {`${patient.firstName} ${patient.lastName}`}
                </h1>
                <span className="whitespace-nowrap text-xs text-pt-green-600 bg-pt-green-600 bg-opacity-50 px-2 rounded-md">
                  {patient.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <ProfileRowElement
                  header="Gender"
                  details={patient.patientDetails?.gender || 'N/A'}
                  className="capitalize"
                />
                <ProfileRowElement
                  header="Date of Birth"
                  details={`${dateOfBirthString()}`}
                />
                <ProfileRowElement
                  header="Emergency Contact(s)"
                  details={patientContact()}
                />
                <div className="bg-white ">
                  <div className="flex">
                    <div className="text-gray-600 mb-2  text-xss font-medium">Sobriety Days</div>

                    <div className={`relative -mt-1 ml-1 ${isClinician && 'hidden'}`}>
                      <Popup
                        closeOnDocumentClick
                        position={`${windowDimensions > 590 ? 'right top' : 'bottom center'}`}
                        trigger={
                          <button type="button">
                            <DaySoberEdit className="cursor-pointer" />
                          </button>
                        }
                        contentStyle={{ ...dateContentStyle }}>
                        <div className="absolute">
                          <DatePicker
                            maxDate={new Date()}
                            inline
                            disabled={submitDaysSoberLoading}
                            onChange={(date) => {
                              if (date) {
                                setChooseDate(date);
                                submitDaysSoberCallBack({
                                  variables: { daysSober: date.toISOString() },
                                });
                              }
                            }}
                            selected={chooseDate}
                            className={`cursor-pointer ${submitDaysSoberLoading && 'cursor-wait'}`}
                          />
                        </div>
                      </Popup>
                    </div>
                  </div>
                  <div className="text-primary text-base font-normal">{calculateDaysSober()}</div>
                </div>
                <ProfileRowElement
                  header="Facility"
                  details={(patient.userFacilities && patient.userFacilities[0].name) || 'N/A'}
                  className="col-span-1"
                />
                <ProfileRowElement
                  header="Room #"
                  details={patient.patientDetails?.room || 'N/A'}
                  className="col-span-1"
                />
                <ProfileRowElement
                  header="Bed Name"
                  details={patient.patientDetails?.bedName || 'N/A'}
                  className="col-span-1"
                />
                {isClinician && (
                  <ProfileRowElement
                    header="Diagnosis"
                    details="">
                    <SafeHtml rawHtml={patient.patientDetails?.diagnosis || 'N/A'} />
                  </ProfileRowElement>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <ProfileRowElement
                  header="Intake Date"
                  details={
                    patient.patientDetails?.intakeDate
                      ? getDateFormat(patient.patientDetails?.intakeDate as string)
                      : 'N/A'
                  }
                />
                <ProfileRowElement
                  header="Discharge Date"
                  details={
                    patient.patientDetails?.dischargeDate
                      ? getDateFormat(patient.patientDetails?.dischargeDate as string)
                      : 'N/A'
                  }
                />
              </div>
              {isClinician && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <ProfileRowElement
                    header="Payment Method"
                    details={patient.patientDetails?.paymentMethod || 'N/A'}
                  />
                  <ProfileRowElement
                    header="Insurance company"
                    details={patient.patientDetails?.insuranceCompany || 'N/A'}
                  />
                  <ProfileRowElement
                    header="Payment method Category"
                    details={patient.patientDetails?.paymentMethodCategory || 'N/A'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
