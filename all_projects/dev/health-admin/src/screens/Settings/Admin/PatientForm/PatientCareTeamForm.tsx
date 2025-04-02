import React, { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/client';

import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { routes } from 'routes';
import useQueryParams from 'lib/use-queryparams';
import { PatientAddStep2RouteQuery } from './PatientRoutes';
import {
  Contacts,
  EHRAddPatientVariables,
  EHRUpdatePatient,
  EHRUpdatePatientVariables,
  GetPatientDetails,
  GetPatientDetailsVariables,
  EHRCareTeamMatrices,
  CareTeamListWithTypes,
  GetFacilityDirectorVariables,
  GetFacilityDirector,
  CareTeamTypes,
} from 'health-generatedTypes';
import { DropdownIndicator } from 'components/ui/SelectBox';

import './_patient-form.scoped.scss';
import { fullNameController } from 'components/fullName';
import catchError from 'lib/catch-error';
import {
  CareTeamsData,
  FormValues,
  SelectBox,
  SelectBoxForCareTeamList,
  customStyleSelectBoxCareTeam,
} from './helper/PatientFormHelper';
import { PatientDetailContext } from './AddPatientContext';
import { createPatientEHR } from 'graphql/create-patient-ehr.mutation';
import { ehrUpdatePatient } from 'graphql/ehr-update-patient.mutation';
import { getPatientDetails } from 'graphql/getPatientDetails.query';
import CareTeamList from './CareTeamList';
import PatientCareTeamSkeletonLoading from './SkeletonLoading/PatientCareTeamSkeletonLoading';
import { config } from 'config';
import SelectCareTeamType from 'screens/Settings/CareTeam/components/SelectCareTeamType';
import { getCareTeamListWithType } from 'graphql/getCareTeamListWithTypes.query';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import messagesData from 'lib/messages';
import { useAppSelector } from 'lib/store/app-store';
import { Tooltip } from '@mantine/core';
import { getFacilityDirectorList } from 'graphql/getFacilityDirectorList';
import ConfirmationDialog from 'components/ConfirmationDialog';

export default function PatientCareTeamForm() {
  const query: PatientAddStep2RouteQuery = useQueryParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [careTeamRoleList, setCareTeamRoleList] = useState<SelectBox[]>([]);
  const careTeamTypes = useAppSelector((state) => state.app.careTeamTypesLabel.remoteData);
  const [careTeamStaffList, setCareTeamStaffList] = useState<SelectBoxForCareTeamList[]>([]);
  const [careTeamSavedData, setCareTeamSavedData] = useState<CareTeamsData[]>([]);
  const [careTeamStaffLabel, setCareTeamStaffLabel] = useState('Select Staff');
  const [careTeamRoleLabel, setCareTeamRoleLabel] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const { patientDetail, patientContact} = useContext(PatientDetailContext);
  const [disabledPrimary, setDisabledPrimary] = useState(true);
  const [numberOfClinicalDirector, setNumberOfClinicalDirector] = useState(0);
  const [addCareTeamState, setAddCareTeamState] = useState(false);

  const {
    getValues,
    trigger,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // get care team list
  const [getCareTeamStaffCallback, { loading: careTeamStaffLoader }] = useLazyQuery<CareTeamListWithTypes>(
    getCareTeamListWithType,
    {
      onCompleted: (d) => {
        if (d.pretaaHealthCareTeamListWithTypes) {
          d.pretaaHealthCareTeamListWithTypes.forEach((tp) => {
            setCareTeamStaffList((t) => {
              const filterData = t.filter((e) => e.value !== tp.id);
              return [
                ...filterData,
                {
                  label: fullNameController(tp.firstName, tp.lastName),
                  value: tp.id,
                  careTeamDetailsToCareTeamTypes: tp.careTeamDetailsToCareTeamTypes,
                },
              ];
            });
          });
        }
      },
      onError: (e) => catchError(e, true),
    },
  );

  useEffect(() => {
    setCareTeamRoleList([]);
    const selectedValue: string = getValues('careTeamStaff');
    const isSelectedValueValid = careTeamStaffList.find((e) => e.value === selectedValue);

    if (isSelectedValueValid) {
      const filteredCareTeamType = careTeamStaffList.find((el) => el.value === selectedValue);

      const updatedCareTeamTYpe = careTeamTypes.filter((e) => filteredCareTeamType?.careTeamDetailsToCareTeamTypes?.includes(e.enumType));
      updatedCareTeamTYpe.filter((val) => val.enumType !== CareTeamTypes.CLINICAL_DIRECTOR).forEach((e) => {
        setCareTeamRoleList((v) => {
          return [
            ...v,
            {
              label: e.updatedValue ? e.updatedValue : e.defaultValue,
              value: e.enumType,
              description: e.description,
            },
          ];
        });
      });
    }
  }, [careTeamStaffLabel]);

  const [getCareTeamSavedData, { loading: careTeamSavedDataLoading }] = useLazyQuery<
    GetPatientDetails,
    GetPatientDetailsVariables
  >(getPatientDetails, {
    onCompleted: (d) => {
      const careTeams = d.pretaaHealthPatientDetails.patientContactList?.careTeams ?? [];
      const formattedCareTeam = careTeams?.map((e) => {
        return {
          careTeamId: String(e?.id),
          careTeamType: e.careTeamTypes || null,
          careTeamStaffLabel: fullNameController(e.firstName, e.lastName),
          isPrimary: e.isPrimary
        };
      });
      setCareTeamSavedData(formattedCareTeam);
    },
    onError: (e) => catchError(e, true),
  });

  const [addPatientEHR, { loading: addPatientEhrLoading }] = useMutation<EHRAddPatientVariables>(createPatientEHR, {
    onCompleted: () => {
      toast.success('Patient added successfully.');
      navigate(routes.admin.patientList.match);
    },
    onError: (e) => catchError(e, true),
  });

  const [updatePatientEHR, { loading: updatePatientEhrLoading }] = useMutation<
    EHRUpdatePatient,
    EHRUpdatePatientVariables
  >(ehrUpdatePatient, {
    onCompleted: () => {
      toast.success('Patient updated successfully.');
      navigate(routes.admin.patientList.match);
    },
    onError: (e) => catchError(e, true),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const patientFormattedData = {
      contacts: patientContact.contactFrom?.map((c: Contacts) => {
        return {
          name: String(c.name),
          email: String(c.email),
          phone: String(c.phone),
          relationship: c.relationship,
          contactType: c.contactType,
        };
      }) as Contacts[],
    };

    const formattedCareTeam = careTeamSavedData?.map((e) => {
      return {
        careTeamId: String(e?.careTeamId),
        careTeamType: String(e.careTeamType),
        isPrimary: e.isPrimary
      };
    }) as EHRCareTeamMatrices[];


    // Because these user is automatically added by core 
    // It can not be updated as per scope from UI 
    const listOfCareTeam = formattedCareTeam.filter(e => {
      return (!e.careTeamType?.includes(CareTeamTypes.ALUMNI_DIRECTOR) && !e.careTeamType?.includes(CareTeamTypes.CLINICAL_DIRECTOR));
    })

    const variables = {
      facilityId: patientDetail.facilityId,
      contacts: patientFormattedData.contacts,
      pretaaHealthEhrUpdatePatientId: String(query.patientId),
      careTeams: listOfCareTeam || [],
      patientDetails: {
        first_name: String(patientDetail.firstName),
        last_name: String(patientDetail.lastName),
        phone: String(patientDetail.phone),
        gender: String(patientDetail.gender),
        genderIdentity: String(patientDetail.genderIdentity),
        intakeDate: String(patientDetail.intakeDate),
        dischargeDate: String(patientDetail.dischargeDate),
        dob: String(patientDetail.dob),
      },
    };

    console.log('form data', { patientFormattedData, formattedCareTeam, listOfCareTeam, variables });
    console.log('Selected care team members', data.careTeamRole, data.careTeamStaff)
   


    if (data.careTeamRole && data.careTeamStaff) {
      setAddCareTeamState(true);
      return;
    }


    if (!patientDetail.email) {
      toast.error('Please fill all the required fields');
      setTimeout(() => {
        if (query.patientId) {
          navigate(routes.admin.addPatient.patientDetails.build({ patientId: query.patientId }));
        } else {
          navigate(routes.admin.addPatient.patientDetails.match);
        }
        
      }, 500);
    } else {
      if (query?.patientId) {
        updatePatientEHR({
          variables: variables,
        });
      } else {
        addPatientEHR({
          variables: {
            ...variables,
            patientDetails: {
              ...variables.patientDetails,
              // *email cannot be -> 'updated',
              // so email not included in -> variables,
              // but we need email during fresh add
              email: String(patientDetail.email),
            },
          },
        });
      }
    }
  };
  //get facility director list
  const [getFacilityDirectors, { loading: loadingFacilityDirector }] = useLazyQuery<
  GetFacilityDirector,
  GetFacilityDirectorVariables
  >(getFacilityDirectorList, {
    onCompleted: (d) => {
      const checkClinicalDirector = d.pretaaHealthGetFacilityDirector.filter(c => c.care_team_types && c.care_team_types.includes(CareTeamTypes.CLINICAL_DIRECTOR));
      setNumberOfClinicalDirector(checkClinicalDirector.length);
      const facilityDirectorList: CareTeamsData[] = d.pretaaHealthGetFacilityDirector.map(clinician => {
        return {
          careTeamType: clinician.care_team_types && clinician.care_team_types.join(', '),
          careTeamId: clinician.id,
          firstName: clinician.first_name,
          lastName: clinician.last_name
        }
      });
      setCareTeamSavedData(facilityDirectorList);
    },
    onError: (e) => catchError(e, true)
  });

  useEffect(() => {
    if (query.patientId) {
      getCareTeamSavedData({
        variables: {
          patientId: query.patientId,
        },
      });
    }
  }, [query.patientId]);

  useEffect(() => {
    setCareTeamStaffList([]);
    getCareTeamStaffCallback({
      variables: {
        take: config.pagination.defaultTake,
      },
    });
    if (!query.patientId) {
      getFacilityDirectors({
        variables: {
          facilityId: patientDetail.facilityId || null
        }
      });
    }
  }, []);

  // reset value from the dropdown
  const resetDropdownState = () => {
    setIsPrimary(false);
    setValue('careTeamRole', ''); 
    setValue('careTeamStaff', '');
    setCareTeamRoleLabel('');
    setCareTeamStaffLabel('');
  };

  const listOfCareTeamAvailable = () => {
    return careTeamStaffList.filter(
      (option) =>
        option.value !== getValues('careTeamStaff') &&
        !careTeamSavedData.some((obj) => option.value === obj.careTeamId),
    )
  }
  // primary checkbox enabled/disabled functionality
  useEffect(() => {
    if (!!careTeamRoleLabel && !!careTeamStaffLabel) {
      setIsPrimary(false);
      const c = careTeamSavedData.filter(f => (f.careTeamType === getValues('careTeamRole')) && (f.isPrimary === true));
      const hasPrimary = c.length === 1;
      setDisabledPrimary(hasPrimary);
    }
  }, [careTeamRoleLabel, careTeamSavedData, careTeamStaffLabel]);

  return (
    <div className="relative h-screen overflow-y-scroll pt-8">
      <ContentFrame className=" pt-0 lg:pt-0">
        <div className="w-full">
          <div className="text-smd care-team-heading mb-5 md:mb-7 font-medium">Add Care Team Members</div>
          <form
            id="patient-care-team"
            onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div>
                <div className={`flex flex-col md:flex-row sm:gap-2 lg:gap-5 gap-y-4 py-2 w-72 `}>
                  <div className="flex flex-col">
                    <div className="font-medium care-team-heading text-base lg:text-xsmd pb-1">Staff Member</div>
                    <Select
                      {...register('careTeamStaff', {
                        required: ((numberOfClinicalDirector > 0) || (careTeamSavedData.length > 0)) ? false : true
                      })}
                      menuPosition='fixed'
                      placeholder={listOfCareTeamAvailable().length ? 'Select Staff' : 'Staff not available'}
                      styles={customStyleSelectBoxCareTeam}
                      hideSelectedOptions={false}
                      isClearable={true}
                      className="app-react-select rounded w-80 "
                      components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator,
                      }}
                      defaultValue={
                        getValues('careTeamStaff') && {
                          label: careTeamStaffLabel,
                          value: getValues('careTeamStaff'),
                        }
                      }
                      value={getValues('careTeamStaff') && {
                        label: careTeamStaffLabel,
                        value: getValues('careTeamStaff'),
                      }}
                      options={listOfCareTeamAvailable()}
                      onChange={(data) => {
                        if (data) {
                          const value = data as SelectBox;
                          setValue('careTeamStaff', value.value);
                          setCareTeamStaffLabel(value.label);
                          setValue('careTeamRole', '');
                          setCareTeamRoleLabel('');
                        } else {
                          setValue('careTeamStaff', '');
                          setCareTeamStaffLabel('');
                        }
                        trigger('careTeamStaff');
                      }}
                      isLoading={careTeamStaffLoader}
                    />
                     {!!errors?.careTeamStaff && errors.careTeamStaff.type === 'required' && (
                      <ErrorMessage message={String(messagesData.errorList.required)} />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="font-medium care-team-heading text-base lg:text-xsmd pb-1">Care Team Role</div>

                    <SelectCareTeamType
                      isDisabled={getValues('careTeamStaff') ? false : true }
                      register={register('careTeamRole', {
                        required: getValues('careTeamStaff') ? true : false
                      })}
                      
                      options={careTeamRoleList}
                      value={
                        getValues('careTeamRole') && {
                          label: careTeamRoleLabel,
                          value: getValues('careTeamRole'),
                        }
                      }
                      className="w-80"
                      onChange={(data) => {
                        const value = data as SelectBox;
                        setValue('careTeamRole', value.value || '');
                        setCareTeamRoleLabel(value.label || '');
                        trigger('careTeamRole');
                      }}
                    />
                    {!!errors?.careTeamRole && errors.careTeamRole.type === 'required' && (
                      <ErrorMessage message={String(messagesData.errorList.required)} />
                    )}
                  </div>
                  <div>
                    <label>
                      <span className="font-medium care-team-heading text-base lg:text-xsmd pb-1 whitespace-nowrap">Primary?</span>
                      <Tooltip disabled={!disabledPrimary} label="Only one primary can be added per care team type. Delete previous one if you want to update.">
                      <input
                        disabled={disabledPrimary}
                        checked={isPrimary}
                        onChange={(e) => {
                          setIsPrimary(e.target.checked);
                        }}
                        type="checkbox"
                        className={`${
                          disabledPrimary ? 'cursor-not-allowed border-gray-500' : 'border-primary-light'
                        } appearance-none h-5 w-5 border
  
                        checked:bg-primary-light checked:border-transparent
                        rounded-md form-tick ml-4 md:ml-0 md:mt-4`}
                      />
                      </Tooltip>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!getValues('careTeamStaff') || !getValues('careTeamRole')}
                onClick={() => {
                  setCareTeamSavedData((prev) => {
                    return [
                      ...prev,
                      {
                        careTeamType: getValues('careTeamRole'),
                        careTeamId: getValues('careTeamStaff'),
                        careTeamStaffLabel: careTeamStaffLabel,
                        isPrimary: isPrimary ? true : false,
                      },
                    ];
                  });
                  setTimeout(() => {
                    resetDropdownState();
                  }, 100);
                }}
                className={`${
                  (!getValues('careTeamStaff') || !getValues('careTeamRole')) && 'cursor-not-allowed'
                } text-primary-light font-semibold text-xmd mt-3`}>
                Add +
              </button>
            </div>
          </form>

          <div className="mt-8 max-w-600">
            {query.patientId && careTeamSavedDataLoading && <PatientCareTeamSkeletonLoading />}
            <div>
              {(!loadingFacilityDirector || !careTeamSavedDataLoading) && careTeamSavedData.length > 0 && (
                <div>
                  <div className="capitalize mb-4 text-smd care-team-heading font-medium">Care Team</div>
                  <CareTeamList
                    careTeams={careTeamSavedData}
                    setCareTeamData={setCareTeamSavedData}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentFrame>
      <div className="mt-28">
        <ContentFooter className="fixed bottom-0 w-full">
          <div className="block sm:flex">
            <div className="flex space-x-4">
              <Button
                loading={addPatientEhrLoading || updatePatientEhrLoading}
                disabled={addPatientEhrLoading || updatePatientEhrLoading}
                form="patient-care-team"
                type="submit">
                {query.patientId ? 'Update' : 'Save & Invite'}
              </Button>

              <Button
                buttonStyle="gray"
                onClick={() => {
                  navigate(`${routes.admin.addPatient.patientContactDetails.match}${location.search}`, {
                    replace: true,
                  });
                }}>
                Back
              </Button>
            </div>

            <div className="sm:pl-4 sm:pt-1"></div>
          </div>
        </ContentFooter>
      </div>
      <ConfirmationDialog
        modalState={addCareTeamState}
        confirmBtnText={'Confirm'}
        onConfirm={() => {
          setCareTeamSavedData((prev) => {
            return [
              ...prev,
              {
                careTeamType: getValues('careTeamRole'),
                careTeamId: getValues('careTeamStaff'),
                careTeamStaffLabel: careTeamStaffLabel,
                isPrimary: isPrimary ? true : false,
              },
            ];
          });
          resetDropdownState();
          setAddCareTeamState(false);
        }}
        onCancel={() => setAddCareTeamState(false)}
        className="max-w-sm rounded-xl">
        Are you sure you want to add this care team ?
      </ConfirmationDialog>
    </div>
  );
}
