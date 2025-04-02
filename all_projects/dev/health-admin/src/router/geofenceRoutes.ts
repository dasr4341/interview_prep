import { buildUrl, makeRoute } from "./lib-router";

export const geofenceRoutes = {

  // global geoFence
  geofencing: {
    view: makeRoute('/dashboard/settings/geofencing', { name: 'Geofencing ' }),
    listView: makeRoute('/dashboard/settings/geofencing/list', {
      name: 'Geofencing List',
    }),
    mapView: makeRoute('/dashboard/settings/geofencing/map', {
      name: 'Geofencing Map',
    }),
    addGeoFencing: makeRoute('/dashboard/settings/geofencing/create', {
      name: 'GeoFencing',
    }),
    updateGeoFencing: {
      match: '/dashboard/settings/geofencing/edit/:fenceId',
      name: 'EditGeoFencing',
      build: (fenceId: string) =>
        buildUrl(`/dashboard/settings/geofencing/edit/${fenceId}`),
    },
    totalLastLocation: makeRoute('/dashboard/settings/totalLastLocation', {
      name: 'TotalLastLocation',
    }),
    totalGeofencing: makeRoute('/dashboard/settings/total-geofencing', {
      name: 'TotalGeofencing ',
    }),
  },
}
