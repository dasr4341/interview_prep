import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMapCircle } from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';

export function removeMapMarkersAndCluster(
  mapMarkersRef: google.maps.Marker[],
  markerClustererRef: MarkerClusterer,
  circlesRef: GoogleMapCircle[]
) {
  for (let i = mapMarkersRef.length - 1; i >= 0; i--) {
    mapMarkersRef[i].setMap(null);
    circlesRef[i].setMap(null);
    markerClustererRef.removeMarker(mapMarkersRef[i]);
    mapMarkersRef.splice(i, 1);
    circlesRef.splice(i, 1);
  }
}
