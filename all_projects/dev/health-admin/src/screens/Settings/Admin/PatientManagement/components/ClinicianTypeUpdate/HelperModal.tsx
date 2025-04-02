import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { ClinicianDetailsInterface } from './ClinicianTypeDropDown';
import './scss/_helperModal.scoped.scss';
import Button from 'components/ui/button/Button';
import { fullNameController } from 'components/fullName';
import { cloneDeep } from 'lodash';
import { Skeleton } from '@mantine/core';
import CustomCareTeamRoleType from 'components/CustomCareTeamRoleType';
import { CareTeamTypes } from 'health-generatedTypes';

export default function HelperModal({
  options,
  open,
  title,
  loadingContent,
  isUpdating,
  isResting,
  onSearch,
  onApply,
  onReset,
  onCancel,
  defaultValue,
}: {
  onCancel: () => void;
  open: boolean;
  options: ClinicianDetailsInterface[];
    isUpdating: boolean;
    isResting: boolean;
  title: CareTeamTypes;
  loadingContent?: boolean;
  onSearch: (searchPhrase: string) => void;
  onApply: (data: ClinicianDetailsInterface) => void;
  onReset: (data: ClinicianDetailsInterface, reset?: () => void) => void;
  defaultValue: ClinicianDetailsInterface | null;
}) {
  const [inputFieldValue, setInputFieldValue] = useState<string>(
    String(fullNameController(defaultValue?.firstName, defaultValue?.lastName))
  );
  
  const [selectedClinician, setSelectedClinician] =
    useState<ClinicianDetailsInterface | null>(null);

  const contentStyle = {
    background: 'transparent',
    border: '0px',
    width: '100%',
  };

  useEffect(() => {
    setSelectedClinician(defaultValue);
  }, [defaultValue]);
  

  return (
    <Popup
      open={open}
      modal
      onClose={() => {
        setInputFieldValue('');
      }}
      className="my-popup"
      {...{ contentStyle }}
      nested>
      <section className=" w-11/12 sm:w-6/12 xl:w-2/6 flex justify-center items-center m-auto flex-col bg-white">
        <div className=" w-full flex justify-between bg-gray-300 p-4 sm:p-6  py-6 px-4  md:px-8  items-center">
          <div className="text-md md:text-lg font-bold   capitalize">
          <CustomCareTeamRoleType careTeamRole={title} />
          </div>
          <div
            className=" cursor-pointer text-sm text-pt-secondary "
            onClick={() => {
              setInputFieldValue('');
              onCancel();
            }}>
            Cancel
          </div>
        </div>

        <div className="px-4 sm:px-8 py-4 w-full">
          <div
            className={
              'flex filter-border mt-4 cursor-pointer w-full  flex-row justify-between px-1'
            }>
            <input
              placeholder={'Search ...'}
              value={inputFieldValue?.includes('N/A') ? '' :  inputFieldValue}
              type="text"
              onChange={(e) => {
                const currentText = e.target.value;
                onSearch(e.target.value);
                setInputFieldValue(currentText);
              }}
              className={`patient-search w-full appearance-none focus:outline-none focus:ring-0  focus:border-transparent ${
                options.length
                  ? 'placeholder-opacity-80 placeholder-black'
                  : 'placeholder-pt-primary placeholder-opacity-50'
              } capitalize `}
            />
          </div>

          <div className="flex relative  flex-col h-96  rounded-b-lg rounded-t-none  bg-white -left-0 -right-2  overflow-auto w-full">
            {!options.length && !loadingContent && (
              <div className="p-2 text-center mt-4 font-light text-gray-150 text-base">
                No Options
              </div>
            )}
            {loadingContent && (
              <div className=" space-y-2 mt-2">
                <Skeleton height={12} />
                <Skeleton height={12} />
                <Skeleton height={12} />
                <Skeleton height={12} />
                <Skeleton height={12} />
              </div>
            )}
            {!!options.length && !loadingContent && (
              <>
                <div className="flex flex-col overflow-y-auto mt-4">
                  {options.map((data) => {
                    const fullName = fullNameController(
                      data.firstName,
                      data.lastName
                    );
                    return (
                      <div
                        key={data.id}
                        className={` border-b last:border-b-0 text-xsm font-normal  text-gray-150 p-4 cursor-pointer 
                        ${
                          selectedClinician && selectedClinician.id === data.id
                            ? 'bg-pt-secondary text-white'
                            : ''
                        }`}
                        onClick={() => {
                           if (defaultValue) {
                            const u = cloneDeep(defaultValue);
                            u.selected = true;
                            u.firstName = data.firstName;
                            u.lastName = data.lastName;
                            u.id = data.id;
                            
                            setSelectedClinician(u);
                            setInputFieldValue(fullName);
                          }
                        }}>
                        {fullName.length > 100 ? `${fullName?.substring(0, 100)}...` : fullName}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className='flex flex-row justify-center'>
            <Button
              className={`py-2 w-2/5 px-2 mx-2 mt-8 ${!selectedClinician?.selected ? 'bg-gray-300 border-0 text-gray-150' : ''}`}
              loading={selectedClinician?.selected && isUpdating && !isResting}
              disabled={selectedClinician?.selected && isUpdating && !isResting}
              onClick={() => {
                if (selectedClinician) {
                  onApply({ ...selectedClinician, selected: true });
                }
              }}
              text='Apply'
            />
            <Button 
              className='py-2 w-2/5 px-2 mx-2 mt-8'
              buttonStyle='outline'
              loading={isResting}
              disabled={isResting || defaultValue?.firstName?.includes('N/A') || !defaultValue?.firstName?.length}
              onClick={() => {
                if (defaultValue) {
                  onReset({ id: defaultValue.id, firstName: '', lastName: '', selected: false },
                    () => {
                      setSelectedClinician(null);
                      setInputFieldValue('');
                    }
                  );
                }
              }}
              text='Reset'
            />
          </div>  
        </div>
      </section>
    </Popup>
  );
}
