import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

import caretDown from '../../../../../assets/icons/icon-filled-down.svg';
import CloseIcon from 'components/icons/CloseIcon';
import './_selectClinicianFilter.scoped.scss';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { FilterClinicianListMenu } from './FilterClinicianListMenu';
import { FilterInterface } from 'screens/Report/interface/dateFilterData.interface';
import { useLazyQuery } from '@apollo/client';
import {
  CareTeamTypes,
  GetCareTeamListByType,
  GetCareTeamListByTypeVariables,
  GetCareTeamListByType_pretaaHealthGetCareTeamListByType,
} from 'health-generatedTypes';
import { fullNameController } from 'components/fullName';
import { getCareTeamListByType } from 'graphql/getCareTeamListByType.query';

export interface ClinicianFilterInterface {
  value: string;
  label: string;
}

export enum SelectedClinicianType {
  ALL = 'all',
}

export default function FilterClinicianList({
  className,
}: {
  className?: string;
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [clinicianListData, setClinicianListData] = useState<FilterInterface[]>(
    []
  );
  const [searchText, setSearchText] = useDebouncedState('', 700);
  const { patientId } = useParams();
  const dispatch = useAppDispatch();
  const clinicianFilterList = useAppSelector(
    (state) => state.app.clinicianFilter
  );

  function updateSelectedPatient(id: {
    filterClinicianList: { id: string; name: string }[];
    clinicianListAll: boolean;
  }) {
    dispatch(
      appSliceActions.setClinicianFilter({ ...clinicianFilterList, ...id })
    );
  }

  const [getClinicianList, { loading, data: getClinicianListResponse }] =
    useLazyQuery<GetCareTeamListByType, GetCareTeamListByTypeVariables>(
      getCareTeamListByType,
      {
        variables: {
          searchPhrase: searchText,
          take: 20,
          careTeamType: clinicianFilterList?.filterClinicianType?.value as CareTeamTypes || null
        },
        onCompleted: (d) =>
          d?.pretaaHealthGetCareTeamListByType &&
          setClinicianListData(() => {
            return [
              {
                id: String(SelectedClinicianType.ALL),
                value: String(SelectedClinicianType.ALL),
                label: String(SelectedClinicianType.ALL),
              },
            ].concat(
              (
                d.pretaaHealthGetCareTeamListByType as GetCareTeamListByType_pretaaHealthGetCareTeamListByType[]
              ).map((e) => ({
                id: e.userId,
                value: e.firstName
                  ? String(fullNameController(e.firstName, e.lastName))
                  : e.email,
                label: e.firstName
                  ? String(fullNameController(e.firstName, e.lastName))
                  : e.email,
              }))
            );
          }),
      }
    );
  // ----------- API Ends -----------------

  function getFilterPlaceholder() {
    if (clinicianFilterList.filterClinicianList.length === 1) {
      return `${clinicianFilterList?.filterClinicianList[0]?.name}`;
    }
    if (clinicianFilterList.filterClinicianList.length > 1) {
      return `${clinicianFilterList?.filterClinicianList[0].name} + ${(clinicianFilterList?.filterClinicianList.length - 1 )} more selected`;
    }
    if (clinicianFilterList.clinicianListAll) {
      return `All ${clinicianFilterList.filterClinicianType?.label?.toLowerCase()} selected`;
    }
    return 'Select clinicians';
  }


  function getDropDownContents(clinicianTypeList: any) {
    const output: ReactJSXElement[] = [];

    for (let i = 0; i < clinicianTypeList.length; i++) {
      if (
        clinicianFilterList.clinicianListAll &&
        i === 1 &&
        !searchText.length
      ) {
        break;
      }
      output.push(
        <FilterClinicianListMenu
          key={i}
          appendClinicianListCallback={updateSelectedPatient}
          option={clinicianTypeList[i]}
          reportFilterState={clinicianFilterList}
        />
      );
    }

    return output;
  }

  useEffect(() => {
    getClinicianList();
    // 
  }, [searchText, clinicianFilterList.filterClinicianType]);

  return (
    <React.Fragment>
      {isDropDownOpen && (
        <div
          className=" fixed top-0 bottom-0 left-0 right-0 bg-transparent "
          onClick={() => setIsDropDownOpen(false)}></div>
      )}
      <div className={`${className} relative`}>
        <div className="absolute w-full  py-0.5 filter-border bg-white flex flex-col rounded-lg  ">
          <div
            className={`flex ${
              isDropDownOpen && 'filter-border-b'
            } cursor-pointer flex-row justify-between px-1`}
            onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
            <input
              type="text"
              className={`patient-search w-full appearance-none focus:outline-none focus:ring-0  focus:border-transparent ${
                clinicianFilterList.filterClinicianList?.length
                  ? 'placeholder-opacity-80 placeholder-black'
                  : 'placeholder-pt-primary placeholder-opacity-50'
              }`}
              placeholder={getFilterPlaceholder()}
              onChange={(e) => {
                setSearchText(e.target.value);
                setIsDropDownOpen(!!e.target.value.length);
              }}
              onBlur={(e) => {
                e.target.value = '';
                setTimeout(() => setSearchText(''), 1000);
              }}
            />

            <img src={caretDown} alt='drop-down' />
          </div>

          {isDropDownOpen && (
            <div className="flex flex-col max-h-52  rounded-b-lg rounded-t-none  bg-white -left-0 -right-2  overflow-auto w-full">
              {!!clinicianFilterList.filterClinicianList?.length && (
                <div className="flex flex-row flex-wrap p-4 filter-border-b">
                  {clinicianFilterList.filterClinicianList.map((selectedP) => (
                    <div
                      className="capitalize flex space-x-2 mr-3 my-1 items-center font-bold text-xxs rounded-full bg-gray-100 px-2 py-1 "
                      key={selectedP.id}>
                      <span>{selectedP.name}</span>
                      {!patientId && (
                        <button
                          onClick={() =>
                            updateSelectedPatient({
                              clinicianListAll: false,
                              filterClinicianList:
                                clinicianFilterList?.filterClinicianList?.filter(
                                  (data) => data.id !== selectedP.id
                                ),
                            })
                          }>
                          <CloseIcon className=" w-2 h-2 cursor-pointer" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {loading && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  ... Loading
                </div>
              )}

              {!loading && !clinicianListData.length && !searchText.length && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  No Options
                </div>
              )}
              {!loading && getDropDownContents(clinicianListData)}

              {!loading &&
                !getClinicianListResponse?.pretaaHealthGetCareTeamListByType
                  ?.length &&
                !!searchText.length && (
                  <div className="p-2 text-center font-light text-gray-150 text-sm">
                    No data found
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
