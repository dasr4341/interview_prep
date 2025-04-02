export function removeInfoWindow(infoWindowsRef: google.maps.InfoWindow[]) {
  for (let i = infoWindowsRef.length - 1; i >= 0; i--) {
    infoWindowsRef[i].close();
    infoWindowsRef.splice(i, 1);
  }
}