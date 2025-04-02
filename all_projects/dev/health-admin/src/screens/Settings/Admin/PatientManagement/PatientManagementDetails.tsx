/*  */
import React, { useEffect, useState } from 'react';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { BsPencil } from 'react-icons/bs';
import { fullNameController } from 'components/fullName';
import { useLazyQuery } from '@apollo/client';
import {
  GetPatientDetails,
  GetPatientDetailsVariables,
  GetPatientDetails_pretaaHealthPatientDetails,
} from 'health-generatedTypes';
import { getPatientDetails } from 'graphql/getPatientDetails.query';
import { Skeleton } from '@mantine/core';

export default function PatientManagementDetails() {
  const { id } = useParams();
  const [patientDetailsState, setPatientDetailsState] = useState<GetPatientDetails_pretaaHealthPatientDetails>();
  const navigate = useNavigate();

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
    <React.Fragment>
      <ContentHeader>
        <React.Fragment>
        <div className="flex-row flex my-6 items-end">
            {!patientsDetailsLoading && (
              <h1 className="h1 leading-none text-primary font-bold  text-md lg:text-lg ">
                {fullNameController(patientDetailsState?.firstName, patientDetailsState?.lastName)}
              </h1>
            )}
            {patientsDetailsLoading && 
              <Skeleton height={32} width={'50%'} />
            }
            {patientDetailsState?.id && (
              <div className='w-15 mb-2'>
              <BsPencil
                size={22}
                className="ml-4 text-primary-light cursor-pointer"
                onClick={() => navigate(routes.admin.addPatient.patientDetails.build({ patientId: id as string }))}
              />
              </div>
            )}
          </div>
          
          <div className="flex w-full border-b ">
            <NavLink
              to={routes.admin.patientDetails.userDetails.build(String(id))}
              className={({ isActive }) => {
                return `cursor-pointer text-base font-bold  p-2 mr-2 ${
                  isActive && 'text-primary-light border-primary-light  border-b-2 '
                } `;
              }}>
              User Detail
            </NavLink>
            <NavLink
              to={routes.admin.patientDetails.responder.build(id as string)}
              className={({ isActive }) => {
                return `cursor-pointer text-base font-bold 
               p-2 ${isActive && 'text-primary-light border-primary-light  border-b-2'}`;
              }}>
              Care Teams
            </NavLink>
          </div>
        </React.Fragment>
      </ContentHeader>
      <ContentFrame>
        <Outlet />
      </ContentFrame>
    </React.Fragment>
  );
}
