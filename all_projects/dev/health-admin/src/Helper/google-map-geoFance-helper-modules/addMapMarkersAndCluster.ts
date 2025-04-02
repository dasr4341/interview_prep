import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GeoFenceArea, GeoFencingPageTypes, GoogleMapCircle } from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import { createCircle } from './createCircle';

export function addMapMarkersAndCluster(
  infoWindows: google.maps.InfoWindow[],
  mapInstance: google.maps.Map,
  fenceListData: GeoFenceArea[],
  markerClustererRef: MarkerClusterer | null,
  markersRef: google.maps.Marker[],
  bounds: google.maps.LatLngBounds,
  pageType: GeoFencingPageTypes,
  circlesRef?: GoogleMapCircle[],
  patientIdFromUrl?: string | undefined | null 
) {

  fenceListData?.forEach((e) => {
    if (e.status) {
      const markerAndCircleInstance = createCircle(infoWindows, mapInstance, e, pageType, patientIdFromUrl);
      markersRef.push(markerAndCircleInstance.marker);
      if (circlesRef) {
        circlesRef.push(markerAndCircleInstance.circle);
      }
      bounds.extend(new google.maps.LatLng(e.latitude, e.longitude));
    }
  });

  if (markerClustererRef) {
    markerClustererRef.addMarkers(markersRef);
  }

  if (fenceListData?.length) {
    mapInstance.setCenter({ lat: fenceListData[0].latitude, lng: fenceListData[0].longitude });
  }
  
  return { infoWindows };
}
