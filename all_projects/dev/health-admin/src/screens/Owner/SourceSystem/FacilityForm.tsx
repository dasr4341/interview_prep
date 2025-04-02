import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { useLazyQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import TimezoneSelect, { ITimezoneOption } from 'react-timezone-select';
import { useViewportSize } from '@mantine/hooks';

import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import {
  AdminCreateFacility,
  AdminCreateFacilityVariables,
  AdminGetSourceSystemById,
  AdminGetSourceSystemById_pretaaHealthAdminGetSourceSystemById_staticFields,
  AdminSourceSystemFields,
  AdminUpdateSourceSystemValuesByFacilityId,
  AdminUpdateSourceSystemValuesByFacilityIdVariables,
  PlatformTypes,
  SourceSystemTypes,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import messagesData from 'lib/messages';
import { routes } from 'routes';
import FacilityFormSkeletonLoader from '../skeletonLoader/FacilityFormSkeletonLoader';
import { adminSourceSystemFormFields } from 'graphql/adminSouceSystemFields.query';
import {
  FacilityRouteQuery,
  customTimeZoneStylesSelectBox,
} from './lib/FacilityFormHelper';
import { adminCreateFacility } from 'graphql/adminCreateFacility.mutation';
import { FacilityFormContextData } from './FacilityFormContext';
import { updateFacilityForAdmin } from 'graphql/updateFacilityForAdmin';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { getSourceSystemById } from 'graphql/getAdminSourceSystemById.query';

export default function FacilityForm() {
  const { width: screenWidth } = useViewportSize();
  const { facilityId, clientId } = useParams();
  const [syncCareTeam, setSyncCareTeam] = useState(true);
  const query: FacilityRouteQuery = queryString.parse(location.search) as any;
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, trigger, control, formState, reset: formReset, setError } = useForm();
  const { setDynamicFieldValue, setFacilitiesLocation } = useContext(FacilityFormContextData);
  const isEHR = query?.systemSlug?.includes(SourceSystemTypes.ehr);
  const isRitten = query?.systemSlug?.includes(SourceSystemTypes.ritten);
  const [showStaticFields, setShowStaticFields] = useState<AdminGetSourceSystemById_pretaaHealthAdminGetSourceSystemById_staticFields | null>();

  const [selectedTimezone, setSelectedTimezone] = useState<ITimezoneOption>({
    label: '',
    value: '',
  });

  // to get dynamic field
  const [getAdminDynamicFields, { data: adminSystemFields, loading: formFieldsLoadingState }] =
    useLazyQuery<AdminSourceSystemFields>(adminSourceSystemFormFields, {
      variables: {
        sourceSystemId: query.systemId,
      },
    });

  // create facility
  const [createFacilityForm, { error: mutationError, reset, loading: createFormLoading }] = useMutation<
    AdminCreateFacility,
    AdminCreateFacilityVariables
  >(adminCreateFacility);

  // update facility
  const [updateFacilityDetail, { loading: updateFormLoading }] = useMutation<
    AdminUpdateSourceSystemValuesByFacilityId,
    AdminUpdateSourceSystemValuesByFacilityIdVariables
  >(updateFacilityForAdmin);

  // get fields by sourceSystemId
  const [getSourceSystemFields] = useLazyQuery<AdminGetSourceSystemById>(getSourceSystemById, {
    onCompleted: (d) => setShowStaticFields(d.pretaaHealthAdminGetSourceSystemById.staticFields),
    onError: (e) => catchError(e, true)
  });

  const onSubmit = (data: any) => {
    let hasError = false;
    const ids = adminSystemFields?.pretaaHealthAdminSourceSystemFields.map((e) => e.id) || [];
    const kipuFieldsData = ids.map((e) => data[e]).some((e) => e.length > 0);

    if (ids.length > 0 && kipuFieldsData) {
      adminSystemFields?.pretaaHealthAdminSourceSystemFields.forEach((e) => {
        if (!data[e.id]) {
          hasError = true;
          setError(e.id, { message: 'This field is required', type: 'required' });
        }
      });
    } else if (!kipuFieldsData) {
      data.dynamicFields = [];
    }

    if (hasError) {
      return;
    }

    if (facilityId) {
      updateFacilityDetail({
        variables: {
          facilityId: facilityId,
          dynamicFields: data.dynamicFields ? [...data.dynamicFields] : [],
        },
        onCompleted: () => {
          formReset();
          toast.success(messagesData.successList.updateFacility);
          navigate(routes.owner.FacilityManagement.build(String(clientId)));
        },
        onError: (e) => {
          catchError(e, true);
        },
      });
    } else if (query.systemId) {
      createFacilityForm({
        variables: {
          pretaaHealthAdminCreateFacilityAccountId2: String(clientId),
          platformType: PlatformTypes.FITBIT,
          dynamicFields: data.dynamicFields ? [...data.dynamicFields] : [],
          facilityName: data.facilityName,
          sourceSystemId: query.systemId,
          timeZone: (isEHR || showStaticFields?.timezone) ? String(selectedTimezone.value) : null,
          offset: (isEHR || showStaticFields?.timezone) ? String(selectedTimezone.offset) : '',
          fetchCareTeam: !isEHR && syncCareTeam,
        },
        onCompleted: (val) => {
          formReset();
          const filteredLocationsList = val.pretaaHealthAdminCreateFacility.locations?.filter((item) => !item.exists);
            if (filteredLocationsList?.length) {
              setFacilitiesLocation(filteredLocationsList);
              navigate(
                routes.owner.facilityChooseLocation.build(String(clientId), {
                  systemId: query.systemId,
                }),
              )
          } else if (filteredLocationsList?.length === 0 && !(isEHR || isRitten)) {
            toast.success('Facility already added');
            navigate(routes.owner.FacilityManagement.build(String(clientId)));
          } else  {
            toast.success(messagesData.successList.createFacility);
            navigate(routes.owner.FacilityManagement.build(String(clientId)));
          }
        },

        onError: (e) => {
          catchError(e, true);
        },
      });
    }
   
    setDynamicFieldValue(data.dynamicFields);
  };

  const onChanges = () => {
    if (mutationError) {
      reset();
      setDynamicFieldValue([]);
    }
  };

  useEffect(() => {
     if (query.systemId) {
      getAdminDynamicFields({
        variables: {
          sourceSystemId: query.systemId,
        },
      });
    }
  }, [getAdminDynamicFields, query.systemId]);

  useEffect(() => {
    if (!facilityId) {
      getSourceSystemFields({
        variables: {
          sourceSystemId: query.systemId
        }
      });
    }
  }, []);

  const buttons = () => (
    <>
      <Button
        text="Save"
        type="submit"
        loading={createFormLoading || updateFormLoading}
        disabled={createFormLoading || updateFormLoading}
      />
      <Button
        text="Cancel"
        type="button"
        buttonStyle="bg-none"
        onClick={() => navigate(-1)}
      />
    </>
  );
  
  return (
    <>
      <ContentHeader title={facilityId ? query.facilityName : query.systemName} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={onChanges}
        className="flex flex-col md:flex-1">
        <ContentFrame className="flex flex-col md:flex-1">
          <div className="flex flex-col md:max-w-1/2">
            {(formFieldsLoadingState) && <FacilityFormSkeletonLoader />}

            {!(formFieldsLoadingState) && (isEHR || showStaticFields?.facilityName) && (
              <div className="flex flex-col mb-4">
                <label className="text-base text-primary mb-1.5">Facility Name</label>
                <input
                  type="text"
                  {...register('facilityName', {
                    required: isEHR,
                    validate: (v) => !!v.trim().length || messagesData.errorList.spaceNotAllowed,
                  })}
                  placeholder="Enter Facility Name"
                  className="rounded-lg border border-gray-300 text-gray-750 text-xsm font-normal px-4 py-4 
                    focus:outline-none focus:ring-0 focus:border-transparent hover:border-yellow-550"
                />

                {formState.errors.facilityName?.type === 'required' && (
                  <ErrorMessage message={messagesData.errorList.required} />
                )}
                {formState.errors.facilityName?.type === 'validate' && (
                  <ErrorMessage message={messagesData.errorList.required} />
                )}
                {(isEHR || showStaticFields?.timezone) && (
                  <div className="mt-4">
                    <label className="text-base text-primary mt-4">Timezone</label>
                    <Controller
                      name="timezone"
                      control={control}
                      rules={{
                        required: isEHR,
                      }}
                      render={({ field: { onChange } }) => (
                        <TimezoneSelect
                          styles={customTimeZoneStylesSelectBox}
                          labelStyle="altName"
                          placeholder="Select timezone..."
                          value={selectedTimezone}
                          onChange={(e) => {
                            onChange(e);
                            setValue('timezone', e.value);
                            trigger('timezone');
                            setSelectedTimezone({
                              label: e.value,
                              offset: e.offset,
                              value: e.value,
                            });
                          }}
                          className="app-react-select mt-1.5"
                        />
                      )}
                    />
                    {formState.errors?.timezone && <ErrorMessage message={messagesData.errorList.required} />}
                  </div>
                )}
              </div>
            )}

            {
              !formFieldsLoadingState &&
              !!adminSystemFields?.pretaaHealthAdminSourceSystemFields?.length &&
              adminSystemFields?.pretaaHealthAdminSourceSystemFields.map((field, index) => (
                <div
                  className="flex flex-col mb-4 "
                  key={field.id}>
                  <label className="capitalize text-base text-primary mb-1.5">{field.name.toLowerCase()}</label>
                  <input
                    type="text"
                    {...register(field.id, { required: !facilityId })}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    onBlur={(e) => {
                      setValue(field.id, e.target.value.trim());
                      trigger(field.id);

                      setValue(`dynamicFields.${index}.value`, e.target.value.trim());
                      setValue(`dynamicFields.${index}.id`, field.id);
                      trigger(`dynamicFields.${index}.id`);
                    }}
                    className="rounded-lg border border-gray-300 text-gray-750 text-xsm font-normal px-4 py-4 
                    focus:outline-none focus:ring-0 focus:border-transparent hover:border-yellow-550"
                  />

                  {formState.errors[field.id]?.type === 'required' && (
                    <ErrorMessage message={messagesData.errorList.required} />
                  )}
                </div>
              ))}
            {!formFieldsLoadingState && !facilityId && !query?.systemSlug?.includes(SourceSystemTypes.ehr) && (
              <div className="mt-2">
                <div className='flex items-center gap-x-2.5 text-primary'>
                  <label className="capitalize text-base">Sync Care Team</label>
                  <ToggleSwitch
                    color="blue"
                    checked={syncCareTeam}
                    onChange={(val) => {
                      setValue('syncCareTeam', val);
                      trigger('syncCareTeam');
                      setSyncCareTeam(!syncCareTeam);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </ContentFrame>
        {screenWidth > 768 && <ContentFooter>{buttons()}</ContentFooter>}

        {screenWidth < 768 && <div className="px-4 pb-5 flex">{buttons()}</div>}
      </form>
    </>
  );
}
