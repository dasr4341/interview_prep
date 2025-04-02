import React from 'react';
import { Route } from 'react-router-dom';
import { routes } from 'routes';
import lazyWithPreload from 'react-lazy-with-preload';
const GeofencingLayoutView = lazyWithPreload(() => import('screens/Settings/Geofencing/GeofencingLayoutView'));
const GeofencingListView = lazyWithPreload(() => import('screens/Settings/Geofencing/GeofencingList'));
const GeoFencingForm = lazyWithPreload(() => import('screens/Settings/Geofencing/GeoFencingForm'));

const GeoFencingLayout = lazyWithPreload(() => import('screens/Patient/GeoFencing/GeoFencingListLayout'));
const GeoFenceListForPatient = lazyWithPreload(() => import('screens/Patient/GeoFencing/GeoFenceListForPatient'));
const GeoFenceMapViewForPatient = lazyWithPreload(() => import('screens/Patient/GeoFencing/GeoFenceMapViewForPatient'));
const GeoFenceLastLocations = lazyWithPreload(() => import('screens/Patient/GeoFencing/LastLocations'));

export const counsellorGeoFencingRoutesPreload = [
  GeofencingLayoutView,
  GeofencingListView,
  GeoFencingForm,
  GeoFencingLayout,
  GeoFenceListForPatient,
  GeoFenceMapViewForPatient,
  GeoFenceLastLocations
];

// TODO: I think its duplicate, with -> GeoFenceRoutes
export const CounsellorGeoFencingRoutes = [
  <Route key='Patient'>
    <Route path={routes.geoFencingScreen.match} element={<GeoFencingLayout />}>
      <Route path={routes.mapView.match} element={<GeoFenceMapViewForPatient />} />
      <Route path={routes.listView.match} element={<GeoFenceListForPatient />} />z
    </Route>

    {/* geofences for events details */}
    <Route path={routes.eventsGeoFencingScreen.match} element={<GeoFencingLayout />}>
      <Route path={routes.eventsMapView.match} element={<GeoFenceMapViewForPatient />} />
      <Route path={routes.eventsListView.match} element={<GeoFenceListForPatient />} />
    </Route>

   {/* last locations for events details */}
    <Route path={routes.eventsLastLocations.match} element={<GeoFenceLastLocations />} />
    <Route path={routes.eventsCreateGeoFencing.match} element={<GeoFencingForm />} />
    <Route path={routes.eventsEditGeoFencing.match} element={<GeoFencingForm />} />

    <Route path={routes.lastLocations.match} element={<GeoFenceLastLocations />} />
    <Route path={routes.createGeoFencing.match} element={<GeoFencingForm />} />
    <Route path={routes.editGeoFencing.match} element={<GeoFencingForm />} />
  </Route>
];

