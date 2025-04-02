/*  */
import React, { useEffect, useRef, useState } from 'react';

import caretDown from '../../../../../assets/icons/icon-filled-down.svg';
import CloseIcon from 'components/icons/CloseIcon';
import './scss/_assessmentFilter.scoped.scss';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { AssessmentPatientListInterface } from '../../customHooks/useAssessmentReport';
import { AssessmentSelectedPatients } from 'interface/app.slice.interface';
import AssessmentPatientOptions from './AssessmentPatientOptions';

export enum SelectedPatientsType {
  ALL = 'all',
}

export default function AssessmentPatientFilter({
  className,
  patientList,
  selectedPatients,
  loading,
  onChange,
  onSearch,
  placeholder
}: {
  className?: string;
  patientList: AssessmentPatientListInterface[];
  selectedPatients: AssessmentSelectedPatients;
  loading: boolean;
    onChange: (patients: AssessmentSelectedPatients) => void,
    onSearch: (searchedText: string) => void,
    placeholder?: string | null
  }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const [searchText, setSearchText] = useState('');


  function getFilterPlaceholder(placeholder?: string | null) {
    if (isDropDownOpen) {
      return 'Search Patient'
    }
    if (placeholder) {
      return placeholder;
    }
    if (loading) {
      return 'Loading... ';
    }
    if (selectedPatients.list.length === 1) {
      return `${selectedPatients.list[0].name}`;
    }
    if (selectedPatients.list.length > 1) {
      const name = selectedPatients.list[0].name;
      const nameLen = name.length;
      return `${name.substring(0, 20)}${nameLen > 20 ? '...' : '' } + ${(selectedPatients.list.length - 1 )} more Selected`;
    }
    if (selectedPatients.all) {
      return 'All patients selected';
    }
    return 'Please select patient';
  }

  function getDropDownContents() {
    const output: ReactJSXElement[] = [];

    for (let i = 0; i < patientList.length; i++) {
      if (selectedPatients.all && i === 1 && !searchText.length) {
        break;
      }
      output.push(
        <AssessmentPatientOptions
          option={patientList[i]}
          selectedPatient={selectedPatients}
          onChange={onChange}
        />
      );
    }
    return output;
  }

  useEffect(() => {
    onSearch(searchText);
  }, [searchText]);

  useEffect(() => {
    const checkIfClickedOutside = (e:any) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener('click', checkIfClickedOutside);
    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, []);

  function isFilterEnabled(list:AssessmentPatientListInterface[]) {
    if (!searchText.length && list.length === 1 && list[0].name.toLowerCase() === SelectedPatientsType.ALL.toLowerCase()) {
      return false;
    }
    return true;
  }


  return (
      <div className={`${className} relative `} ref={modalRef}>
        <div className="absolute w-full  py-0.5 filter-border bg-white flex flex-col rounded-lg  ">
          <div
            className={`flex ${
              isDropDownOpen && 'filter-border-b'
            } cursor-pointer flex-row justify-between px-1`}
            onClick={() => isFilterEnabled(patientList) && setIsDropDownOpen(!isDropDownOpen)}>
            <input
              type="text"
            className={`patient-search w-full appearance-none focus:outline-none focus:ring-0  focus:border-transparent
               ${!isFilterEnabled(patientList) ? 'hide-cursor cursor-not-allowed' : ''} 
               ${
                selectedPatients.list.length
                  ? 'placeholder-opacity-80 placeholder-black'
                  : 'placeholder-pt-primary placeholder-opacity-50'
              }`}
              placeholder={getFilterPlaceholder(placeholder)}
              onChange={(e) => {
                  if (!isFilterEnabled(patientList)) {
                    return;
                  }
                  setSearchText(e.target.value);
              }}
            value={searchText}
            />
            <img src={caretDown} />
          </div>

          {isDropDownOpen && (
            <div className="flex flex-col max-h-52  rounded-b-lg rounded-t-none  bg-white -left-0 -right-2  overflow-auto w-full">
              {!!selectedPatients.list.length && (
                <div className="flex flex-row flex-wrap p-4 filter-border-b">
                  {selectedPatients.list.map((selectedP) => (
                    <div
                      className="capitalize flex space-x-2 mr-3 my-1 items-center font-bold text-xxs rounded-full bg-gray-100 px-2 py-1 "
                      key={selectedP.id}>
                      <span>{selectedP.name}</span>
                      <button
                        onClick={() => {
                          const updatedPatients = selectedPatients.list.filter(p => p.id !== selectedP.id);
                          onChange({
                            ...selectedPatients,
                            list: updatedPatients
                          });
                        }}>
                        <CloseIcon className=" w-2 h-2 cursor-pointer" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {loading && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  Loading ...
                </div>
              )}
             
              {!loading &&  getDropDownContents()}
              {!loading && !!searchText.trim().length &&  ((patientList[0].name.toLowerCase() === 'all' && patientList.length <= 1) ||  !patientList.length ) && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  No patient available
                </div>
              )}
               {!loading && !patientList.length && !searchText.length && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  No patient found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}
