/*  */
import { useLazyQuery } from '@apollo/client';
import { config } from 'config';
import { getGeoFencesMapViewQuery } from 'graphql/geofences-map-view-for-patient';
import {
  GeoFencesMapListForPatient,
  GeoFencesMapListForPatientVariables,
  GeoFencingTypes,
  ListGeoFences,
  ListGeoFencesVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './_geo-fencing.scoped.scss';
import { getGeoFencesQuery } from 'graphql/geoFencingList.query';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  CheckedOption,
  FenceAreaType,
  GeoFenceArea,
  GeoFencingPageTypes,
  GoogleMapCircle,
  GoogleMapCustomInfoWindowDataInterface,
  transformToGeoFenceAreaTypeObject,
  updateSelectedCheckBoxStatus,
} from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import { addMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/addMapMarkersAndCluster';
import { removeMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/removeMapMarkersAndCluster';
import CheckBoxGroupForInOutGlobalAndPatients, {
  getGeoFencingDataForSpecifiedTypes,
  getSelectedGeoFencingTypes,
} from 'components/geoFence/CheckBoxGroupForInOutGlobalAndPatients';
import GoogleMapSkeletonLoader from 'screens/Settings/Geofencing/SkeletonLoading/GoogleMapSkeletonLoader';
import { mapLoader } from 'lib/map-loader';
import { getMapOptions } from 'Helper/google-map-geoFance-helper-modules/getMapOptions';
import { geoFencingMapStyle } from './LastLocations';
import { removeInfoWindow } from 'Helper/google-map-geoFance-helper-modules/removeInfoWindow';
import GoogleMapCustomInfoWindow from 'components/GoogleMapCustomInfoWindow';
import { eventEmitter } from 'apiClient';

//  ------------------------ MAP constants --------------------
// eslint-disable-next-line prefer-const
const circles: GoogleMapCircle[] = [];
let bounds: google.maps.LatLngBounds;
let markerClusterer: MarkerClusterer;
const markers: google.maps.Marker[] = [];
let map: google.maps.Map | null;
let infoWindow: google.maps.InfoWindow | null | undefined;
const infoWindows: google.maps.InfoWindow[] = [];
//  ------------------------ MAP constants --------------------

// ********* TO USE loadMapInstance() ->  we need the map  and markerClusterer, to be defined at the top, -> prerequisites ***********
export function loadMapInstance(googleMapRef: any) {
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
        getMapOptions(geoFencingMapStyle, config.map.minZoom, config.map.maxZoom, false, false, true),
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

function getPatientAndGlobalDataIfCheckBoxSelected(checkBoxState: CheckedOption, listData: GeoFencesMapListForPatient) {
  let transFormedData: GeoFenceArea[] = [];

  if (checkBoxState.all) {
    transFormedData = [
      ...transFormedData,
      ...transformToGeoFenceAreaTypeObject(
        listData?.pretaaHealthGetGeoFencesByPatientId?.patientFences || [],
        FenceAreaType.patient,
      ),
    ];
  }
  if (checkBoxState.global) {
    transFormedData = [
      ...transFormedData,
      ...transformToGeoFenceAreaTypeObject(listData?.pretaaHealthListGeoFences || [], FenceAreaType.global),
    ];
  }
  return !!transFormedData.length ? transFormedData : [];
}

export default function GeoFenceMapViewForPatient() {
  const googleMapRef = useRef<any>();

  const params: { id: string } = useParams() as any;
  const [fenceAreaList, setFenceAreaList] = useState<GeoFenceArea[]>([]);

  const [loadingState, setLoadingState] = useState(false);
  const checkboxTypeInRef = useRef<HTMLInputElement | null>(null);
  const checkboxTypeOutRef = useRef<HTMLInputElement | null>(null);
  const checkboxTypeInOutRef = useRef<HTMLInputElement | null>(null);
  const [checkBoxStatusData, setCheckBoxStatusData] = useState<CheckedOption>({
    all: true,
    global: true,
    patients: [],
  });
  const [googleMapCustomInfoWindowData, setGoogleMapCustomInfoWindowData] =
    useState<GoogleMapCustomInfoWindowDataInterface>({ data: null, pageType: null });

  function typeSelected() {
    const selectedTypes: GeoFencingTypes[] = [];
    if (checkboxTypeInRef.current?.checked) {
      selectedTypes.push(GeoFencingTypes.IN);
    }
    if (checkboxTypeOutRef.current?.checked) {
      selectedTypes.push(GeoFencingTypes.OUT);
    }
    if (checkboxTypeInOutRef.current?.checked) {
      selectedTypes.push(GeoFencingTypes.IN_AND_OUT);
    }
    return selectedTypes;
  }

  function updateMapMarkersBasedOnTypesController(
    mapInstance: google.maps.Map,
    checkboxInRef: any,
    checkboxOutRef: any,
    checkboxInOutRef: any,
    geoFenceData: GeoFenceArea[],
    getSelectedTypesCallBack: (
      checkboxTypeInRef: any,
      checkboxTypeOutRef: any,
      checkboxTypeInOutRef: any,
    ) => GeoFencingTypes[],
    markerClustererRef: MarkerClusterer,
    markersRef: google.maps.Marker[],
    callBack: (type: GeoFencingTypes[], geoFenceData: GeoFenceArea[]) => GeoFenceArea[],
    setLoadingStateCallBack: React.Dispatch<React.SetStateAction<boolean>>,
    circlesRef: GoogleMapCircle[],
  ) {
    setLoadingStateCallBack(true);

    const selectedGeoFenceTypeList = getSelectedTypesCallBack(checkboxInRef, checkboxOutRef, checkboxInOutRef);
    const geoFenceListOfSpecifiedType = callBack(selectedGeoFenceTypeList, geoFenceData);

    if (markersRef?.length) {
      removeMapMarkersAndCluster(markersRef, markerClustererRef, circlesRef);
      removeInfoWindow(infoWindows);
    }

    bounds = new google.maps.LatLngBounds();

    const addMapMarkersResponse = addMapMarkersAndCluster(
      infoWindows,
      mapInstance,
      geoFenceListOfSpecifiedType,
      markerClustererRef,
      markersRef,
      bounds,
      GeoFencingPageTypes.GeoFenceForPatient,
      circlesRef,
      params?.id,
    );

    infoWindows.push(...addMapMarkersResponse.infoWindows);

    mapInstance.setCenter(bounds.getCenter());
    mapInstance.fitBounds(bounds);

    setLoadingStateCallBack(false);
  }

  // ------------------------ API START -----------------------------

  const [getGeoFenceList, { data: fenceDataByPatientId }] = useLazyQuery<
    GeoFencesMapListForPatient,
    GeoFencesMapListForPatientVariables
  >(getGeoFencesMapViewQuery, {
    variables: {
      patientId: String(params.id),
    },
    onCompleted: (d) => {
      let list: GeoFenceArea[] = [];
      if (d.pretaaHealthListGeoFences?.length) {
        list = transformToGeoFenceAreaTypeObject(d.pretaaHealthListGeoFences, FenceAreaType.global);
      }

      let patientList: GeoFenceArea[] = [];
      if (d.pretaaHealthGetGeoFencesByPatientId?.patientFences?.length) {
        patientList = transformToGeoFenceAreaTypeObject(
          d.pretaaHealthGetGeoFencesByPatientId?.patientFences,
          FenceAreaType.patient,
        );
      }

      const updatedList = [...list.concat(patientList)];
      setFenceAreaList(updatedList);

      if (!map) {
        const mapLoadedInstance = loadMapInstance(googleMapRef);
        map = mapLoadedInstance.map;
        markerClusterer = mapLoadedInstance.markerClusterer;
      }

      updateMapMarkersBasedOnTypesController(
        map as google.maps.Map,
        checkboxTypeInRef,
        checkboxTypeInOutRef,
        checkboxTypeInOutRef,
        updatedList,
        getSelectedGeoFencingTypes,
        markerClusterer,
        markers,
        getGeoFencingDataForSpecifiedTypes,
        setLoadingState,
        circles,
      );
      setLoadingState(false);
    },
    onError: (e) => catchError(e, true),
  });
  // On Global fence call
  const [getGlobalGeoFences] = useLazyQuery<ListGeoFences, ListGeoFencesVariables>(getGeoFencesQuery, {
    variables: {
      take: config.largeDefaultTake,
    },
    onCompleted: (d) => {
      if (d.pretaaHealthListGeoFences) {
        const list: GeoFenceArea[] = transformToGeoFenceAreaTypeObject(
          d.pretaaHealthListGeoFences,
          FenceAreaType.global,
        );

        if (list.length) {
          setFenceAreaList(list);
        }

        if (!map) {
          const mapLoadedInstance = loadMapInstance(googleMapRef);
          map = mapLoadedInstance.map;
          markerClusterer = mapLoadedInstance.markerClusterer;
        }
        updateMapMarkersBasedOnTypesController(
          map as google.maps.Map,
          checkboxTypeInRef,
          checkboxTypeInOutRef,
          checkboxTypeInOutRef,
          list,
          getSelectedGeoFencingTypes,
          markerClusterer,
          markers,
          getGeoFencingDataForSpecifiedTypes,
          setLoadingState,
          circles,
        );

        setLoadingState(false);
      }
    },
  });
  // ------------------------ API END -----------------------------

  const handleAllSelection = (event: React.ChangeEvent<HTMLInputElement>, type: 'global' | 'all') => {
    const checkboxStatus = event.target.checked;
    let newSelectedCheckBoxStatusData: CheckedOption = { ...checkBoxStatusData };

    if (type === 'all' && !!checkboxStatus) {
      newSelectedCheckBoxStatusData = {
        ...checkBoxStatusData,
        all: checkboxStatus,
      };
    } else if (type === 'all' && !checkboxStatus) {
      newSelectedCheckBoxStatusData = {
        ...checkBoxStatusData,
        all: checkboxStatus,
        patients: [],
      };
    } else if (type === 'global') {
      newSelectedCheckBoxStatusData = {
        ...checkBoxStatusData,
        global: checkboxStatus,
      };
    }

    updateSelectedCheckBoxStatus(newSelectedCheckBoxStatusData, setCheckBoxStatusData);
    if (fenceDataByPatientId?.pretaaHealthListGeoFences && fenceDataByPatientId?.pretaaHealthGetGeoFencesByPatientId) {
      updateMapMarkersBasedOnTypesController(
        map as google.maps.Map,
        checkboxTypeInRef,
        checkboxTypeOutRef,
        checkboxTypeInOutRef,
        getPatientAndGlobalDataIfCheckBoxSelected(newSelectedCheckBoxStatusData, fenceDataByPatientId),
        getSelectedGeoFencingTypes,
        markerClusterer,
        markers,
        getGeoFencingDataForSpecifiedTypes,
        setLoadingState,
        circles,
      );
    }
  };

  // CALLING API -------------------------
  function callApiToGetSelectedPatientData(id: string | undefined) {
    setLoadingState(true);
    if (id?.length) {
      getGeoFenceList();
    } else {
      getGlobalGeoFences();
    }
  }

  useEffect(() => {
    map = null;
    const mapLoadedInstance = loadMapInstance(googleMapRef);
    map = mapLoadedInstance.map;
    markerClusterer = mapLoadedInstance.markerClusterer;
    callApiToGetSelectedPatientData(params?.id);
  }, [params?.id]);

  useEffect(() => {
    eventEmitter.on(
      config.emitter.geofences.onClickCircle,
      ({ pageType, data }: GoogleMapCustomInfoWindowDataInterface) => {
        const formattedData = {
          ...data,
          multipleData: data?.multipleData?.filter((f) => typeSelected().includes(f.type)) || [],
        } as GeoFenceArea;
        setGoogleMapCustomInfoWindowData(() => ({
          pageType,
          data: formattedData,
        }));
      },
    );
    eventEmitter.on(
      config.emitter.geofences.onClickMarker,
      ({ pageType, data }: GoogleMapCustomInfoWindowDataInterface) => {
        const formattedData = {
          ...data,
          multipleData: data?.multipleData?.filter((f) => typeSelected().includes(f.type)),
        } as GeoFenceArea;
        setGoogleMapCustomInfoWindowData({
          pageType,
          data: formattedData,
        });
      },
    );
  }, []);

  return (
    <section className="pt-0 ">
      <div
        id="map"
        className="map-wrapper map relative">
        <div
          ref={googleMapRef}
          className="w-full h-full"></div>
        {loadingState && <GoogleMapSkeletonLoader />}
      </div>

      {map && (
        <CheckBoxGroupForInOutGlobalAndPatients
          circlesRef={circles}
          mapInstance={map as google.maps.Map}
          selectedCheckBoxStatusData={checkBoxStatusData}
          geoFenceAreaListData={
            fenceDataByPatientId
              ? getPatientAndGlobalDataIfCheckBoxSelected(checkBoxStatusData, fenceDataByPatientId)
              : fenceAreaList
          }
          markerClustererRef={markerClusterer}
          markersRef={markers}
          setLoadingState={setLoadingState}
          checkboxTypeInRef={checkboxTypeInRef}
          checkboxTypeOutRef={checkboxTypeOutRef}
          checkboxTypeInOutRef={checkboxTypeInOutRef}
          getSelectedGeoFencingTypesCallBack={getSelectedGeoFencingTypes}
          getGeoFencingDataForSpecifiedTypesCallBack={getGeoFencingDataForSpecifiedTypes}
          updateMapMarkersBasedOnTypes={updateMapMarkersBasedOnTypesController}
          globalAndPatientCheckBoxController={{
            showGlobalAndPatient: !!params?.id?.length,
            handleAllSelectionCallBack: handleAllSelection,
          }}
        />
      )}
      {!!googleMapCustomInfoWindowData.data?.id && (
        <GoogleMapCustomInfoWindow
          mapData={googleMapCustomInfoWindowData}
          onClose={() => {
            setGoogleMapCustomInfoWindowData({ data: null, pageType: null });
          }}
        />
      )}
    </section>
  );
}
