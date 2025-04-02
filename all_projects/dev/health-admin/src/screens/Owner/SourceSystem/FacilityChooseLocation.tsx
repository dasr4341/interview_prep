import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimezoneSelect, { ITimezoneOption } from 'react-timezone-select';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import './_facility-form.scoped.scss';
import { DropdownIndicator, FacilityKipuLocationArgs, timezoneCustomStylesSelectBox } from './lib/FacilityFormHelper';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import messagesData from 'lib/messages';
import { FacilityFormContextData } from './FacilityFormContext';
import { useMutation } from '@apollo/client';
import { pretaaAdminCreateFacilityForEMR } from 'graphql/adminCreateFacilityForEMR.mutation';
import useQueryParams from 'lib/use-queryparams';
import catchError from 'lib/catch-error';
import { routes } from 'routes';
import { AdminCreateFacilityForEMR, AdminCreateFacilityForEMRVariables } from 'health-generatedTypes';
import FacilityChooseLocationSkeleton from '../skeletonLoader/FacilityChooseLocationSkeleton';

export default function FacilityChooseLocation() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const query = useQueryParams();
  const {
    setValue,
    trigger,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedTimezoneValue] = useState<ITimezoneOption>({
    label: '',
    value: '',
  });

  const { dynamicFieldValue, facilitiesLocations } = useContext(FacilityFormContextData);
  const [selectedTimezones, setSelectedTimezones] = useState<FacilityKipuLocationArgs[]>([]);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
  const [loadingState, setLoadingState] = useState(true);

  const handleCheckboxChange = (locationId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCheckboxes([...selectedCheckboxes, locationId]);
    } else {
      setSelectedCheckboxes(selectedCheckboxes.filter((id) => id !== locationId));
    }
  };

  // create facility for kipu
  const [createFacilityForKipu, { loading: creatingForm }] = useMutation<
    AdminCreateFacilityForEMR,
    AdminCreateFacilityForEMRVariables
  >(pretaaAdminCreateFacilityForEMR);

  const createFacility = () => {
    const filteredLocationList = selectedTimezones.filter((e) => selectedCheckboxes.includes(+e.locationId));
    createFacilityForKipu({
      variables: {
        accountId: String(clientId),
        dynamicFields: [...dynamicFieldValue],
        sourceSystemId: query.systemId,
        locations: filteredLocationList ? filteredLocationList : null,
      },
      onCompleted: (res) => {
        if (res.pretaaHealthAdminCreateFacilityForEmr) {
          toast.success(
            `${
              selectedTimezones.length > 1 ? 'Facilities added successfully' : messagesData.successList.createFacility
            }`,
          );
          navigate(routes.owner.FacilityManagement.build(String(clientId)));
        }
      },
      onError: (e) => {
        catchError(e, true);
      },
    });
  };

  const onSubmit = () => {
    if (facilitiesLocations && facilitiesLocations?.length > 0) {
      if (selectedCheckboxes.length === 0) {
        toast.error('Please select at least one facility');
      } else {
        createFacility();
      }
    } else {
      createFacility();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadingState(false);
    }, 3000);
  }, []);

  return (
    <div>
      <ContentHeader
        title="Choose Location"
        disableGoBack={true}
      />
   
        <form onSubmit={handleSubmit(onSubmit)}>
          <ContentFrame>
            {loadingState && <FacilityChooseLocationSkeleton />}
            {!loadingState && (
              <div className="sm:flex flex-wrap justify-start gap-10 pb-28">
                {facilitiesLocations &&
                  facilitiesLocations?.length > 0 &&
                  facilitiesLocations?.map((el) => {
                    return (
                      <div
                        key={el?.locationId}
                        className="pt-6 sm:pt-0">
                        <div className="flex justify-center space-x-4 mb-1">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              setValue(String(el?.locationId), e.target.checked);
                              handleCheckboxChange(el?.locationId, e.target.checked);
                            }}
                            className={` h-5 w-5 border border-primary-light checked:bg-primary-light checked:border-transparent
             rounded-md  ${true ? 'checkbox' : ''}`}
                          />
                        </div>

                        <div className="w-64 mx-auto py-8 px-5 box-shadow">
                          <h2 className="text-xsm font-bold mb-2">{el?.locationName}</h2>
                          <div className="mt-4">
                            <Controller
                              name={el?.locationName}
                              control={control}
                              rules={{
                                required: selectedCheckboxes.includes(el?.locationId) ? true : false,
                              }}
                              render={({ field: { onChange } }) => (
                                <TimezoneSelect
                                  isDisabled={getValues(String(el.locationId)) ? false : true}
                                  id={String(el?.locationId)}
                                  styles={timezoneCustomStylesSelectBox}
                                  labelStyle="altName"
                                  placeholder="Select Time Zone"
                                  value={selectedTimezoneValue}
                                  components={{
                                    IndicatorSeparator: () => null,
                                    DropdownIndicator,
                                  }}
                                  onChange={(e) => {
                                    onChange(e);
                                    setValue(String(el?.locationId), {
                                      locationId: el.locationId,
                                      locationName: e.value,
                                      timeZone: e.value,
                                      offset: e.value,
                                    });

                                    const selectedTimezone = {
                                      locationId: String(el.locationId),
                                      locationName: String(el.locationName),
                                      timeZone: String(e.value),
                                      offset: String(e.offset),
                                    };

                                    setSelectedTimezones((prevState) => {
                                      // Remove existing entry with the same locationId
                                      const filteredTimezones = prevState.filter(
                                        (timezone) => timezone.locationId !== String(el.locationId),
                                      );
                                      // Add the newly selected timezone
                                      return [...filteredTimezones, selectedTimezone];
                                    });
                                    trigger(String(el?.locationId));
                                  }}
                                  className="app-react-select"
                                />
                              )}
                            />
                          </div>
                          {errors[String(el?.locationName)] &&
                            errors[String(el?.locationName)]?.type === 'required' && (
                              <ErrorMessage message={messagesData.errorList.required} />
                            )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </ContentFrame>

          <div className="fixed bottom-0 w-full">
            <ContentFooter>
              <div className="flex flex-wrap justify-between w-full">
                <div className="flex">
                  <Button
                    type="submit"
                    disabled={creatingForm}
                    loading={creatingForm}>
                    Create
                  </Button>
                  <Button
                    buttonStyle="bg-none"
                    type="button"
                    onClick={() => {
                      navigate(-1);
                    }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </ContentFooter>
          </div>
        </form>
      
    </div>
  );
}
