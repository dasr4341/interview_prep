/*  */
import { routes } from 'routes';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import ListIcon from 'components/icons/ListIcon';
import MapIcon from 'components/icons/MapIcon';
import Button from 'components/ui/button/Button';
import './_geofencing-list.scoped.scss';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { UserPermissionNames } from 'health-generatedTypes';
import { useElementSize } from '@mantine/hooks';
import { HeaderContext } from 'components/ContentHeaderContext';
import { ContentHeader } from 'components/ContentHeader';
import CustomSearchField from 'components/CustomSearchField';

enum PageTypes {
  LIST = 'list',
  MAP = 'map',
}

export default function GeofencingView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [listViewIsActive, setListViewIsActive] = useState(location.pathname.includes(PageTypes.LIST));
  const [searchedPhase, setSearchedPhase] = useState('');
  const hasGeoFence = useGetPrivilege(UserPermissionNames.GEOFENCES, CapabilitiesType.EDIT);
  const { ref, height } = useElementSize();

  useEffect(() => {
    if (
      location.pathname === routes.geofencing.view.match + '/' ||
      location.pathname === routes.geofencing.view.match
    ) {
      navigate(routes.geofencing.listView.match);
    }
    setListViewIsActive(location.pathname.includes(PageTypes.LIST));
  }, [location.pathname]);

  const { setHeaderHeight } = useContext(HeaderContext);

  useEffect(() => {
    if (height) {
      setHeaderHeight(height);
    }
  }, [height]);

  return (
    <>
      <header ref={ref}>
        <ContentHeader
          className="lg:sticky" disableGoBack>
          <div className="flex flex-col py-2">
            <h1 className="h1 text-primary font-bold text-md lg:text-lg mb-5">Geofences Area</h1>

            <div className="flex md:flex-row flex-col md:items-center justify-start items-start md:justify-between">
              <div className="flex space-x-4">
                <div>
                  {!location.pathname.includes('geofencing/map') && (
                    <CustomSearchField
                      defaultValue={searchedPhase}
                      onChange={setSearchedPhase}
                    />
                  )}
                </div>
              </div>
              {hasGeoFence && !location.pathname.includes('geofencing/map') && (
                <Button
                  className="mt-4 md:mt-0"
                  onClick={() => navigate(routes.geofencing.addGeoFencing.match)}>
                  Create new
                </Button>
              )}
            </div>
          </div>
        </ContentHeader>
      </header>

      <ContentFrame className="h-full relative pt-5">
        <div className="flex space-x-6 items-center w-full justify-end mb-5">
          <Link
            to={routes.geofencing.listView.match}
            className={`flex items-center space-x-2 ${listViewIsActive && 'text-primary-light'} `}>
            <span className=" font-normal text-xs capitalize ">{PageTypes.LIST}</span>
            <ListIcon />
          </Link>
          <Link
            to={routes.geofencing.mapView.match}
            className={`flex items-center space-x-2 ${!listViewIsActive && 'text-primary-light'} `}>
            <span className=" font-normal text-xsm capitalize">{PageTypes.MAP}</span> <MapIcon />
          </Link>
        </div>
        <Outlet />
      </ContentFrame>
    </>
  );
}
