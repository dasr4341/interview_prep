/*  */
import { useLazyQuery } from '@apollo/client';
import { config } from 'config';
import {
  GeoFencesMapListForPatient_pretaaHealthGetGeoFencesByPatientId_patientFences,
  GeoFencesMapListForPatient_pretaaHealthListGeoFences,
  GeoFencingTypes,
  GetHealthFilterGeoFences,
  GetHealthFilterGeoFencesVariables,
  GetHealthFilterGeoFences_pretaaHealthFilterGeoFences,
  GetHealthFilterPatientCoordinates_pretaaHealthFilterPatientCoordinates,
  GetPatientCoordinates_pretaaHealthGetPatientCoordinates,
  GetPatientsForLocations,
  GetPatientsForLocationsVariables,
  ListGeoFences_pretaaHealthListGeoFences,
} from 'health-generatedTypes';
import { useEffect, useRef, useState } from 'react';
import './_total-geo-fencing.scoped.scss';
import { getHealthFilterGeoFences } from 'graphql/getHealthFilterGeoFences.query';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { mapLoader } from 'lib/map-loader';
import GeoFencingListLayout from './TotalGeoFencingListLayout';
import { getPatientQuery } from 'graphql/getPatients.query';
import { geoFencingMapStyle } from 'screens/Patient/GeoFencing/LastLocations';
import GoogleMapSkeletonLoader from '../Geofencing/SkeletonLoading/GoogleMapSkeletonLoader';
import catchError from 'lib/catch-error';
import { addMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/addMapMarkersAndCluster';
import { removeMapMarkersAndCluster } from 'Helper/google-map-geoFance-helper-modules/removeMapMarkersAndCluster';
import CheckBoxGroupForInOutGlobalAndPatients, {
  getGeoFencingDataForSpecifiedTypes,
  getSelectedGeoFencingTypes,
} from 'components/geoFence/CheckBoxGroupForInOutGlobalAndPatients';
import { getMapOptions } from 'Helper/google-map-geoFance-helper-modules/getMapOptions';
import MapSearchPopUp from 'components/geoFence/MapSearchPopUp';
import { fullNameController } from 'components/fullName';
import { removeInfoWindow } from 'Helper/google-map-geoFance-helper-modules/removeInfoWindow';
import GoogleMapCustomInfoWindow from 'components/GoogleMapCustomInfoWindow';
import { eventEmitter } from 'apiClient';

export interface GoogleMapCircle extends google.maps.Circle {
  id: string;
}

export enum GeoFencingPageTypes {
  TotalGeoFence = 'TotalGeoFence',
  TotalLastKnownLocation = 'TotalLastKnownLocation',
  GeoFenceForPatient = 'GeoFenceForPatient',
  LastKnownLocation = 'LastKnownLocation',
  EventGeoFence = 'EventGeoFence',
}

export enum FenceAreaType {
  global = 'global',
  patient = 'patient',
}
export interface MultipleGeoFenceDataInterface {
  name: string;
  location: string;
  radius: number;
  areaType: FenceAreaType;
  status: boolean;
  type: GeoFencingTypes;
  createdAt?: string;
  updatedAt?: string;
  id: string;
}
export interface GoogleMapCustomInfoWindowDataInterface {
  pageType: GeoFencingPageTypes | null;
  data: GeoFenceArea | null;
}
export interface GeoFenceArea {
  multipleData?: MultipleGeoFenceDataInterface[];
  id: string;
  name?: string;
  location?: string;
  radius?: number;
  status: boolean;
  patientId?: string | null;
  type: GeoFencingTypes;
  latitude: number;
  longitude: number;
  areaType: FenceAreaType;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckedOption {
  all: boolean;
  global?: boolean;
  patients: {
    id: string;
  }[];
}

export interface LoadMapInstanceInterface {
  fenceData: GeoFenceArea[];
  checkboxTypeInRef: any;
  checkboxTypeOutRef: any;
  checkboxTypeInOutRef: any;
  getSelectedGeoFencingTypes: (
    checkboxTypeInRef: any,
    checkboxTypeOutRef: any,
    checkboxTypeInOutRef: any,
  ) => GeoFencingTypes[];
  markers: google.maps.Marker[];
  getGeoFencingDataForSpecifiedTypes: (typeList: GeoFencingTypes[], geoFenceData: GeoFenceArea[]) => GeoFenceArea[];
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  callBack: (
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
  ) => void;
}

export function updateSelectedCheckBoxStatus(
  newData: CheckedOption,
  callBack: React.Dispatch<React.SetStateAction<CheckedOption>>,
) {
  callBack(newData);
}

export function getColorBasedOnId(id: string) {
  return `#${id.substring(0, 6)}`;
}

export function getColorBasedOnFenceTypes(type: GeoFencingTypes | FenceAreaType) {
  if (type === GeoFencingTypes.IN) {
    return '#03BFFB';
  } else if (type === GeoFencingTypes.OUT) {
    return '#FFCC00';
  } else if (type === GeoFencingTypes.IN_AND_OUT) {
    return '#08a30b';
  } else if (type === FenceAreaType.global) {
    return '#ED6513';
  } else if (type === FenceAreaType.patient) {
    return '#ff54a4';
  } else {
    return '#000';
  }
}

export function transformToGeoFenceAreaTypeObject(
  list:
    | GetHealthFilterGeoFences_pretaaHealthFilterGeoFences[]
    | GeoFencesMapListForPatient_pretaaHealthListGeoFences[]
    | GeoFencesMapListForPatient_pretaaHealthGetGeoFencesByPatientId_patientFences[]
    | ListGeoFences_pretaaHealthListGeoFences[]
    | GetHealthFilterPatientCoordinates_pretaaHealthFilterPatientCoordinates[]
    | GetPatientCoordinates_pretaaHealthGetPatientCoordinates[],
  areaType: FenceAreaType,
  status?: boolean,
) {
  const output: GeoFenceArea[] = [];

  const helper: {
    [point: string]: MultipleGeoFenceDataInterface[];
  } = {};

  for (let i = 0; i < list.length; i++) {
    const e = list[i] as any;

    const multipleData: MultipleGeoFenceDataInterface[] = [];

    const currentPoint = e.latitude + '-' + e.longitude;

    if (!!helper[currentPoint]?.length) {
      helper[currentPoint].unshift({
        id: e?.id,
        name: e?.name || (e?.firstName && fullNameController(e?.firstName, e?.lastName)) || undefined,
        location: e?.location || e?.lastLocationAddress,
        radius: e?.radius,
        areaType,
        status: status ? status : e?.status || false,
        type: e?.type,
        createdAt: e?.createdAt || null,
        updatedAt: e?.updatedAt || null,
      });
      multipleData.push(...helper[currentPoint]);
    } else {
      for (let index = i - 1; index >= 0; index--) {
        const prevElement = output[index] as any;
        if (e.latitude === prevElement.latitude || e.longitude === prevElement.longitude) {
          if (prevElement?.multipleData?.length) {
            multipleData.push(...prevElement.multipleData);
            helper[currentPoint] = [...prevElement.multipleData];
          } else {
            multipleData.push({
              id: prevElement?.id,
              name:
                prevElement?.name ||
                (prevElement?.firstName && fullNameController(prevElement?.firstName, prevElement?.lastName)) ||
                undefined,
              location: prevElement?.location || prevElement?.lastLocationAddress,
              radius: prevElement?.radius,
              areaType,
              status: status ? status : prevElement?.status || false,
              type: prevElement?.type,
              createdAt: prevElement?.createdAt || null,
              updatedAt: prevElement?.updatedAt || null,
            });
            helper[currentPoint] = [
              {
                id: prevElement?.id,
                name:
                  prevElement?.name ||
                  (prevElement?.firstName && fullNameController(prevElement?.firstName, prevElement?.lastName)) ||
                  undefined,
                location: prevElement?.location || prevElement?.lastLocationAddress,
                radius: prevElement?.radius,
                areaType,
                status: status ? status : prevElement?.status || false,
                type: prevElement?.type,
                createdAt: prevElement?.createdAt || null,
                updatedAt: prevElement?.updatedAt || null,
              },
            ];
          }
          break;
        }
      }
      if (!!multipleData.length) {
        multipleData.unshift({
          id: e?.id,
          name: e?.name || (e?.firstName && fullNameController(e?.firstName, e?.lastName)) || undefined,
          location: e?.location || e?.lastLocationAddress,
          radius: e?.radius,
          areaType,
          status: status ? status : e?.status || false,
          type: e?.type,
          createdAt: e?.createdAt || null,
          updatedAt: e?.updatedAt || null,
        });
      }
    }

    output.push({
      multipleData,
      id: e?.id,
      name: e?.name || (e?.firstName && fullNameController(e?.firstName, e?.lastName)) || undefined,
      location: e?.location || e?.lastLocationAddress,
      radius: e?.radius,
      patientId: e?.patientId || e?.userId || undefined,
      type: e?.type,
      latitude: e?.latitude,
      longitude: e?.longitude,
      areaType,
      createdAt: e?.createdAt || null,
      updatedAt: e?.updatedAt || null,
      status: status ? status : e?.status || false,
    });
  }
  return output as GeoFenceArea[];
}

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

export default function TotalGeoFencingView() {
  const googleMapRef = useRef<any>();

  const checkboxTypeInRef = useRef<HTMLInputElement | null>(null);
  const checkboxTypeOutRef = useRef<HTMLInputElement | null>(null);
  const checkboxTypeInOutRef = useRef<HTMLInputElement | null>(null);

  const [searchText, setSearchText] = useState('');
  const [checkBoxStatusData, setCheckBoxStatusData] = useState<CheckedOption>({
    all: false,
    global: true,
    patients: [],
  });
  const [showData, setShowData] = useState(true);
  const [loadingState, setLoadingState] = useState(false);
  const [geoFenceAreaDataList, setGeoFenceAreaDataList] = useState<GeoFenceArea[]>([]);
  const [googleMapCustomInfoWindowData, setGoogleMapCustomInfoWindowData] =
    useState<GoogleMapCustomInfoWindowDataInterface>({ data: null, pageType: null });

  function updateMapMarkersBasedOnTypes(
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
      GeoFencingPageTypes.TotalGeoFence,
      circlesRef,
    );

    infoWindows.push(...addMapMarkersResponse.infoWindows);

    mapInstance.setCenter(bounds.getCenter());
    mapInstance.fitBounds(bounds);

    setLoadingStateCallBack(false);
  }
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

  // ------------------------ API START -----------------------------
  const [getAllGeoFencesDataCallBack] = useLazyQuery<GetHealthFilterGeoFences, GetHealthFilterGeoFencesVariables>(
    getHealthFilterGeoFences,
    {
      onCompleted: (d) => {
        const list: GeoFenceArea[] = transformToGeoFenceAreaTypeObject(
          d.pretaaHealthFilterGeoFences || [],
          FenceAreaType.patient,
        );
        setGeoFenceAreaDataList(list);

        try {
          if (!map) {
            loadMapInstance(googleMapRef);
          }
          updateMapMarkersBasedOnTypes(
            map as google.maps.Map,
            checkboxTypeInRef,
            checkboxTypeOutRef,
            checkboxTypeInOutRef,
            list,
            getSelectedGeoFencingTypes,
            markerClusterer,
            markers,
            getGeoFencingDataForSpecifiedTypes,
            setLoadingState,
            circles,
          );
        } catch (e) {
          console.error('facing an error ..', e);
        } finally {
          setLoadingState(false);
        }
      },
      onError: (e) => catchError(e),
    },
  );

  const [getPatientsData, { data: patients, loading: listLoading }] = useLazyQuery<
    GetPatientsForLocations,
    GetPatientsForLocationsVariables
  >(getPatientQuery, {
    variables: {
      search: searchText,
      take: 20,
    },
    onError: (e) => catchError(e),
  });
  // ----------------------- API ENDS -----------------------------

  // ----------------- CHECKBOX START ------------------
  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const checkBoxStatus = event.target.checked;
    const newSelectedCheckBoxStatusData = { ...checkBoxStatusData };

    // if all is selected and at that case, user is trying to select any patient
    if (!!checkBoxStatusData.all) {
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
    }

    updateSelectedCheckBoxStatus(newSelectedCheckBoxStatusData, setCheckBoxStatusData);
  };

  const handleAllSelection = (event: React.ChangeEvent<HTMLInputElement>, type: 'global' | 'all') => {
    const checkboxStatus = event.target.checked;
    let newSelectedCheckBoxStatusData = { ...checkBoxStatusData };

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
  };
  // ----------------- CHECKBOX ENDS ------------------

  // CALLING API -------------------------
  function callApiToGetSelectedPatientData(checkBoxState: CheckedOption) {
    setLoadingState(true);
    getAllGeoFencesDataCallBack({
      variables: {
        all: checkBoxStatusData.all ? true : false,
        global: checkBoxState.global || false,
        patients: checkBoxState.all ? [] : checkBoxState.patients.map((p) => p.id),
      },
    });
  }

  useEffect(() => {
    getPatientsData();
  }, [searchText]);

  useEffect(() => {
    if (patients?.pretaaHealthGetPatientsForCounsellor) {
      callApiToGetSelectedPatientData(checkBoxStatusData);
    }
  }, [checkBoxStatusData, patients?.pretaaHealthGetPatientsForCounsellor]);

  useEffect(() => {
    map = null;
    loadMapInstance(googleMapRef);
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
    <div className="relative">
      <GeoFencingListLayout />

      <div className="pt-8 flex flex-col justify-center bg-gray-50">
        {/* ----------- map search popup -------------- */}
        <MapSearchPopUp
          patientListLoadingState={listLoading}
          showGlobalCheckBox={true}
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

        <div
          id="map"
          className="map relative h-96 lg:h-custom">
          <div
            ref={googleMapRef}
            className="w-full h-full"></div>
          {loadingState && <GoogleMapSkeletonLoader />}
        </div>

        {map && (
          <CheckBoxGroupForInOutGlobalAndPatients
            circlesRef={circles}
            mapInstance={map}
            selectedCheckBoxStatusData={checkBoxStatusData}
            geoFenceAreaListData={geoFenceAreaDataList}
            markerClustererRef={markerClusterer}
            markersRef={markers}
            setLoadingState={setLoadingState}
            checkboxTypeInRef={checkboxTypeInRef}
            checkboxTypeOutRef={checkboxTypeOutRef}
            checkboxTypeInOutRef={checkboxTypeInOutRef}
            getSelectedGeoFencingTypesCallBack={getSelectedGeoFencingTypes}
            getGeoFencingDataForSpecifiedTypesCallBack={getGeoFencingDataForSpecifiedTypes}
            updateMapMarkersBasedOnTypes={updateMapMarkersBasedOnTypes}
          />
        )}
      </div>

      {!!googleMapCustomInfoWindowData.data?.id && (
        <GoogleMapCustomInfoWindow
          mapData={googleMapCustomInfoWindowData}
          onClose={() => {
            setGoogleMapCustomInfoWindowData({ data: null, pageType: null });
          }}
        />
      )}
    </div>
  );
}
