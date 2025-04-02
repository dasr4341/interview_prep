
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { getPatientCoordinates } from 'graphql/getPatientCoordinates.query';
import { GetPatientCoordinates, GetPatientCoordinatesVariables, GetPatientName, GetPatientNameVariables } from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  FenceAreaType,
  GeoFenceArea,
  GeoFencingPageTypes,
  GoogleMapCircle,
  transformToGeoFenceAreaTypeObject,
} from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import { removeMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/removeMapMarkersAndCluster';
import { addMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/addMapMarkersAndCluster';
import GoogleMapSkeletonLoader from 'screens/Settings/Geofencing/SkeletonLoading/GoogleMapSkeletonLoader';
import { mapLoader } from 'lib/map-loader';
import { getMapOptions } from 'Helper/google-map-geoFance-helper-modules/getMapOptions';
import { config } from 'config';
import { fullNameController } from 'components/fullName';
import { getPatientNameQuery } from 'graphql/patient-name.query';
import { Skeleton } from '@mantine/core';

export const geoFencingMapStyle = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        saturation: 36,
      },
      {
        color: '#333333',
      },
      {
        lightness: 40,
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#ffffff',
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#fefefe',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#fefefe',
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dedede',
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 29,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 18,
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f2f2f2',
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e9e9e9',
      },
      {
        lightness: 17,
      },
    ],
  },
];

//  ------------------------ MAP constants --------------------
let bounds: google.maps.LatLngBounds;
const circles: GoogleMapCircle[] = [];
let markerClusterer: MarkerClusterer;
const markers: google.maps.Marker[] = [];
let map: google.maps.Map | null;
let infoWindow: google.maps.InfoWindow | null | undefined;
const infoWindows: google.maps.InfoWindow[] = [];
//  ------------------------ MAP constants --------------------

// ********* TO USE loadMapInstance() ->  we need the map  and markerClusterer, to be defined at the top, -> prerequisites ***********
export function loadMapInstance(
  googleMapRef: any,
) {
  mapLoader
    .load()
    .then(() => {
      console.log('map instance loaded ....');
    })
    .catch((e) => console.error(e));

  mapLoader.loadCallback((e) => {
    if (e) {
      console.log(e);
    } else {
      map = new google.maps.Map(
        googleMapRef.current as HTMLElement,
        getMapOptions(
          geoFencingMapStyle,
          config.map.minZoom,
          config.map.maxZoom,
          false,
          false,
          true
        )
      );
      markerClusterer = new MarkerClusterer({ map });

      infoWindow = new google.maps.InfoWindow({
        content: '',
      });
      infoWindows.push(infoWindow);
    }
  });

  return { markerClusterer, map };
}

export default function LastLocations() {
  const { patientId } = useParams();
  const googleMapRef = useRef<any>();
  const [loadingState, setLoadingState] = useState(false);
  const [fenceAreaList, setFenceAreaList] = useState<GeoFenceArea[]>([]);
  const [patientHeading, setPatientHeading] = useState<string>();

  const [getPatientName, { loading: titleLoading }] = useLazyQuery<GetPatientName, GetPatientNameVariables>(getPatientNameQuery, {
    onCompleted: (d) => {
      setPatientHeading(fullNameController(d.pretaaHealthPatientDetails.firstName, d.pretaaHealthPatientDetails.lastName));
    },
  });

  useEffect(() => {
    if (patientId) {
      getPatientName({
        variables: {
          patientId: patientId,
        },
      });
    }
  }, [getPatientName, patientId]);

  function addOrUpdateMapData(
    listData: GeoFenceArea[],
    mapInstance: google.maps.Map,
    markerClustererRef: MarkerClusterer
  ) {
    if (markers?.length) {
      removeMapMarkersAndCluster(markers, markerClustererRef, circles);
    }
  
    
    bounds = new google.maps.LatLngBounds();
    const addMapMarkersResponse = addMapMarkersAndCluster(
      infoWindows,
      mapInstance,
      listData,
      markerClustererRef,
      markers,
      bounds,
      GeoFencingPageTypes.TotalLastKnownLocation,
      circles
    );

    infoWindows.push(...addMapMarkersResponse.infoWindows);

    mapInstance.fitBounds(bounds);
  }

  //  ----------------- API -------------------
  const [getPatientLocation] = useLazyQuery<GetPatientCoordinates, GetPatientCoordinatesVariables>(
    getPatientCoordinates,
    {
      variables: {
        patientId: String(patientId),
        take: 1,
      },
      onCompleted: (data) => {
        if (data.pretaaHealthGetPatientCoordinates) {
          const list: GeoFenceArea[] = transformToGeoFenceAreaTypeObject(
            data.pretaaHealthGetPatientCoordinates,
            FenceAreaType.patient,
            true
          );
          setFenceAreaList(list);
          if (!map) {
            const mapLoadedInstance = loadMapInstance(googleMapRef);
            map = mapLoadedInstance.map;
            markerClusterer = mapLoadedInstance.markerClusterer;
          }
          addOrUpdateMapData(list, map as google.maps.Map, markerClusterer);
          setLoadingState(false);
        }
      },
      onError: (e) => catchError(e, true),
    }
  );
  //  ----------------- API -------------------

  // CALLING API -------------------------
  const callApiToGetSelectedPatientData = useCallback(
    function (id: string | undefined) {
      if (id) {
        setLoadingState(true);
        getPatientLocation();
      }
    },
    [getPatientLocation]
  );

  useEffect(() => {
    callApiToGetSelectedPatientData(patientId);
  }, [callApiToGetSelectedPatientData, patientId]);

  useEffect(() => {
    map = null;
    const mapLoadedInstance = loadMapInstance(googleMapRef);
    map = mapLoadedInstance.map;
    markerClusterer = mapLoadedInstance.markerClusterer;
    // 
  }, []);

  return (
    <React.Fragment>
      <ContentHeader>
        <div className="flex justify-between items-center">
        {titleLoading && 
         <Skeleton
         width={window.innerWidth < 640 ? '90%' : 400}
         height={24}
         mt={4}
       />
        }
            {!titleLoading && (
              <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5">{patientHeading}</h1>
            )}
        </div>
      </ContentHeader>
      <ContentFrame>
        <div id="map" className="map relative h-custom">
          <div ref={googleMapRef} className="w-full h-full"></div>
          {(loadingState || !fenceAreaList.length) && (
            <GoogleMapSkeletonLoader displayText={!loadingState && !fenceAreaList.length ? 'No Data Found !!' : ''} />
          )}
        </div>
      </ContentFrame>
    </React.Fragment>
  );
}
