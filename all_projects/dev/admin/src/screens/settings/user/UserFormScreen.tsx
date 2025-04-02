import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { customStyleSelectBox, OptionItem, DropdownIndicator } from 'components/ui/SelectBox';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Button from 'components/ui/button/Button';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { useMutation, useQuery } from '@apollo/client';
import {
  AssignUserManager,
  AssignUserManagerVariables,
  PretaaGetManagers,
  PretaaGetManagersVariables,
  PretaaGetManagers_pretaaGetManagers,
  UserDetails,
  UserDetailsVariables,
  UserPermissionNames,
} from 'generatedTypes';
import { getManagersList } from 'lib/mutation/user/get-managers';
import _ from 'lodash';
import { getUserDetails } from 'lib/query/user/user-details';
import catchError from 'lib/catch-error';
import usersApi from '../../../lib/api/users';
import { assignUserManager as assignUserManagerMutation } from 'lib/query/user/assign-user-manager';
import usePermission from 'lib/use-permission';
import { successList, errorList } from '../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

interface SelectOptions {
  value: number | string | boolean | undefined;
  label: string;
}

export default function UserFormScreen() {
  const userPermission = usePermission(UserPermissionNames.USER);
  const { id } = useParams() as any;
  const [openDialogue, setOpenDialogue] = useState(false);
  const [managersList, setManagersList] = useState<SelectOptions[]>([]);
  const [checked, setChecked] = useState(false);

  const optionUsers: SelectOptions[] = [
    { value: '', label: 'Select Users Department' },
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' },
  ];

  const optionSalary: SelectOptions[] = [
    { value: '', label: 'Salary Band' },
    { value: '10k-20k', label: '10k-20k' },
    { value: '21k-40k', label: '21k-40k' },
    { value: '41k-80k', label: '41k-80k' },
  ];

  const optionRegion: SelectOptions[] = [
    { value: '', label: 'Select Region' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'north', label: 'North' },
  ];

  const { data: userData } = useQuery<UserDetails, UserDetailsVariables>(getUserDetails, {
    variables: {
      userId: String(id),
    },
  });

  const [assignUserManager, { loading: mangerUpdating }] = useMutation<AssignUserManager, AssignUserManagerVariables>(assignUserManagerMutation);

  async function toggleUserStatus() {
    if (userPermission?.capabilities.EDIT) {
      try {
        const response = await usersApi.updateUserActive(id);
        if (response?.pretaaChangeUserStatus) {
          setChecked(response.pretaaChangeUserStatus.active);
        }
        if (response?.pretaaChangeUserStatus.active) {
          toast.success(successList.activeUser);
        } else {
          toast.success(successList.inActiveUser);
        }
      } catch (e) {
        catchError(e, true);
      }
    }
  }

  const [getManagers] = useMutation<PretaaGetManagers, PretaaGetManagersVariables>(getManagersList);

  const getDropdownItems = (list: PretaaGetManagers_pretaaGetManagers[]) => {
    return list?.map((managerInfo) => ({
      label: managerInfo.name,
      value: managerInfo.id,
    }));
  };

  useEffect(() => {
    async function getManagerList() {
      const { data: managers } = await getManagers({
        variables: {
          searchPhrase: '',
        },
      }); // eslint-disable-next-line react-hooks/exhaustive-deps

      if (managers?.pretaaGetManagers) {
        setManagersList(getDropdownItems(managers.pretaaGetManagers));
      }
    }
    getManagerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOptions = async (searchPhrase: string, callback: (options: any) => void) => {
    const { data: managers } = await getManagers({
      variables: {
        searchPhrase,
      },
    });
    if (managers?.pretaaGetManagers) {
      callback(getDropdownItems(managers.pretaaGetManagers));
    }
  };

  // Debounced search
  const delayedCallback = _.debounce(loadOptions, 1000);

  const handleInputChange = (searchPhrase: string, callback: any) => {
    delayedCallback(searchPhrase, callback);
  };

  const createUserSchema = Yup.object().shape({
    firstName: Yup.string().required(errorList.required),
    lastName: Yup.string().required(errorList.required),
    email: Yup.string().email(errorList.email).required(errorList.required),
    optionUsers: Yup.boolean(),
    optionSalary: Yup.boolean(),
    optionRegion: Yup.boolean(),
    manager: Yup.string().required(errorList.required),
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    register,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(createUserSchema) as unknown as any,
  });

  async function onSubmit(data: any) {
    if (userPermission?.capabilities.EDIT) {
      try {
        if (getValues('manager')) {
          const response = await assignUserManager({
            variables: {
              managerId: String(data.manager),
              userId: String(id),
            },
          });
          if (response.data) {
            toast.success(successList.managerAssign);
          }
        }
      } catch (e) {
        catchError(e, true);
      }
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.pretaaGetUserDetails) {
      setValue('firstName', userData.pretaaGetUserDetails.firstName);
      setValue('lastName', userData.pretaaGetUserDetails.lastName);
      setValue('email', userData.pretaaGetUserDetails.email);
      setValue('manager', userData.pretaaGetUserDetails.userManager[0]?.manager.id);
      setChecked(userData.pretaaGetUserDetails.active);
    }
  }, [setValue, userData]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.updateUser.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader title="Edit user" />
      <ContentFrame classes={['pb-0', 'flex', 'flex-col', 'flex-1']}>
        <form className="flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1 px-5 py-5 lg:px-16 lg:py-8 sm:px-15 sm:py-10">
            <div className="w-full md:w-3/5">
              <div className="mb-6">
                <label htmlFor="name" className="text-pt-gray-600">
                  Name
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-2">
                  <div className="w-full">
                    <input disabled type="text" className="input w-full cursor-not-allowed bg-gray-100" placeholder="Enter First Name" {...register('firstName')} />

                    <ErrorMessage message={errors?.firstName?.message} />
                  </div>

                  <div className="w-full">
                    <input disabled type="text" className="input w-full cursor-not-allowed bg-gray-100" placeholder="Enter Last Name" {...register('lastName')} />

                    <ErrorMessage message={errors?.lastName?.message} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 mb-6">
                <label htmlFor="email" className="text-pt-gray-600">
                  Email
                </label>

                <input disabled type="email" className="input mt-2 cursor-not-allowed bg-gray-100" placeholder="Enter User Email" {...register('email')} />

                <ErrorMessage message={errors?.email?.message} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-2 md:gap-6">
                <div className="grid grid-cols-1">
                  <label htmlFor="department" className="text-pt-gray-600">
                    Department
                  </label>

                  <Select
                    isDisabled={true}
                    className="basic-single rounded-lg mb-1  mt-2 bg-gray-100"
                    styles={customStyleSelectBox}
                    options={optionUsers}
                    name="department"
                    id="department"
                    components={{
                      Option: OptionItem,
                    }}
                  />

                  <ErrorMessage message={errors?.department?.message} />
                </div>

                <div className="grid grid-cols-1">
                  <label htmlFor="manager" className="text-pt-gray-600">
                    Manager
                  </label>

                  <Controller
                    control={control}
                    defaultValue={getValues('manager')}
                    name="manager"
                    render={({ field: { onChange, value, ref } }) => {
                      return (
                        <AsyncSelect
                          className="basic-single rounded-lg mb-1 bg-white mt-2"
                          styles={customStyleSelectBox}
                          defaultOptions={managersList}
                          loadOptions={handleInputChange}
                          inputRef={ref}
                          components={{
                            Option: OptionItem,
                            DropdownIndicator,
                          }}
                          onChange={(v) => onChange(v?.value)}
                          value={managersList.find((c) => c.value === value)}
                          options={[]}
                        />
                      );
                    }}
                  />

                  <ErrorMessage message={errors?.manager?.message} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-2 md:gap-6">
                <div className="grid grid-cols-1">
                  <label htmlFor="salary" className="text-pt-gray-600">
                    Salary Band
                  </label>
                  <Select
                    isDisabled={true}
                    className="basic-single rounded-lg mb-1 bg-gray-100 mt-2"
                    styles={customStyleSelectBox}
                    options={optionSalary}
                    name="salary"
                    id="salary"
                    components={{
                      Option: OptionItem,
                    }}
                  />
                  <ErrorMessage message={errors?.salary?.message} />
                </div>
                <div className="grid grid-cols-1">
                  <label htmlFor="region" className="text-pt-gray-600">
                    Region
                  </label>
                  <Select
                    isDisabled={true}
                    className="basic-single rounded-lg mb-1 bg-gray-100 mt-2"
                    styles={customStyleSelectBox}
                    options={optionRegion}
                    name="region"
                    id="region"
                    components={{
                      Option: OptionItem,
                    }}
                  />
                  <ErrorMessage message={errors?.region?.message} />
                </div>
              </div>
              <div className="flex flex-wrap items-center mt-10">
                <ToggleSwitch color="blue" checked={checked} onChange={toggleUserStatus} />
                <h3 className="text-base text-primary font-bold ml-3">Pretaa Active User</h3>
              </div>
            </div>
          </div>
          <div
            className={`bg-white flex flex-col md:flex-row py-4 px-5 sm:px-16
          ${id ? 'md:justify-between' : ''}`}>
            <div className="flex">
              <Button type="submit" loading={mangerUpdating} disabled={mangerUpdating}>
                Save
              </Button>
              <Button
                style="bg-none"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
        <ConfirmationDialog
          onConfirm={() => {
            setOpenDialogue(false);
          }}
          modalState={openDialogue}>
          Did you want to delete your account?
        </ConfirmationDialog>
      </ContentFrame>
    </div>
  );
}
