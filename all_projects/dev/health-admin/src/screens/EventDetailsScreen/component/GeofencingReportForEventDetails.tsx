/*  */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  GeoFencingTypes,
  HealthEventDetails_pretaaHealthEventDetails,
} from 'health-generatedTypes';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  GeoFenceArea,
  GeoFencingPageTypes,
  GoogleMapCircle,
} from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import { addMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/addMapMarkersAndCluster';
import GoogleMapSkeletonLoader from 'screens/Settings/Geofencing/SkeletonLoading/GoogleMapSkeletonLoader';
import { mapLoader } from 'lib/map-loader';
import { getMapOptions } from 'Helper/google-map-geoFance-helper-modules/getMapOptions';
import { config } from 'config';
import { geoFencingMapStyle } from 'screens/Patient/GeoFencing/LastLocations';

const eventFence = {
  circleColor: '#f2d973',
  markerColor: '#e60000'
};
const mapStyle = {
  height: '350px',
  width: '100%',
  borderRadius: 12,
};

//  ------------------------ MAP constants --------------------
let bounds: google.maps.LatLngBounds;
const circles: GoogleMapCircle[] = [];
const markers: google.maps.Marker[] = [];
let infoWindow: google.maps.InfoWindow | null | undefined;
const infoWindows: google.maps.InfoWindow[] = [];
//  ------------------------ MAP constants --------------------

// ********* TO USE loadMapInstance() ->  we need the map  and markerClusterer,
function loadMapInstance(
  mapRef: any,
  updateMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>
) {
  mapLoader
    .load()
    .then(() => {
      console.log('map instance loaded ....');
    })
    .catch((e) => console.error(e));

  mapLoader.loadCallback((e) => {
    if (e) {
      console.error(e);
      return;
    }
    const mapObj = new google.maps.Map(
      mapRef.current as HTMLElement,
      getMapOptions(
        geoFencingMapStyle,
        config.map.minZoom,
        16,
        false,
        false,
        true,
        false
      )
    );
    updateMap(mapObj);

    infoWindow = new google.maps.InfoWindow({
      content: '',
    });
    infoWindows.push(infoWindow);
  });
}

function getTransformData(data: HealthEventDetails_pretaaHealthEventDetails) {
  return [
    {
      createdAt: '',
      longitude: data?.fence?.longitude || 0,
      latitude: data?.fence?.latitude || 0,
      radius: data?.fence?.radius || 10,
      type: data?.fenceBreachType || GeoFencingTypes.IN,
      areaType: 'patient',
      status: true,
      id: data.patientId || '',
      color: eventFence.circleColor,
    }
  ] as GeoFenceArea[];
}

export default function GeofencingReportForEventDetails({
  eventFenceData,
  loading,
}: {
  eventFenceData: HealthEventDetails_pretaaHealthEventDetails;
  loading?: boolean;
}) {
  const googleMapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loadingState, setLoadingState] = useState(loading);

  function addOrUpdateMapData(
    listData: GeoFenceArea[],
    mapInstance: google.maps.Map,
    markerClustererRef: MarkerClusterer | null
  ) {
    bounds = new google.maps.LatLngBounds();

    const addMapMarkersResponse = addMapMarkersAndCluster(
      infoWindows,
      mapInstance,
      listData,
      markerClustererRef,
      markers,
      bounds,
      GeoFencingPageTypes.EventGeoFence,
      circles
    );

    infoWindows.push(...addMapMarkersResponse.infoWindows);

    mapInstance.setCenter(bounds.getCenter());
    mapInstance.fitBounds(bounds);
  }

  // CALLING API -------------------------
  const getMapMarkers = useCallback(function (mapInstance: google.maps.Map) {
    const list = getTransformData(eventFenceData);
    addOrUpdateMapData(list, mapInstance, null);
    setLoadingState(false);
  }, [eventFenceData]);

  useEffect(() => {
    if (map && eventFenceData.fence?.latitude) {
      setLoadingState(true);
      getMapMarkers(map);
    }
  }, [eventFenceData && map]);

  useLayoutEffect(() => {
    setMap(null);
    loadMapInstance(googleMapRef, setMap);
  }, []);


  return (
    <div className="bg-white px-5 py-5 border border-gray-200 rounded-xl mt-10">
      <span className=" text-black font-bold text-base">Geofencing Report</span>
      <div className=" w-full relative">
        <div
          className="mt-4"
          ref={googleMapRef}
          style={mapStyle}>
          {' '}
        </div>

        {(loadingState || !eventFenceData.fence?.latitude) && (
          <GoogleMapSkeletonLoader
            className="rounded-xl"
            displayText={
              !loadingState && !eventFenceData.fence?.latitude
                ? 'No Data Found !!'
                : ''
            }
          />
        )}
      </div>
      <div className=" flex space-x-4 items-center mt-4">
        {eventFenceData.fence?.location && (
          <>
            <div
              className="w-3 h-3 bg-amber-200 opacity-80 rounded-full border border-s "
              style={{
                backgroundColor: eventFence.circleColor,
              }}></div>
            <p className="text-primary font-normal text-base">
              {eventFenceData.fence?.location}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
