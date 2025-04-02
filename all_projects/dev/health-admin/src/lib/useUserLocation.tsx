import { config } from 'config';
import { useState } from 'react';

export default function useUserLocation() {
  let prevLocation: any = localStorage.getItem(config.storage.userLocation);

  if (prevLocation) {
    prevLocation = JSON.parse(prevLocation);
  } else {
    prevLocation = { lat: 37.3316798, lng: -122.0323777 };
  }

  const [location] = useState<{ lat: number; lng: number }>(prevLocation);

  const successCallback = (position: GeolocationPosition) => {
    if (position.coords && !prevLocation) {
      localStorage.setItem(config.storage.userLocation, JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }));
    }
  };

  const errorCallback = (error: any) => {
    console.log(error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true });

  return location;
}
