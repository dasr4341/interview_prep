import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { ContentHeader } from 'components/ContentHeader';
import { routes } from 'routes';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import useQueryParams from 'lib/use-queryparams';
import { useLazyQuery } from '@apollo/client';
import { getStaffOnlyName } from 'graphql/getStaff.query';
import { GetStaffOnlyName, GetStaffOnlyNameVariables, UserStaffTypes } from 'health-generatedTypes';
import catchError from 'lib/catch-error';

export default function EmployeeDetails(){
  const query = useQueryParams();
  const { id: userId } = useParams();
  const [hasCounsellor, setCounsellor] = useState<boolean | undefined>(false);
  const [teamMemberDetails, { data, loading }] = useLazyQuery<GetStaffOnlyName, 
  GetStaffOnlyNameVariables>(getStaffOnlyName, {
    onError: (e) => catchError(e, true)
  });

  useEffect(() => {
    teamMemberDetails({ variables: { userId: String(userId) } });
  }, []);

  useEffect(() => {
    if (data) {
      const isCounsellor = data.pretaaHealthGetStaffUser.roles?.some((el) => el.roleSlug === UserStaffTypes.COUNSELLOR);
      setCounsellor(isCounsellor);
    }
  }, [data]);

  return (
    <React.Fragment>
      <ContentHeader className="lg:sticky" titleLoading={loading} disableGoBack={false}>
        <div className='flex flex-col md:flex-row text-primary mb-5 mt-2'>
          {!loading && (
            <h1 className="h1 leading-none text-primary font-bold flex-1
            text-md lg:text-lg capitalize">{data?.pretaaHealthGetStaffUser.firstName && data?.pretaaHealthGetStaffUser.lastName
              ? `${data?.pretaaHealthGetStaffUser.firstName}
                ${data?.pretaaHealthGetStaffUser.lastName}`
              : 'N/A'
            }
            </h1>
          )}
        </div>
        {/* Accordion link */}
        <div className="flex bg-white border-b">
          <NavLink
            to={routes.admin.employeeDetailsScreen.build(String(userId), query)}
            className={({ isActive }) => `py-1 px-4 text-primary mr-2 font-bold  ${isActive ? 'activeTabClasses' : ''}`}>
            Details
          </NavLink>
          {hasCounsellor &&
            <NavLink
              to={routes.admin.employeePatientsScreen.build(String(userId), query)}
              className={({ isActive }) => `py-1 px-4 text-primary font-bold ${isActive ? 'activeTabClasses' : ''}`}>
              Patients
            </NavLink>
          }
        </div>
      </ContentHeader>
      <ContentFrame className='h-screen lg:h-full'>
        <Outlet />
      </ContentFrame >
    </React.Fragment>
  );
}
