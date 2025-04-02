import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import messages from 'lib/messages';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import {
  UserStaffTypes,
  CareTeamTypes,
  AddStaffVariables,
  AddStaff,
  UserTypeRole,
  GetStaffVariables,
  GetStaff,
  UpdateStaff,
  UpdateStaffVariables,
} from 'health-generatedTypes';
import { addStaffMutation } from 'graphql/addStaff.mutation';
import catchError from 'lib/catch-error';
import { updateStaffMutation } from 'graphql/updateStaff.mutation';
import { getStaffQuery } from 'graphql/getStaff.query';
import Select from 'react-select';
import { DropdownIndicator, OptionWithCheckbox } from 'components/ui/SelectBox';
import AddOrEditCareTeamSkeletonLoader from './skeletonLoader/AddOrEditCareTeamSkeletonLoader';
import { useAppSelector } from 'lib/store/app-store';
import useSelectedRole from 'lib/useSelectedRole';
import SelectCareTeamType from './components/SelectCareTeamType';
import {
  SelectBox,
  SelectedFacilitiesInterface,
  UseFormInterface,
  careTeamSchema,
  customStyleSelectBox,
} from './helper/CareTeamHelper';
import { routes } from 'routes';

export default function AddOrEditCareTeam() {
  const careTeamForm = useRef<any>(null);
  const navigate = useNavigate();
  const params = useParams();

  const [employeeTypes, setEmployeeTypes] = useState<SelectBox[]>([]);
  const [careTeamTypesData, setCareTeamTypesData] = useState<SelectBox[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<SelectedFacilitiesInterface[]>([]);
  const [selectedUserStaffType, setSelectedUserStaffType] = useState<UserStaffTypes[]>([]);

  const isSuperAdmin = useSelectedRole({ roles: [UserTypeRole.SUPER_ADMIN] });

  const careTeamLabels = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;
  const careTeamTypes = useAppSelector((state) => state.app.careTeamTypesLabel).remoteData;
  const facilityList: SelectedFacilitiesInterface[] =
    useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser.userFacilities)?.map((e) => {
      return {
        label: e.name,
        value: e.id,
      };
    }) || [];

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitted },
    reset: formReset,
  } = useForm<UseFormInterface>({
    resolver: yupResolver(careTeamSchema),
    mode: 'onChange',
  });

  useMemo(
    () =>
      setEmployeeTypes(() =>
        careTeamTypes.map((e) => {
          return {
            value: e.enumType as CareTeamTypes,
            label: e.updatedValue || e.defaultValue,
            description: e.description
          };
        }),
      ),
    [careTeamTypes],
  );

  // create care team
  const [addStaffCallback, { loading: createFormLoading }] = useMutation<AddStaff, AddStaffVariables>(
    addStaffMutation,
    {
      onCompleted: () => {
        formReset();
        setSelectedFacilities([]);
        setCareTeamTypesData([]);
        setSelectedUserStaffType([]);
        toast.success('Staff Added Successfully');
        navigate(routes.admin.employee.list.build(UserStaffTypes.COUNSELLOR));
      },
      onError: (e) => catchError(e, true),
    },
  );

  // edit care team
  const [editCareTeam, { loading: updateFormLoading }] = useMutation<UpdateStaff, UpdateStaffVariables>(
    updateStaffMutation,
    {
      onCompleted: () => {
        toast.success('Staff Updated Successfully');
      },
      onError: (e) => catchError(e, true),
    },
  );

  // care team view
  const [geoCareTeam, { loading: careTeamDataLoading }] = useLazyQuery<GetStaff, GetStaffVariables>(getStaffQuery, {
    onCompleted: (data) => {
      if (data.pretaaHealthGetStaffUser) {
        const staffData = data.pretaaHealthGetStaffUser;
        const formattedCareTeamTypes = staffData.careTeamTypes?.filter((e) => {
          return (!e.includes(CareTeamTypes.PRIMARY_ALUMNI_COORDINATOR))
        });
        const formattedUserTypes = staffData.roles?.filter((e) => {
          return (!e.roleSlug.includes(UserTypeRole.PATIENT));
        });
        setValue('firstName', staffData?.firstName || '');
        setValue('lastName', staffData?.lastName || '');
        setValue('email', staffData?.email || '');
        setValue('phone', staffData?.mobilePhone || '');
        setValue('careTeamTypes', (formattedCareTeamTypes as CareTeamTypes[]) || []);
        const savedSelectedStaff = formattedUserTypes?.map((staff) => staff.roleSlug) as UserStaffTypes[];
        setSelectedUserStaffType(savedSelectedStaff);
        setValue('userType', savedSelectedStaff);
        setValue('facilityIds', (staffData?.facilities?.map((el) => el.id) as string[]) || []);
        setSelectedFacilities(
          staffData.facilities?.map((facilities) => ({ label: facilities.name, value: facilities.id })) || [],
        );
        setCareTeamTypesData(
          formattedCareTeamTypes?.map((v) => {
            const value = v as CareTeamTypes;
            return {
              label: careTeamLabels[value].updatedValue || careTeamLabels[value].defaultValue,
              value: value,
            };
          }) || [],
        );
      }
    },
    onError: (e) => catchError(e, true),
  });

  function setCustomErrors(careTeamTypes: CareTeamTypes[] | null) {
    let errorCount = 0;

    if (!selectedUserStaffType.length) {
      setError('userType', { message: messages.errorList.required, type: 'required' });
      errorCount++;
    } else {
      clearErrors('userType');
    }
    if (selectedUserStaffType.includes(UserStaffTypes.COUNSELLOR) && !careTeamTypes?.length) {
      setError('careTeamTypes', { message: messages.errorList.required, type: 'required' });
      errorCount++;
    } else {
      clearErrors('careTeamTypes');
    }
    // only in case of super admin mandatory
    if (
      !selectedUserStaffType?.includes(UserStaffTypes.SUPER_ADMIN) &&
      selectedUserStaffType?.length >= 1 &&
      !selectedFacilities?.length
    ) {
      
      setError('facilityIds', { message: messages.errorList.required, type: 'required' });
      errorCount++;
    } else {
      clearErrors('facilityIds');
    }
    return errorCount;
  }

  function onSubmit(formData: UseFormInterface) {
    
    const errorCount = setCustomErrors(formData.careTeamTypes || null);
    if (errorCount > 0) {
      return;
    }

    const { userType, facilityIds, careTeamTypes, ...submittedData } = formData;


    const variables = {
      ...submittedData,
      userType: selectedUserStaffType,
      facilityIds:
        facilityIds?.length && !selectedUserStaffType?.includes(UserStaffTypes.SUPER_ADMIN) ? facilityIds : null,
      careTeamTypes:
        careTeamTypes?.length && selectedUserStaffType?.includes(UserStaffTypes.COUNSELLOR) ? careTeamTypes : null,
    };

    if (params.userId) {
      editCareTeam({
        variables: {
          staffId: params.userId,
          ...variables,
        },
      });
      return;
    }

    addStaffCallback({
      variables,
    });
  }

  useEffect(() => {
    if (params.userId) {
      geoCareTeam({
        variables: {
          userId: params.userId,
        },
      });
    }
  }, [params.userId]);

  useEffect(() => {
    setValue('userType', selectedUserStaffType);
    if (selectedUserStaffType.length === 1 && selectedUserStaffType.includes(UserStaffTypes.SUPER_ADMIN)) {
      setSelectedFacilities([]);
      setCareTeamTypesData([]);
      setValue('facilityIds', []);
      setValue('careTeamTypes', []);
    }

    if (isSubmitted) {
      setCustomErrors(getValues('careTeamTypes') || null);
    }
  }, [selectedUserStaffType, isSubmitted]);

  return (
    <>
      <ContentHeader title={params.userId ? 'Update Staff' : 'Add Staff'} />
        <ContentFrame className="w-full">
        <div className='pb-28'>
          {!careTeamDataLoading && (
            <form
              ref={careTeamForm}
              onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex flex-col space-y-6">
                <div className=" lg:w-8/12 xl:w-1/2 2xl:w-1/3 space-y-6">
                  <div className="flex flex-col ">
                    <label className=" text-xsm font-normal text-gray-750 mb-2">First Name</label>
                    <input
                      type="text"
                      {...register('firstName')}
                      placeholder="Enter first name"
                      className="rounded border-gray-350 py-3 "
                      tabIndex={1}
                    />
                    {errors.firstName?.message && <ErrorMessage message={errors.firstName.message} />}
                  </div>
                  <div className="flex flex-col ">
                    <label className=" text-xsm font-normal text-gray-750 mb-2">Last Name</label>
                    <input
                      type="text"
                      {...register('lastName')}
                      placeholder="Enter last name"
                      className="rounded border-gray-350 py-3 "
                      tabIndex={2}
                    />
                    {errors.lastName?.message && <ErrorMessage message={errors.lastName.message} />}
                  </div>
                  <div className="flex flex-col ">
                    <label className=" text-xsm font-normal text-gray-750 mb-2">Email</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="Enter email address"
                      className="rounded border-gray-350 py-3 "
                      tabIndex={3}
                    />
                   {errors.email?.message && <ErrorMessage message={errors.email.message} />}
                  </div>

                  <div className="flex flex-col ">
                    <label className=" text-xsm font-normal text-gray-750 mb-2">Phone Number</label>
                    <input
                      type="text"
                      {...register('phone')}
                      placeholder="Enter mobile number"
                      className="rounded border-gray-350 py-3 "
                      tabIndex={4}
                    />
                    {errors.phone?.message && <ErrorMessage message={errors.phone.message} />}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start flex-wrap md:space-x-6 space-y-6 space-x-0 md:space-y-0">
                  <div className="mt-3 flex flex-col">
                    <label className=" text-xsm font-normal text-gray-750 mb-3">Select Role</label>
                    <div className=" flex flex-row flex-wrap ">
                      {Object.values(UserStaffTypes)
                        .reverse()
                        .map((d, i) => {
                          const keyId = i.toString();
                          if (!isSuperAdmin && d === UserStaffTypes.SUPER_ADMIN) {
                            return <></>;
                          }
                          const typeSelected = selectedUserStaffType.includes(d);
                          return (
                            <div
                              className="flex items-center mr-6 mb-4 "
                              key={keyId}>
                              <input
                                type="checkbox"
                                className={` h-5 w-5 border border-primary-light checked:bg-primary-light checked:border-transparent
                rounded-md  ${true ? 'checkbox' : ''}`}
                                id={d}
                                checked={typeSelected}
                                onChange={(e) => {
                                  if (
                                    UserStaffTypes.SUPER_ADMIN === d &&
                                    selectedUserStaffType.includes(UserStaffTypes.FACILITY_ADMIN)
                                  ) {
                                    setSelectedUserStaffType((prevSelected) => [
                                      ...prevSelected.filter((f) => f !== UserStaffTypes.FACILITY_ADMIN),
                                      d,
                                    ]);
                                    return;
                                  }

                                  if (
                                    UserStaffTypes.FACILITY_ADMIN === d &&
                                    selectedUserStaffType.includes(UserStaffTypes.SUPER_ADMIN)
                                  ) {
                                    setSelectedUserStaffType((prevSelected) => [
                                      ...prevSelected.filter((f) => f !== UserStaffTypes.SUPER_ADMIN),
                                      d,
                                    ]);

                                    return;
                                  }

                                  if (e.target.checked && !typeSelected) {
                                    setSelectedUserStaffType((prevSelected) => [...prevSelected, d]);
                                  } else {
                                    setSelectedUserStaffType((prevSelected) => prevSelected.filter((f) => f !== d));
                                  }
                                }}
                              />
                              <label
                                htmlFor={d}
                                className=" pl-2 font-medium text-xsm">
                                {d === UserStaffTypes.COUNSELLOR ? 'CARE TEAM' : d.replaceAll('_', ' ')}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                    {errors.userType?.message && <ErrorMessage message={String(errors.userType.message)} />}
                  </div>

                  {selectedUserStaffType?.includes(UserStaffTypes.COUNSELLOR) && (
                    <>
                    <div className="flex flex-col w-full md:w-4/12 pt-5 ">
                      <SelectCareTeamType
                        isMulti={true}
                        options={employeeTypes}
                        value={careTeamTypesData}
                        onChange={(data) => {
                          clearErrors('careTeamTypes');
                          setCareTeamTypesData(data as SelectBox[]);
                            setValue(
                              'careTeamTypes',
                              data.map((d) => d.value)
                            );
                            trigger('careTeamTypes');
                        }}
                      />
                      {errors.firstName?.message && <ErrorMessage message={errors.firstName.message} />}
                    </div>
                    </>
                  )}
                </div>

                {!selectedUserStaffType.some((e) => e === UserStaffTypes.SUPER_ADMIN) && (
                  <div className=" lg:w-8/12 xl:w-1/2 2xl:w-1/3">
                    <label className=" text-xsm font-normal text-gray-750">Select Facility</label>
                    <div className="mt-3">
                      <Select
                        tabIndex={5}
                        placeholder="Select Facilities "
                        closeMenuOnSelect={false}
                        styles={customStyleSelectBox}
                        hideSelectedOptions={false}
                        className="app-react-select w-full rounded capitalize  "
                        components={{
                          IndicatorSeparator: () => null,
                          DropdownIndicator,
                          Option: OptionWithCheckbox,
                        }}
                        value={selectedFacilities}
                        isMulti
                        options={facilityList}
                        onChange={(data) => {
                          clearErrors('facilityIds');
                          setSelectedFacilities(data as SelectBox[]);
                          if (data.length) {
                            setValue(
                              'facilityIds',
                              data.map((d) => d.value),
                            );
                          } else {
                            setValue('facilityIds', []);
                          }
                          trigger('facilityIds');
                        }}
                      />
                    </div>
                    {errors.facilityIds?.message && <ErrorMessage message={String(errors.facilityIds.message)} />}
                  </div>
                )}
              </div>
            </form>
          )}
          {careTeamDataLoading && <AddOrEditCareTeamSkeletonLoader />}
          </div>
        </ContentFrame>

        <ContentFooter className=" fixed bottom-0 w-full">
          <div className="flex space-x-4">
            <Button
              className='whitespace-nowrap'
              tabIndex={6}
              type="button"
              loading={createFormLoading || updateFormLoading}
              disabled={createFormLoading || updateFormLoading || careTeamDataLoading}
              onClick={() => {
                if (careTeamForm.current) {
                  careTeamForm.current.requestSubmit();
                }
              }}>
              Save
            </Button>
            <Button
              className='whitespace-nowrap'
              tabIndex={7}
              buttonStyle="bg-none"
              onClick={() => navigate(routes.admin.employee.list.build(UserStaffTypes.COUNSELLOR))}>
              Cancel
            </Button>
          </div>
        </ContentFooter>
    </>
  );
}

