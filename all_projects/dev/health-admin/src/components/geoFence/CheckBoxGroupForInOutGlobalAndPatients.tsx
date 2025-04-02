import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GeoFencingTypes } from 'health-generatedTypes';
import React, { useCallback, useEffect } from 'react';
import { CheckedOption, FenceAreaType, GeoFenceArea, getColorBasedOnFenceTypes, GoogleMapCircle } from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';

interface GlobalAndPatientCheckBoxControllerInterface {
  showGlobalAndPatient: boolean;
  handleAllSelectionCallBack: (event: React.ChangeEvent<HTMLInputElement>, type: 'global' | 'all') => void;
}
interface CheckBoxGroupForInOutGlobalAndPatientsInterface {
  circlesRef: GoogleMapCircle[],
  globalAndPatientCheckBoxController?: GlobalAndPatientCheckBoxControllerInterface;
  mapInstance: google.maps.Map;
  selectedCheckBoxStatusData: CheckedOption;
  geoFenceAreaListData: GeoFenceArea[];
  markerClustererRef: MarkerClusterer;
  markersRef: google.maps.Marker[];
  checkboxTypeInRef: any;
  checkboxTypeOutRef: any;
  checkboxTypeInOutRef: any;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  getSelectedGeoFencingTypesCallBack: (checkboxTypeInRef: any, checkboxTypeOutRef: any, checkboxTypeInOutRef: any) => GeoFencingTypes[];
  getGeoFencingDataForSpecifiedTypesCallBack: (typeList: GeoFencingTypes[], geoFenceData: GeoFenceArea[]) => GeoFenceArea[];
  updateMapMarkersBasedOnTypes: (
    mapInstance: google.maps.Map,
    checkboxInRef: any,
    checkboxOutRef: any,
    checkboxInOutRef: any,
    geoFenceData: GeoFenceArea[],
    getSelectedTypesCallBack: (checkboxTypeInRef: any, checkboxTypeOutRef: any, checkboxTypeInOutRef: any) => GeoFencingTypes[],
    markerClustererRef: MarkerClusterer,
    markersRef: google.maps.Marker[],
    callBack: (type: GeoFencingTypes[], geoFenceData: GeoFenceArea[]) => GeoFenceArea[],
    setLoadingStateCallBack: React.Dispatch<React.SetStateAction<boolean>>,
    circlesRef: GoogleMapCircle[],
  ) => void;
}

export function getGeoFencingDataForSpecifiedTypes(typeList: GeoFencingTypes[], geoFenceData: GeoFenceArea[]) {
  const [type1, type2, type3] = typeList;
  
  return geoFenceData?.filter((g) => type1 === g.type || type2 === g.type || type3 === g.type);
}

export function getSelectedGeoFencingTypes(checkboxTypeInRef: any, checkboxTypeOutRef: any, checkboxTypeInOutRef: any) {
  const typesList: GeoFencingTypes[] = [];

  if (checkboxTypeInRef.current?.checked) {
    typesList.push(GeoFencingTypes.IN);
  }

  if (checkboxTypeOutRef.current?.checked) {
    typesList.push(GeoFencingTypes.OUT);
  }

  if (checkboxTypeInOutRef.current?.checked) {
    typesList.push(GeoFencingTypes.IN_AND_OUT);
  }
  return typesList;
}

export default function CheckBoxGroupForInOutGlobalAndPatients({
  circlesRef,
  globalAndPatientCheckBoxController,
 
  // selected patients data of the parent
  selectedCheckBoxStatusData,

  // total data of geoFance
  geoFenceAreaListData,

   // map ref ------
  mapInstance,
   
  //  Marker cluster ref --------
  markerClustererRef,

  // map marker ref-----
  markersRef,

  // checkbox ref ------- IN, OUT, IN-OUT ----
  checkboxTypeInRef,
  checkboxTypeOutRef,
  checkboxTypeInOutRef,
  // -------------------

  setLoadingState,

  getSelectedGeoFencingTypesCallBack,
  getGeoFencingDataForSpecifiedTypesCallBack,
  updateMapMarkersBasedOnTypes,
}: CheckBoxGroupForInOutGlobalAndPatientsInterface) {


  const setCheckedStatusForCheckBoxGroupForInOutGlobalAndPatients = useCallback(function () {
    if (!!checkboxTypeInRef.current &&
      !!checkboxTypeOutRef.current &&
      !!checkboxTypeInOutRef.current
    ) {
      checkboxTypeInRef.current.checked = true;
      checkboxTypeOutRef.current.checked = true;
      checkboxTypeInOutRef.current.checked = true;
    }
  }, [checkboxTypeInOutRef, checkboxTypeInRef, checkboxTypeOutRef]);

  useEffect(() => {
      setCheckedStatusForCheckBoxGroupForInOutGlobalAndPatients();
  }, [checkboxTypeInRef, checkboxTypeOutRef, checkboxTypeInOutRef, setCheckedStatusForCheckBoxGroupForInOutGlobalAndPatients]);
  
  return (
    <section className={`flex justify-center mt-4 md:mt-8 items-center
    ${globalAndPatientCheckBoxController && globalAndPatientCheckBoxController.showGlobalAndPatient && window.innerWidth <= 767 ? 
      'flex-col space-x-0 md:space-y-0 space-y-3' : 'space-x-4 flex-row md:space-y-0 space-y-4'}`}>
      <div className="flex flex-row justify-center sm:items-center items-start space-x-2 sm:space-x-4 ">
        <div className="flex items-center">
          <input
            id="in-checkbox"
            type="checkbox"
            ref={checkboxTypeInRef}
            onChange={() =>
              updateMapMarkersBasedOnTypes(
                mapInstance,
                checkboxTypeInRef,
                checkboxTypeOutRef,
                checkboxTypeInOutRef,
                geoFenceAreaListData,
                getSelectedGeoFencingTypesCallBack,
                markerClustererRef,
                markersRef,
                getGeoFencingDataForSpecifiedTypesCallBack,
                setLoadingState,
                circlesRef
              )
            }
            style={{ color: getColorBasedOnFenceTypes(GeoFencingTypes.IN), borderColor: getColorBasedOnFenceTypes(GeoFencingTypes.IN) }}
            className="w-3 h-3 md:w-5 md:h-5 bg-white b border-2 rounded 
        focus:ring-white dark:focus:ring-green focus:ring-0 cursor-pointer"
          />
          <label htmlFor="in-checkbox" className="ml-1 sm:ml-2 text-xs sm:text-xsm font-medium text-gray-900 cursor-pointer">
            {GeoFencingTypes.IN}
          </label>
        </div>

        <div className="flex items-center m-0">
          <input
            id="out-checkbox"
            type="checkbox"
            ref={checkboxTypeOutRef}
            onChange={() =>
              updateMapMarkersBasedOnTypes(
                mapInstance,
                checkboxTypeInRef,
                checkboxTypeOutRef,
                checkboxTypeInOutRef,
                geoFenceAreaListData,
                getSelectedGeoFencingTypesCallBack,
                markerClustererRef,
                markersRef,
                getGeoFencingDataForSpecifiedTypesCallBack,
                setLoadingState,
                circlesRef
              )
            }
            style={{ color: getColorBasedOnFenceTypes(GeoFencingTypes.OUT), borderColor: getColorBasedOnFenceTypes(GeoFencingTypes.OUT) }}
            className="w-3 h-3 md:w-5 md:h-5 bg-white  border-2 rounded 
        focus:ring-white dark:focus:ring-black focus:ring-0 cursor-pointer"
          />
          <label htmlFor="out-checkbox" className="ml-1 sm:ml-2 text-xs sm:text-xsm font-medium text-gray-900 cursor-pointer">
            {GeoFencingTypes.OUT}
          </label>
        </div>

        <div className="flex items-center m-0">
          <input
            id="in-out-checkbox"
            type="checkbox"
            ref={checkboxTypeInOutRef}
            onChange={() =>
              updateMapMarkersBasedOnTypes(
                mapInstance,
                checkboxTypeInRef,
                checkboxTypeOutRef,
                checkboxTypeInOutRef,
                geoFenceAreaListData,
                getSelectedGeoFencingTypesCallBack,
                markerClustererRef,
                markersRef,
                getGeoFencingDataForSpecifiedTypesCallBack,
                setLoadingState,
                circlesRef
              )
            }
            style={{ color: getColorBasedOnFenceTypes(GeoFencingTypes.IN_AND_OUT), borderColor: getColorBasedOnFenceTypes(GeoFencingTypes.IN_AND_OUT) }}
            className="w-3 h-3 md:w-5 md:h-5 bg-white border-2 rounded 
        focus:ring-white dark:focus:ring-red-800 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="in-out-checkbox" className="ml-1 sm:ml-2 text-xs sm:text-xsm font-medium text-gray-900 cursor-pointer">
            {GeoFencingTypes.IN_AND_OUT.replaceAll('_', ' ')}
          </label>
        </div>
      </div>

      {globalAndPatientCheckBoxController && globalAndPatientCheckBoxController.showGlobalAndPatient &&
       <div className='flex flex-row justify-center sm:items-center items-start space-x-2 sm:space-x-4 mt-3'>
      {/* GLOBAL */}
      <div className="flex items-center">
        <input
          id="global-checkbox"
          type="checkbox"
          value="GLOBAL"
          checked={selectedCheckBoxStatusData.global}
            onChange={(event) => globalAndPatientCheckBoxController.handleAllSelectionCallBack(event, 'global')}
            style={{ color: getColorBasedOnFenceTypes(FenceAreaType.global), borderColor: getColorBasedOnFenceTypes(FenceAreaType.global) }}
          className="w-3 h-3 md:w-5 md:h-5 opacity-2  border-2 rounded 
      focus:ring-white dark:focus:ring-orange focus:ring-0 cursor-pointer"
        />
        <label htmlFor="global-checkbox" className="ml-1 sm:ml-2 text-xs sm:text-xsm font-medium text-gray-900 cursor-pointer">
          Global Geofences
        </label>
      </div>

      {/* PATIENT */}
      <div className="flex items-center">
        <input
          id="patient-checkbox"
          type="checkbox"
          value="PATIENT"
          checked={selectedCheckBoxStatusData.all || !!selectedCheckBoxStatusData.patients.length}
            onChange={(event) => globalAndPatientCheckBoxController.handleAllSelectionCallBack(event, 'all')}
            style={{ color: getColorBasedOnFenceTypes(FenceAreaType.patient), borderColor: getColorBasedOnFenceTypes(FenceAreaType.patient) }}
          className="w-3 h-3 md:w-5 md:h-5 border-2 rounded 
      focus:ring-white dark:focus:ring-red-300 focus:ring-0 cursor-pointer"
        />
        <label htmlFor="patient-checkbox" className="ml-1 sm:ml-2 text-xs sm:text-xsm font-medium text-gray-900 cursor-pointer">
          Patient Geofences
        </label>
      </div>
      </div>}
    </section>
  );
}
