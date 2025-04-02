/*  */
import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { Skeleton } from '@mantine/core';

import { routes } from 'routes';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import ListIcon from 'components/icons/ListIcon';
import MapIcon from 'components/icons/MapIcon';
import Button from 'components/ui/button/Button';
import './_geo-fencing.scoped.scss';
import { useLazyQuery } from '@apollo/client';
import { getPatientNameQuery } from 'graphql/patient-name.query';
import { GetPatientName, GetPatientNameVariables, UserPermissionNames } from 'health-generatedTypes';
import { fullNameController } from 'components/fullName';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import CustomSearchField from 'components/CustomSearchField';

export default function GeoFencingScreen() {
  const location = useLocation();
  const { id, eventId } = useParams();
  const [patientHeading, setPatientHeading] = useState<string>();
  const [searchedPhase, setSearchedPhase] = useState('');
  const hasGeoFence = useGetPrivilege(
    UserPermissionNames.GEOFENCES,
    CapabilitiesType.EDIT
  );
  
  const [getPatientName, { loading: titleLoading }] = useLazyQuery<GetPatientName, GetPatientNameVariables>(getPatientNameQuery, {
    onCompleted: (d) => {
      setPatientHeading(fullNameController(d.pretaaHealthPatientDetails.firstName, d.pretaaHealthPatientDetails.lastName));
    },
  });

  useEffect(() => {
    if (id) {
      getPatientName({
        variables: {
          patientId: id,
        },
      });
    }
  }, [id]);


  return (
    <React.Fragment>
      <ContentHeader className="lg:sticky" 
     >
        <div className="block sm:flex sm:justify-between heading-area mt-3">
          <div className="header-left">
            {titleLoading && 
             <Skeleton
             width={window.innerWidth < 640 ? '90%' : 400}
             height={24}
             mt={4}
           />
            }
            {!titleLoading && (
              <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5">{patientHeading}</h1>
            )}
          </div>
          {location.pathname.includes('/dashboard/patient/list/geo-fencing/map-view') &&
          hasGeoFence && (
            <div className="header-right mt-3 sm:mt-0 inline-block">
              <Link to={location.pathname.includes('events') ? routes.eventsCreateGeoFencing.build(String(eventId), String(id)) : routes.createGeoFencing.build(String(id))}>
                <Button>Create new</Button>
              </Link>
            </div>
          )}
        </div>
        {location.pathname.includes('list-view') && (
          <div className="inline-flex -ml-3 rounded-xl bg-white py-2 px-4 items-center focus:border-2 focus:border-primary-light">
            <CustomSearchField
             defaultValue={searchedPhase}
             onChange={setSearchedPhase}
            />
          </div>
        )}
      </ContentHeader>

      <div className="flex justify-between mt-8 px-6  lg:px-16">
        {location.pathname.includes('/dashboard/settings/patient/geo-fencing/map-view') && (
          <div className="text-md font-bold">Geofences</div>
        )}
        <div className=" flex justify-end w-full space-x-4 nav-link ">
          <NavLink
            to={location.pathname.includes('events') ? routes.eventsListView.build(String(id), String(eventId)) : routes.listView.build(String(id))}
            className={({ isActive }) =>
              `py-1 mr-2 font-normal text-xsm text-gray-150  ${isActive ? 'activeTabClasses ' : ''}`
            }>
            <div className="flex">
              <div className="pr-2 mt-0.5">
                <ListIcon />
              </div>
              <div className="text-xsm">List</div>
            </div>
          </NavLink>
          <NavLink
            to={location.pathname.includes('events') ? routes.eventsMapView.build(String(id), String(eventId)) : routes.mapView.build(String(id))}
            className={({ isActive }) =>
              `py-1 mr-2 font-normal text-xsm text-gray-150  ${isActive ? 'activeTabClasses' : ''}`
            }>
            <div className="flex">
              <div className="pr-2 -mt-0.5">
                <MapIcon />
              </div>
              <div className="text-xsm ">Map</div>
            </div>
          </NavLink>
        </div>
      </div>

      <ContentFrame>
        <Outlet />
      </ContentFrame>
    </React.Fragment>
  );
}
