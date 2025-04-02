import { Route } from 'react-router-dom';
import { routes } from 'routes';
import lazyWithPreload from 'react-lazy-with-preload';
import ContentHeaderContext from 'components/ContentHeaderContext';

const TotalGeoFencingView = lazyWithPreload(() => import('../TotalGeoFencing/TotalGeoFencingView'));
const TotalLastLocation = lazyWithPreload(() => import('../TotalLastLocation/TotalLastLocationView'));
const GeofencingLayoutView = lazyWithPreload(() => import('screens/Settings/Geofencing/GeofencingLayoutView'));
const GeofencingListView = lazyWithPreload(() => import('screens/Settings/Geofencing/GeofencingList'));
const GeoFencingForm = lazyWithPreload(() => import('screens/Settings/Geofencing/GeoFencingForm'));

const GeoFencingLayout = lazyWithPreload(() => import('screens/Patient/GeoFencing/GeoFencingListLayout'));
const GeoFenceListForPatient = lazyWithPreload(() => import('screens/Patient/GeoFencing/GeoFenceListForPatient'));
const GeoFenceMapViewForPatient = lazyWithPreload(() => import('screens/Patient/GeoFencing/GeoFenceMapViewForPatient'));
const GeoFenceLastLocations = lazyWithPreload(() => import('screens/Patient/GeoFencing/LastLocations'));

export const geoFenceRoutesPreload = [
  GeofencingLayoutView,
  GeofencingListView,
  GeoFencingForm,
  GeoFencingLayout,
  GeoFenceListForPatient,
  GeoFenceMapViewForPatient,
  GeoFenceLastLocations,
  TotalGeoFencingView,
  TotalLastLocation
];

export const GeoFenceRoutes = [
  <Route key="GeoFence">
    {/* Global */}
    <Route
      element={
        <ContentHeaderContext>
          <GeofencingLayoutView />
        </ContentHeaderContext>
      }
      path={routes.geofencing.view.match}>
      <Route
        element={<GeofencingListView />}
        path={routes.geofencing.listView.match}
      />
      <Route
        element={<GeoFenceMapViewForPatient />}
        path={routes.geofencing.mapView.match}
      />
    </Route>

    <Route
      path={routes.geofencing.addGeoFencing.match}
      element={<GeoFencingForm />}
    />
    <Route
      path={routes.geofencing.updateGeoFencing.match}
      element={<GeoFencingForm />}
    />

    <Route
      path={routes.lastLocations.match}
      element={<GeoFenceLastLocations />}
    />
    <Route
      path={routes.createGeoFencing.match}
      element={<GeoFencingForm />}
    />
    <Route
      path={routes.editGeoFencing.match}
      element={<GeoFencingForm />}
    />
    <Route
      path={routes.geofencing.totalLastLocation.match}
      element={<TotalLastLocation />}
    />
    <Route
      path={routes.geofencing.totalGeofencing.match}
      element={<TotalGeoFencingView />}
    />
  </Route>,
];
