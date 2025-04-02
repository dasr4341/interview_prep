import React, { useEffect, useState } from 'react';

import caretDown from '../../../assets/icons/icon-filled-down.svg';
import CloseIcon from 'components/icons/CloseIcon';
import './_reportFilter.scoped.scss';
import { useLazyQuery } from '@apollo/client';
import {
  PatientListForReport,
  PatientListForReportVariables,
  PatientListForReport_pretaaHealthGetPatientsForCounsellor,
} from 'health-generatedTypes';
import { patientListForReport } from 'graphql/patientListForReport.query';
import { FilterInterface } from '../interface/dateFilterData.interface';
import { fullNameController } from 'components/fullName';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { useParams } from 'react-router-dom';
import { FilterDropDownMenu } from './FilterDropDownMenu';
import { useDebouncedState } from '@mantine/hooks';
import { counsellorReportingSliceActions } from 'lib/store/slice/reporting-Filter/counsellorEventReporting/counsellorEventReporting.slice';

export enum SelectedPatientsType {
  ALL = 'all',
}

export default function ReportFilter({ className }: { className?: string }) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [patientListFilterData, setPatientListFilterData] = useState<
    FilterInterface[]
  >([]);
  const [searchText, setSearchText] = useDebouncedState('', 700);
  const { patientId } = useParams();


  const dispatch = useAppDispatch();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);

  // ----------- API -----------------
  const [getPatientList, { loading }] = useLazyQuery<
    PatientListForReport,
    PatientListForReportVariables
  >(patientListForReport, {
    variables: {
      search: searchText,
      take: 20,
    },
    onCompleted: (d) =>
      d?.pretaaHealthGetPatientsForCounsellor &&
      setPatientListFilterData(() => {
        return (
          !patientId
            ? [
                {
                  id: String(SelectedPatientsType.ALL),
                  value: String(SelectedPatientsType.ALL),
                  label: String(SelectedPatientsType.ALL),
                },
              ]
            : []
        ).concat(
          (
            d.pretaaHealthGetPatientsForCounsellor as PatientListForReport_pretaaHealthGetPatientsForCounsellor[]
          ).map((e) => ({
            id: e.id,
            value: String(fullNameController(e.firstName, e.lastName)),
            label: String(fullNameController(e.firstName, e.lastName)),
          }))
        );
      }),
  });
  // ----------- API Ends -----------------

  function updateSelectedPatient(patients: {
    filterUsers: { patientId: string; name: string }[];
    all: boolean;
  }) {
    dispatch(counsellorReportingSliceActions.setReportFilter({ ...reportFilter, ...patients }));
  }

  function getFilterPlaceholder() {
    if (patientId) {
      return `${reportFilter.filterUsers[0]?.name || ''}`;
    }
    if (reportFilter.filterUsers.length === 1) {
      return `${reportFilter.filterUsers[0]?.name}`;
    }
    if (reportFilter.filterUsers.length > 1) {
      return `${reportFilter.filterUsers[0]?.name} + ${(reportFilter.filterUsers.length - 1 )} more Selected`;
    }
   
    if (reportFilter.all) {
      return 'All patients selected';
    }
    return 'Please select patient';
  }

  function getDropDownContents(patientList: FilterInterface[]) {
    const output: ReactJSXElement[] = [];

    for (let i = 0; i < patientList.length; i++) {
      if (reportFilter.all && i === 1 && !searchText.length) {
        break;
      }
      output.push(
        <FilterDropDownMenu
          appendPatientCallback={updateSelectedPatient}
          option={patientList[i]}
          reportFilterState={reportFilter}
          patientId={patientId}
        />
      );
    }

    return output;
  }

  useEffect(() => {
    getPatientList();
  }, [searchText, patientId]);


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
                reportFilter.filterUsers.length
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

            <img src={caretDown} />
          </div>

          {isDropDownOpen && (
            <div className="flex flex-col max-h-52  rounded-b-lg rounded-t-none  bg-white -left-0 -right-2  overflow-auto w-full">
              {!!reportFilter.filterUsers.length && (
                <div className="flex flex-row flex-wrap p-4 filter-border-b">
                  {reportFilter.filterUsers.map((selectedP) => (
                    <div
                      className="capitalize flex space-x-2 mr-3 my-1 items-center font-bold text-xxs rounded-full bg-gray-100 px-2 py-1 "
                      key={selectedP.patientId}>
                      <span>{selectedP.name}</span>
                      {!patientId && (
                        <button
                          onClick={() =>
                            updateSelectedPatient({
                              all: false,
                              filterUsers: reportFilter.filterUsers.filter(
                                (data) => data.patientId !== selectedP.patientId
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
              {!loading &&
                !patientListFilterData.length &&
                !!searchText.length && (
                  <div className="p-2 text-center font-light text-gray-150 text-sm">
                    No data found
                  </div>
                )}
              {!loading &&
                !patientListFilterData.length &&
                !searchText.length && (
                  <div className="p-2 text-center font-light text-gray-150 text-sm">
                    No Options
                  </div>
                )}

              {!loading && getDropDownContents(patientListFilterData)}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
