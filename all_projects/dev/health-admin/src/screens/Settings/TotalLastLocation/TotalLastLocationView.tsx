/*  */
import { useLazyQuery } from '@apollo/client';
import { getHealthFilterPatientCoordinates } from 'graphql/getHealthFilterPatientCoordinates.query';
import {
  GetHealthFilterPatientCoordinates,
  GetHealthFilterPatientCoordinatesVariables,
  GetPatientsForLocations,
  GetPatientsForLocationsVariables
} from 'health-generatedTypes';
import { useEffect, useRef, useState } from 'react';
import './_total-last-location.scoped.scss';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { getPatientQuery } from 'graphql/getPatients.query';
import TotalLastLocationLayout from './TotalLastLocationLayout';
import {
  CheckedOption,
  FenceAreaType,
  GeoFenceArea,
  GeoFencingPageTypes,
  GoogleMapCircle,
  GoogleMapCustomInfoWindowDataInterface,
  transformToGeoFenceAreaTypeObject,
} from '../TotalGeoFencing/TotalGeoFencingView';
import GoogleMapSkeletonLoader from '../Geofencing/SkeletonLoading/GoogleMapSkeletonLoader';
import { removeMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/removeMapMarkersAndCluster';
import { addMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/addMapMarkersAndCluster';
import MapSearchPopUp from 'components/geoFence/MapSearchPopUp';
import { mapLoader } from 'lib/map-loader';
import { geoFencingMapStyle } from 'screens/Patient/GeoFencing/LastLocations';
import { getMapOptions } from 'Helper/google-map-geoFance-helper-modules/getMapOptions';
import { removeInfoWindow } from 'Helper/google-map-geoFance-helper-modules/removeInfoWindow';
import GoogleMapCustomInfoWindow from 'components/GoogleMapCustomInfoWindow';
import { eventEmitter } from 'apiClient';
import { config } from 'config';
import catchError from 'lib/catch-error';

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
          0,
          0,
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

function updateSelectedCheckBoxStatus(
  newData: CheckedOption,
  callBack: React.Dispatch<React.SetStateAction<CheckedOption>>
) {
  callBack(newData);
}

export default function TotalLastLocationView() {
  const googleMapRef = useRef<any>();
  const [showData, setShowData] = useState(true);

  const [loadingState, setLoadingState] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [checkBoxStatusData, setCheckBoxStatusData] = useState<CheckedOption>({ all: true, patients: [] });
  const [googleMapCustomInfoWindowData, setGoogleMapCustomInfoWindowData] = useState<GoogleMapCustomInfoWindowDataInterface>({ data: null, pageType: null });

  
  function addOrUpdateMapData(
    listData: GeoFenceArea[],
    mapInstance: google.maps.Map,
    markerClustererRef: MarkerClusterer
  ) {
    if (markers?.length) {
      removeMapMarkersAndCluster(markers, markerClustererRef, circles);
      removeInfoWindow(infoWindows);
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
  const [getHealthPatientCoordinates] = useLazyQuery<
    GetHealthFilterPatientCoordinates,
    GetHealthFilterPatientCoordinatesVariables
  >(getHealthFilterPatientCoordinates, {
    onCompleted: (d) => {
      if (d.pretaaHealthFilterPatientCoordinates) {
        try {
          const list: GeoFenceArea[] = transformToGeoFenceAreaTypeObject(
            d.pretaaHealthFilterPatientCoordinates,
            FenceAreaType.patient,
            true
          );

          if (!map) {
            const mapLoadedInstance = loadMapInstance(googleMapRef);
            map = mapLoadedInstance.map;
            markerClusterer = mapLoadedInstance.markerClusterer;
            addOrUpdateMapData(list, map as google.maps.Map, markerClusterer);
          } else {
            addOrUpdateMapData(list, map, markerClusterer);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingState(false);
        }
      }
    },
    onError: (e) => {
      catchError(e, true);
    }
  });


  const [getPatientsData, { data: patients, loading: listLoading }] = useLazyQuery<GetPatientsForLocations, GetPatientsForLocationsVariables>(
    getPatientQuery,
    {
      variables: {
        search: searchText,
        take: 100,
      },
    }
  );
  //  ----------------- API -------------------

  // CALLING API -------------------------
  function callApiToGetSelectedPatientData(
    checkBoxState: CheckedOption
  ) {
    setLoadingState(true);
    getHealthPatientCoordinates({
      variables: {
        all: checkBoxStatusData.all ? true : false,
        patients: checkBoxState.all ? [] : checkBoxState.patients.map((p) => p.id),
      },
    });
  }

  // ----------------- CHECKBOX START ------------------

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const checkBoxStatus = event.target.checked;
    const newSelectedCheckBoxStatusData = { ...checkBoxStatusData };

    // if all is selected and at that case, user is trying to select any patient
    if (checkBoxStatusData.all) {
      newSelectedCheckBoxStatusData.all = false;
    }

    const isPatientAlreadySelected = !!checkBoxStatusData.patients.find((x) => x.id === id);

    if (!!checkBoxStatusData.all && !checkBoxStatus) {
      const modifiedSelectedPatientList =
        patients?.pretaaHealthGetPatientsForCounsellor
          ?.filter((p) => p.id !== id)
          .map((p) => {
            return { id: p.id };
          }) || [];
      newSelectedCheckBoxStatusData.patients = modifiedSelectedPatientList;
      newSelectedCheckBoxStatusData.all = false;
    } else if (checkBoxStatus && !isPatientAlreadySelected) {
      // checked
      const modifiedSelectedPatientList = [...checkBoxStatusData.patients, { id }];

      newSelectedCheckBoxStatusData.patients = modifiedSelectedPatientList;
      newSelectedCheckBoxStatusData.all = false;
      
    } else if (!checkBoxStatus && !!isPatientAlreadySelected) {
      // unchecked
      const modifiedSelectedPatientList = [...checkBoxStatusData.patients.filter((p) => p.id !== id)];
      newSelectedCheckBoxStatusData.patients = modifiedSelectedPatientList;
      newSelectedCheckBoxStatusData.all = false;
    }

    updateSelectedCheckBoxStatus(newSelectedCheckBoxStatusData, setCheckBoxStatusData);
  };

  const handleAllSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxStatus = event.target.checked;
    let newSelectedCheckBoxStatusData = { ...checkBoxStatusData };

    if (checkboxStatus) {
      newSelectedCheckBoxStatusData = {
        ...checkBoxStatusData,
        all: checkboxStatus,
      };
    } else if (!checkboxStatus) {
      newSelectedCheckBoxStatusData = {
        ...checkBoxStatusData,
        all: checkboxStatus,
        patients: [],
      };
    }

    updateSelectedCheckBoxStatus(newSelectedCheckBoxStatusData, setCheckBoxStatusData);
  };
  // ----------------- CHECKBOX ENDS ------------------

  useEffect(() => {
    getPatientsData();
  }, [searchText]);

  useEffect(() => {
    if (checkBoxStatusData.all || checkBoxStatusData.patients.length) {
      callApiToGetSelectedPatientData(checkBoxStatusData);
    }
  }, [checkBoxStatusData]);

  useEffect(() => {
    map = null;
    const mapLoadedInstance = loadMapInstance(googleMapRef);
    map = mapLoadedInstance.map;
    markerClusterer = mapLoadedInstance.markerClusterer;

    eventEmitter.on(config.emitter.geofences.onClickCircle, ({ pageType, data } : GoogleMapCustomInfoWindowDataInterface) => {
      setGoogleMapCustomInfoWindowData({
        pageType, data
      });
    });
    eventEmitter.on(config.emitter.geofences.onClickMarker, ({ pageType, data }: GoogleMapCustomInfoWindowDataInterface) => {
      setGoogleMapCustomInfoWindowData({
        pageType, data
      });
    });
  }, []);

  return (
    <div className=' relative'>
      <TotalLastLocationLayout />
      <div className="pt-8">
          {/* ----------- map search popup -------------- */}
        <MapSearchPopUp
          patientListLoadingState={listLoading}
          showGlobalCheckBox={false}
          showData={showData}
          setShowData={setShowData}
          handleAllSelection={handleAllSelection}
          checkBoxStatusData={checkBoxStatusData}
          setSearchText={setSearchText}
          searchText={searchText}
          patients={patients}
          handleCheckboxSelection={handleCheckboxSelection}
        />
          {/* ----------- map search popup -------------- */}
        <div id="map" className="map relative h-96 lg:h-custom">
          <div ref={googleMapRef} className="w-full h-full"></div>
          {loadingState && <GoogleMapSkeletonLoader />}
        </div>
      </div>
         {!!googleMapCustomInfoWindowData.data?.id && <GoogleMapCustomInfoWindow mapData={googleMapCustomInfoWindowData} onClose={() => {
        setGoogleMapCustomInfoWindowData({ data: null, pageType: null });
      }}/>}
    </div>
  );
}
