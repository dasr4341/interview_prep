import Search from 'components/icons/Search';
import { GetPatientsForLocations, GetPatientsForLocations_pretaaHealthGetPatientsForCounsellor } from 'health-generatedTypes';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './_mapSearch-popUp.scoped.scss';
import { CheckedOption, FenceAreaType, getColorBasedOnFenceTypes, getColorBasedOnId } from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import MapSearchPopUpSkeletonLoader from './skeletonLoader/MapSearchPopUpSkeletonLoader';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import CloseIcon from 'components/icons/CloseIcon';
import { Tooltip } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';

export default function MapSearchPopUp({
  patientListLoadingState,
  showGlobalCheckBox,
  showData,
  setShowData,
  handleAllSelection,
  checkBoxStatusData,
  setSearchText,
  searchText,
  patients,
  handleCheckboxSelection
}: {
  patientListLoadingState: boolean,
  showGlobalCheckBox: boolean,
  showData: boolean;
  setShowData: React.Dispatch<React.SetStateAction<boolean>>;
  handleAllSelection: (event: React.ChangeEvent<HTMLInputElement>, type: 'global' | 'all') => void;
  checkBoxStatusData: CheckedOption;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  patients: GetPatientsForLocations | undefined;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void
}) {
  const [searchFieldData, setSearchFieldData] = useDebouncedState('', 200);
  const location = useLocation();
  const mapPopupCircleOpacity = location.pathname.includes(routes.geofencing.totalLastLocation.match) ? 1 : 0.4;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showCrossButton, setShowCrossButton] = useState<boolean>(false);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const searchData = event.target.value;
    if (searchData.trim().length === 0) {
      setSearchFieldData('');
      setShowCrossButton(false);
    } else if (searchData && searchData.trim().length >= 3) {
      setSearchFieldData(searchData.trim());
    } else if (searchData.trim().length > 0) {
      setShowCrossButton(true);
    }
  };

  useEffect(() => {
    setSearchText(searchFieldData);
    // 
  }, [searchFieldData]);

  const clearValue = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSearchText('');
      setSearchFieldData('');
      setShowCrossButton(false);
    }
  };


  return (
    <div className="details h-70 w-64 p-4">
      <div className="flex flex-col items-center">
        <Tooltip
          multiline
          label="Minimum three characters are required to search"
          position="top"
          withArrow
          arrowSize={8}
          arrowPosition="side"
          events={{ hover: true, focus: true, touch: false }}
          color="gray">
          <div className="flex rounded-xl border py-2 px-2 items-center space-x-2">
            <div className='flex items-center justify-between'>
              <input
                placeholder="Search..."
                className={`${showCrossButton ? 'w-36' : 'w-40'} p-0 border-none mx-2 focus:outline-none bg-transparent map-seach`}
                name="searchValue"
                onChange={changeHandler}
                ref={inputRef}
              />
              {showCrossButton && (
                <button type='button' onClick={clearValue}>
                  <CloseIcon className=" w-4 h-4 bg-gray-200 p-1 rounded-full cursor-pointer" />
                </button>
              )}
            </div>

            <Search className="w-3 h-3" />
          </div>
        </Tooltip>
      </div>
      {showData && (
        <div className="overflow-y-auto">
          <div className="overflow-y-auto listContainer m-0 pr-4">
            {/* ------------------------ GLOBAL ------------------------ */}
            {showGlobalCheckBox && <div className="inline-flex items-center mt-2 w-full justify-between">
              <input
                type="checkbox"
                className="w-4ss h-4 m-2 rounded"
                checked={checkBoxStatusData.global}
                onChange={(event: any) => handleAllSelection(event, 'global')}
              />
              <label className="mr-20">Global</label>
              <div
                className="ml-2 text-sm font-medium"
                style={{ height: '13px', width: '13px', borderRadius: '50%', opacity:'0.4', backgroundColor: getColorBasedOnFenceTypes(FenceAreaType.global) }}
              />
            </div>}

            {/* ------------------------ ALL ------------------------ */}
            <div className="mt-2 border-b-2 pb-3" style={{ marginBottom: '12px' }}>
              <input
                type="checkbox"
                className="w-4ss h-4 ml-2 rounded"
                checked={checkBoxStatusData.all}
                onChange={(event) => handleAllSelection(event, 'all')}
              />
              <label className="ml-4 ">All</label>
            </div>

            {/* ------------------------ add no-result text ------------------------  */}
            {searchText !== '' && !patientListLoadingState && !patients?.pretaaHealthGetPatientsForCounsellor?.length && (
              <p className='mt-5 text-center text-xsm'>No results</p>
            )}

            {/* ------------------------------------------------------------------------- */}

            {patients?.pretaaHealthGetPatientsForCounsellor?.map((patient: GetPatientsForLocations_pretaaHealthGetPatientsForCounsellor) => (
              <div className="block mt-2" key={patient.id}>
                <label
                  className="flex justify-between items-center "
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 m-2 rounded"
                      checked={checkBoxStatusData.all || !!checkBoxStatusData.patients.find((x) => x.id === patient.id) || false}
                      onChange={(event) => handleCheckboxSelection(event, patient.id)}
                    />
                    <div className="ml-2 text-sm font-medium">
                      {patient.firstName} {patient.lastName}
                    </div>
                  </div>
                  <div
                    className="ml-2 text-sm font-medium"
                    style={{ height: '13px', width: '13px', borderRadius: '50%', opacity: mapPopupCircleOpacity, backgroundColor: getColorBasedOnId(patient.id) }}
                  />

                </label>
              </div>
            ))}
            {patientListLoadingState && <MapSearchPopUpSkeletonLoader/>}
          </div>
        </div>
      )}
      {!showData && <div className="triangle_down" onClick={() => setShowData(true)} />}
      {showData && <div className="triangle_up" onClick={() => setShowData(false)} />}
    </div>
  );
}
