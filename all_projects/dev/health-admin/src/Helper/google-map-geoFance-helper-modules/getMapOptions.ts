export function getMapOptions(
  styles: any,
  zoom: number,
  maxZoom: number,
  mapTypeControl: boolean,
  streetViewControl: boolean,
  scaleControl: boolean,
  fullscreenControl = true,
  mTypeControlOptions?: google.maps.MapTypeControlOptions,
) {
  return {
    zoom,
    maxZoom,
    styles,
    mapTypeControl,
    streetViewControl,
    scaleControl,
    gestureHandling: 'cooperative',
    mapTypeControlOptions: mTypeControlOptions,
    fullscreenControl
  };
}