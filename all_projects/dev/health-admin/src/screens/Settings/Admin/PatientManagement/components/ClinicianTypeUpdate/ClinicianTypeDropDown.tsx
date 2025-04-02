import React, { useState } from 'react';
import { CustomPatientType } from '../StatusDropdown';
import {
  CareTeamTypes,
  GetCareTeamListByType,
  GetCareTeamListByTypeVariables,
  updatePatientCareTeamMutationVariables,
  updatePatientCareTeamMutation
} from 'health-generatedTypes';
import { fullNameController } from 'components/fullName';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getCareTeamListByType } from 'graphql/getCareTeamListByType.query';
import catchError from 'lib/catch-error';
import HelperModal from './HelperModal';
import { toast } from 'react-toastify';
import './scss/_dropDown.scoped.scss';
import { PatientManagementRow } from 'screens/Settings/Admin/PatientLIst/PatientManagement.interface';
import { updatePatientCareTeamMutationQuery } from 'graphql/updatePatientCareTeam.mutation';
import { cloneDeep } from 'lodash';

export interface ClinicianDetailsInterface {
  firstName: string,
  lastName: string,
  id: string;
  patientId?: string,
  selected?: boolean,
}

function getClinicianDetails(data: ClinicianDetailsInterface | null) {
  if (!data) {
    return {
      firstName: 'N/A',
      lastName: '',
      id: '',
      patientId:'',
      selected: false,
    };
  }
  return cloneDeep(data);
}


export function ClinicianTypeDropDown({
  props,
  type,
  updateRows,
}: {
  props: CustomPatientType;
  type: CareTeamTypes;
  updateRows?: React.Dispatch<React.SetStateAction<PatientManagementRow[]>>;
  }) {
  const [options, setOptions] = useState<ClinicianDetailsInterface[]>([]);
  const [value, setValue] = useState<ClinicianDetailsInterface | null>(
    getClinicianDetails(
      type === CareTeamTypes.PRIMARY_CASE_MANAGER
        ? props.data?.caseManager
      : props.data?.primaryTherapists
    ) 
  );
  const [isResting, setIsResting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [getCareTeamTypeListCallback, { loading }] = useLazyQuery<
    GetCareTeamListByType,
    GetCareTeamListByTypeVariables
  >(getCareTeamListByType, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetCareTeamListByType) {
        const result = d.pretaaHealthGetCareTeamListByType
          .map((data) => {
            const { firstName, lastName } = data;
            return {
              firstName: firstName || 'N/A',
              lastName: lastName || '',
              id: data.userId,
            };
          }); 
        setOptions(result);
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  const [updateClinicianType, { loading: updateClinicianTypeLoading }] =
    useMutation<updatePatientCareTeamMutation, updatePatientCareTeamMutationVariables>(
      updatePatientCareTeamMutationQuery,
      {
        onCompleted: (d) => {
          if (updateRows) {
            updateRows((prevData: any) => {
              return prevData.map((data: any) => {
                const { caseManager, primaryTherapists, ...allData  } = data;
                if (type === CareTeamTypes.PRIMARY_CASE_MANAGER && data?.id === value?.patientId) {
                  if (value?.selected) {
                    return {
                      ...data,
                      caseManager: {
                        firstName: value.firstName,
                        lastName: value.lastName,
                        id: value.id,
                      }
                    };
                  } else {
                    return allData;
                  }                
                }
                if (type === CareTeamTypes.PRIMARY_THERAPIST && data?.id === value?.patientId) {
                  if (value?.selected) {
                    return {
                      ...data,
                      caseManager: {
                        firstName: value.firstName,
                        lastName: value.lastName,
                        id: value.id,
                      }
                    };
                  } else {
                    return allData;
                  }                
                }
                return data;
              });
            });
          }
          setIsModalOpen(false);
          toast.success(
            d.pretaaHealthPatientCareTeamUpdateFromPatientManagement
          );
        },
        onError: (e) => {
          if (isResting) {
            setIsResting(false);
          }
          catchError(e, true);
        }
      }
    );

  function callApi(searchPhrase: string | null = null) {
    if ((!options.length || !!searchPhrase) ) {
      getCareTeamTypeListCallback({
        variables: {
          skip: 0,
          take: 10,
          searchPhrase,
          careTeamType: type, // CareTeamTypes
        },
      });
    }
  }

  const fullName = fullNameController(value?.firstName, value?.lastName);

  return (
    <>
      <div className="flex clinician-name  overflow-auto cursor-pointer justify-start ">
        <div
          className={`mb-3 flex capitalize overflow-auto justify-between w-full ${
            updateClinicianTypeLoading ? 'cursor-wait' : ''
          }`}>
          <span>{ fullName.length > 15 ? `${fullName.substring(0, 15)}...` : fullName}</span>
          <button
            className=" edit-btn ml-1  cursor-pointer px-2 py-1 bg-gray-300 rounded text-xss"
            onClick={() => {
              callApi();
              setIsModalOpen(!isModalOpen);
            }}>
            Edit
          </button>
        </div>
      </div>
      <HelperModal
        onCancel={() => {
          setIsModalOpen(!isModalOpen);
        }}
        defaultValue={value}
        open={isModalOpen}
        options={options}
        title={type}
        loadingContent={loading}
        isUpdating={updateClinicianTypeLoading}
        isResting={isResting}
        onApply={(data: ClinicianDetailsInterface) => {
          updateClinicianType({
            variables: {
              selectedId: data.id,
              selectedType: type,
              patientId: props.data?.id,
            },
            onCompleted(d) {
              setValue(data);
              toast.success(d.pretaaHealthPatientCareTeamUpdateFromPatientManagement);
              setIsModalOpen(!isModalOpen);
            },
          });
        }}
        onReset={(data: ClinicianDetailsInterface, reset?: () => void) => {
          setIsResting(true);
          updateClinicianType({
            variables: {
              selectedId: '',
              selectedType: type,
              patientId: props.data?.id,
            },
            onCompleted(d) {
              setIsResting(false);
              setValue(data);
              if (reset) {
                reset();
              toast.success(d.pretaaHealthPatientCareTeamUpdateFromPatientManagement);
              setIsModalOpen(!isModalOpen);
              }
            },
          });
        }}
        onSearch={callApi}
      />
    </>
  );
}
