export function zoomIntoMap(zoom: number, mapInstance: google.maps.Map) {
   const mapCurrentZoom = Number(mapInstance.getZoom()) || 0;
    mapInstance.setZoom(mapCurrentZoom  + zoom);
}