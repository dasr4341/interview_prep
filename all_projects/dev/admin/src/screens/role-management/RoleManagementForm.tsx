/* eslint-disable react-hooks/exhaustive-deps */
import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { useEffect, useState } from 'react';
import { range } from 'lodash';
import Button from 'components/ui/button/Button';
import 'scss/components/_role-management.scss';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CreateAdminRoleVariables, ViewRole, UpdateRoleVariables, UserPermissionNames } from 'generatedTypes';
import { GetPermissionsQuery } from 'lib/query/role-management/get-permissions';
import { ViewRoleQuery } from 'lib/query/role-management/get-roles-detail';
import { CreateAdminRoleMutation } from 'lib/mutation/role-management/create-role';
import { UpdateRoleMutation } from 'lib/mutation/role-management/update-role';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { PretaaGetPermissions, PretaaGetPermissionsEntity } from 'interface/permissions.interface';
import _ from 'lodash';
import usePermission from 'lib/use-permission';
import { successList } from '../../lib/message.json';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export function Loading() {
  return (
    <>
      {range(0, 5).map((i) => (
        <div className="ph-item" key={i}>
          <div className="ph-col-12">
            <div className="ph-row">
              <div className="ph-col-6"></div>
              <div className="ph-col-4 empty"></div>
              <div className="ph-col-2"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function RoleManagementCreate() {
  const { id }: { id?: string } = useParams() as any;
  const navigate = useNavigate();
  const [permissionsList, setPermissionsList] = useState<PretaaGetPermissionsEntity[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Array<string>>([]);
  const rolePermission = usePermission(UserPermissionNames.ROLE_MANAGEMENT);

  // Hooks for get all permissions
  const { error, data: getPermissionsList, loading } = useQuery<PretaaGetPermissions>(GetPermissionsQuery);
  // Hooks for get role detail
  const [getRoleDetails, { data: roleDetails }] = useLazyQuery<ViewRole>(ViewRoleQuery, {
    variables: {
      id: id as string,
    },
  });

  const schema = yup.object().shape({
    roleName: yup.string().trim().required('This field is required'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema) as unknown as any,
  });
  watch('roleName');

  // Hooks for creating new role
  const [createAdminRole, { loading: createAdminRoleLoading }] = useMutation(CreateAdminRoleMutation);
  // Hooks for updating new role
  const [updateAdminRole, { loading: updateAdminRoleLoading }] = useMutation(UpdateRoleMutation);

  useEffect(() => {
    if (getPermissionsList?.pretaaGetPermissions && !id) {
      setPermissionsList(getPermissionsList.pretaaGetPermissions);
    }
  }, [getPermissionsList]);

  useEffect(() => {
    if (id) getRoleDetails();
  }, [id]);

  function hasAllItemsChecked(capabilities: any, selectedPerms: Array<string>) {
    const hasItems = [];
    Object.keys(capabilities).forEach((key) => {
      if (selectedPerms.includes(String(capabilities[key]))) {
        hasItems.push(String(capabilities[key]));
      }
    });

    return hasItems.length === Object.keys(capabilities).length;
  }

  useEffect(() => {
    if (roleDetails?.pretaaViewRole) {
      setValue('roleName', roleDetails.pretaaViewRole.name);
      const selectedPerms = roleDetails.pretaaViewRole.capabilities.map((x) => String(x));
      setSelectedPermissions(selectedPerms);

      // Check if all items are selected
      if (getPermissionsList?.pretaaGetPermissions && id) {
        const permissions = getPermissionsList?.pretaaGetPermissions.map((p) => {
          return {
            ...p,
            isAllChecked: hasAllItemsChecked(p.capabilities, selectedPerms),
          };
        });
        setPermissionsList(permissions);
      }
    }
  }, [roleDetails, getPermissionsList?.pretaaGetPermissions]);

  const handleSelectedPermissions = (checked: boolean, roleId: number, name?: string) => {
    const filterObj = permissionsList.find((r) => r.name === name) as any;
    const ids = Object.keys(filterObj.capabilities).map((x) => String(filterObj.capabilities[x]));
    const permList = _.cloneDeep(permissionsList);
    const index = permList.findIndex((r) => r.name === name);
    if (checked) {
      if (selectedPermissions?.length === 0) setSelectedPermissions([String(roleId)]);
      else {
        setSelectedPermissions([...selectedPermissions, String(roleId)]);
      }
      const isAllChecked = ids.every((item) => [...selectedPermissions, String(roleId)].find((item2) => item === item2));
      if (isAllChecked) {
        permList[index].isAllChecked = true;
      }
    } else {
      const permission = selectedPermissions.filter((x) => x !== String(roleId));
      setSelectedPermissions(permission);
      permList[index].isAllChecked = false;
    }
    setPermissionsList(permList);
  };

  const handleAllSelectedPermissions = (checked: boolean, name: string) => {
    const filterObj = permissionsList.find((r) => r.name === name) as any;
    const ids = Object.keys(filterObj.capabilities).map((x) => String(filterObj.capabilities[x]));
    const permList = _.cloneDeep(permissionsList);
    const index = permList.findIndex((r) => r.name === name);

    if (checked && filterObj) {
      permList[index].isAllChecked = true;
      setSelectedPermissions(_.uniq([...selectedPermissions, ...ids]));
    } else {
      setSelectedPermissions(_.remove(selectedPermissions, (x) => !ids.includes(x)));
      permList[index].isAllChecked = false;
    }

    setPermissionsList(permList);
  };

  const saveRole = async () => {
    try {
      if (!id) {
        const createVariables: CreateAdminRoleVariables = {
          capabilities: selectedPermissions,
          name: getValues('roleName'),
        };
        const { data } = await createAdminRole({
          variables: createVariables,
        });
        if (data) {
          navigate(-1);
          toast.success(successList.roleCreate);
        }
      } else {
        const updateVariables: UpdateRoleVariables = {
          id: id,
          capabilities: selectedPermissions,
          name: getValues('roleName'),
        };
        const { data } = await updateAdminRole({
          variables: updateVariables,
        });
        if (data) {
          toast.success(successList.roleUpdate);
        }
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.roleCreate.name,
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(saveRole)}>
        <ContentHeader title={roleDetails?.pretaaViewRole?.name ? roleDetails?.pretaaViewRole?.name : 'New Role'} />
        <ContentFrame className="mb-28">
          <div>
            <div className="mb-10">
              <h2 className="text-md font-bold mb-6">{ !id ? 'New role name' : 'Edit role name' }</h2>
              <input
                data-testid="roleName"
                type="text"
                className="text-black
                placeholder:text-black border border-gray rounded-lg 
                bg-none mb-2 w-full md:w-96"
                placeholder="Enter a name"
                {...register('roleName')}
              />
              {errors && errors.roleName && <ErrorMessage message={errors?.roleName?.message} testId={'roleName-error'} />}
            </div>

            <h2 className="text-md font-bold mb-2">Privileges</h2>
            {error && <ErrorMessage message={error.message} />}
            {loading && permissionsList.length === 0 && <Loading />}
            {permissionsList?.length > 0 && (
              <div className="data-table-responsive w-full">
                <div className="data-table h-screen">
                  <div className="flex py-4 px-6 sticky top-16 lg:top-0 bg-gray-50">
                    <div className="flex w-1/4"></div>
                    <div className="flex-1 text-center text-base font-bold">All</div>
                    <div className="flex-1 text-center text-base font-bold">View</div>
                    <div className="flex-1 text-center text-base font-bold">Edit</div>
                    <div className="flex-1 text-center text-base font-bold">Execute</div>
                    <div className="flex-1 text-center text-base font-bold">Create</div>
                    <div className="flex-1 text-center text-base font-bold">Delete</div>
                  </div>
                  <div className="overflow-auto h-full pb-14">
                    {permissionsList.map((row, index) => {
                      return (
                        <div className="bg-white flex py-4 px-6  border-b border-gray-400 items-center" key={index}>
                          <div className="flex w-1/4">{row.label}</div>
                          <div className="flex-1 text-center">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              <input
                                checked={row.isAllChecked}
                                type="checkbox"
                                className={`appearance-none h-5 w-5 border border-primary-light
                          checked:bg-primary-light checked:border-transparent rounded-md form-tick cursor-pointer`}
                                onChange={(e) => handleAllSelectedPermissions(e.target.checked, row.name)}
                              />
                            </label>
                          </div>
                          <div className="flex-1 text-center">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              {row.capabilities.VIEW && (
                                <input
                                  type="checkbox"
                                  // eslint-disable-next-line max-len
                                  className={`appearance-none h-5 w-5 border border-primary-light checked:bg-primary-light 
                              checked:border-transparent rounded-md form-tick cursor-pointer`}
                                  checked={selectedPermissions.includes(String(row.capabilities.VIEW)) ? true : false}
                                  onChange={(e) => handleSelectedPermissions(e.target.checked, Number(row.capabilities.VIEW), row.name)}
                                />
                              )}
                            </label>
                          </div>
                          <div className="flex-1 text-center">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              {row.capabilities.EDIT && (
                                <input
                                  type="checkbox"
                                  className={`appearance-none h-5 w-5 border
                            border-primary-light cursor-pointer
                            checked:bg-primary-light checked:border-transparent
                              rounded-md form-tick`}
                                  checked={selectedPermissions.includes(String(row.capabilities.EDIT)) ? true : false}
                                  onChange={(e) => handleSelectedPermissions(e.target.checked, Number(row.capabilities.EDIT), row.name)}
                                />
                              )}
                            </label>
                          </div>
                          <div className="flex-1 text-center">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              {row.capabilities.EXECUTE && (
                                <input
                                  type="checkbox"
                                  className={`appearance-none h-5 w-5 border
                            border-primary-light cursor-pointer
                            checked:bg-primary-light checked:border-transparent
                              rounded-md form-tick`}
                                  checked={selectedPermissions.includes(String(row.capabilities.EXECUTE)) ? true : false}
                                  onChange={(e) => handleSelectedPermissions(e.target.checked, Number(row.capabilities.EXECUTE), row.name)}
                                />
                              )}
                            </label>
                          </div>
                          <div className="flex-1 text-center">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              {row.capabilities.CREATE && (
                                <input
                                  type="checkbox"
                                  value="Ticket_ID"
                                  className={`appearance-none h-5 w-5 border
                            border-primary-light cursor-pointer
                            checked:bg-primary-light checked:border-transparent
                              rounded-md form-tick`}
                                  checked={selectedPermissions.includes(String(row.capabilities.CREATE)) ? true : false}
                                  onChange={(e) => handleSelectedPermissions(e.target.checked, Number(row.capabilities.CREATE), row.name)}
                                />
                              )}
                            </label>
                          </div>
                          <div className="flex-1 text-center">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              {row.capabilities.DELETE && (
                                <input
                                  type="checkbox"
                                  value="Ticket_ID"
                                  className={`appearance-none h-5 w-5 border
                            border-primary-light cursor-pointer
                            checked:bg-primary-light checked:border-transparent
                              rounded-md form-tick`}
                                  checked={selectedPermissions.includes(String(row.capabilities.DELETE)) ? true : false}
                                  onChange={(e) => handleSelectedPermissions(e.target.checked, Number(row.capabilities.DELETE), row.name)}
                                />
                              )}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ContentFrame>
        {(createAdminRoleLoading || updateAdminRoleLoading) && <LoadingIndicator />}
        {(rolePermission?.capabilities.CREATE || rolePermission?.capabilities.EDIT) && (
          <div
            className="bg-white pt-6 pb-3 
          px-5 lg:px-16 sm:px-15 relative w-full
          md:fixed lg:fixed bottom-0 data-access-footer">
            <div className=" w-full block md:flex lg:flex">
              <Button classes="mx-auto md:mx-0 lg:mx-0" type="submit">
                Save
              </Button>
              <Button type="button" style="bg-none" classes="mx-auto md:mx-0 lg:mx-0" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
            <p className="italic text-xs text-gray-150 mt-3 uppercase">All Changes Must Be Actually Saved By Clicking A Save Button. Changes Will Not Be Automatically Changed</p>
          </div>
        )}
      </form>
    </>
  );
}
