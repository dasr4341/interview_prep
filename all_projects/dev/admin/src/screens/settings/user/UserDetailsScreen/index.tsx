/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { SortOrder, UserDetails, UserDetailsVariables } from 'generatedTypes';
import { getUserDetails } from 'lib/query/user/user-details';
import { useParams } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import { NavLink, Outlet } from 'react-router-dom';
import { routes } from 'routes';
import { useEffect } from 'react';
import { TrackingApi } from 'components/Analytics';

export default function UserDetailScreen(): JSX.Element {
  const params = useParams();
  const [getUserDetailsData, { data }] = useLazyQuery<UserDetails, UserDetailsVariables>(getUserDetails, {
    variables: {
      userId: params.id as string,
      orderBy: [
        {
          group: {
            name: SortOrder.asc,
          },
        },
      ],
    },
  });
  const activeTabClasses = 'border-b-2 border-pt-blue-300 text-pt-blue-300';

  useEffect(() => {
    getUserDetailsData();
  }, []);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.UserDetailScreen.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={data ? `${data?.pretaaGetUserDetails?.firstName} ${data?.pretaaGetUserDetails?.lastName}` : '...'}>
        {/* Accordion link */}
        <div className="flex bg-white border-b">
          <NavLink
            to={routes.UserDetails.build(String(data?.pretaaGetUserDetails?.id))}
            className={({ isActive }) => `py-1 px-4 text-primary mr-2 font-bold  ${isActive ? activeTabClasses : ''}`}>
            Details
          </NavLink>
          <NavLink
            to={routes.userCompanyAccess.build(String(data?.pretaaGetUserDetails?.id))}
            className={({ isActive }) => `py-1 px-4 text-primary font-bold ${isActive ? activeTabClasses : ''}`}>
            Company access
          </NavLink>
        </div>
      </ContentHeader>
      <ContentFrame>
        <Outlet />
      </ContentFrame>
    </>
  );
}
