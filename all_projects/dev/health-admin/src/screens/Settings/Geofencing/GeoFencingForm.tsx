import React, { useEffect, useRef, useState } from 'react';
import { Radio, Slider } from '@mantine/core';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { config } from 'config';

import { ContentHeader } from 'components/ContentHeader';
import TextInputFields from 'components/TextInputFields';
import './_geo-fencing.scoped.scss';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import Button from 'components/ui/button/Button';
import ThumbIcon from 'components/icons/ThumbIcon';
import {
  CreateGeoFence,
  CreateGeoFenceVariables,
  GeoFencingTypes,
  GetPatientName,
  GetPatientNameVariables,
  PretaaHealthViewGeoFence,
  PretaaHealthViewGeoFenceVariables,
  UpdateGeoFence,
  UpdateGeoFenceForCounselors,
  UpdateGeoFenceForCounselorsVariables,
  UpdateGeoFenceVariables,
  UserTypeRole,
} from 'health-generatedTypes';
import messagesData from 'lib/messages';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { createCounselorGeoFencing, createGeoFencing } from 'graphql/CreateGeoFencing.mutation';
import catchError from 'lib/catch-error';
import { viewGeoFence } from 'graphql/viewGeoFenceArea.query';
import { updateGeoFence, updateGeoFenceForCounselor } from 'graphql/updateGeoFeance.mutation';
import SearchIcon from 'components/icons/SearchIcon';
import { sliderBarStyles, useStyles } from './GeoFencingDesign';
import useUserLocation from 'lib/useUserLocation';
import { delay } from 'lodash';
import { mapLoader } from 'lib/map-loader';
import { geoFencingMapStyle } from 'screens/Patient/GeoFencing/LastLocations';
import { meterToMiles } from 'lib/meter-to-miles';
import { fullNameController } from 'components/fullName';
import { getPatientNameQuery } from 'graphql/patient-name.query';
import useSelectedRole from 'lib/useSelectedRole';
import SelectedFacilityList from 'components/SelectFacilityList/SelectedFacilityList';

let mapInstance: google.maps.Map;
interface GoogleMapCircle extends google.maps.Circle {
  id: string;
}

// Place autocomplete using google map
const options = {
  fields: ['address_components', 'geometry', 'icon', 'name', 'formatted_address'],
  strictBounds: false,
};

interface LatLng {
  lat: number;
  lng: number;
}
interface LocationData {
  latLng: LatLng;
  radius: number;
}


let circleMarker: GoogleMapCircle | null = null;

interface FormFields {
  name: string;
  type: GeoFencingTypes;
  status: boolean;
  patientId?: string | null;
  location: string;
  latitude: any;
  longitude: any;
  radius: number;
  facilityId?: string | null;
}


export default function GeoFencingForm() {
  const { classes } = useStyles();

  const params = useParams();
  const navigate = useNavigate();

  const googleMapRef = useRef<HTMLDivElement | null>(null);
  const locationAutoCompleteRef = useRef<any>();
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const [radius, setRadius] = useState<number>(200);
  const [patientHeading, setPatientHeading] = useState<string>();
  const [selectedForToggle, setSelectedForToggle] = useState<boolean>(true);
  const [isFacilityIDRequired, setIsFacilityIDRequired] = useState<boolean>();
  const [patientFacilityId, setPatientFacilityId] = useState('');

  const geoLocation = useUserLocation();
  const isClinician = useSelectedRole({ roles: [UserTypeRole.COUNSELLOR] });

  
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      type: GeoFencingTypes.IN,
      radius: 200,
      status: true,
    },
  });

  function initMap(): void {
    if (googleMapRef.current) {
      mapInstance = new google.maps.Map(googleMapRef.current, {
        zoom: config.map.minZoom,
        mapTypeControl: false,
        center: geoLocation,
        styles: geoFencingMapStyle,
        streetViewControl: false,
      });
    }
  }

  function findAddressByLatLng(latLng: { lat: number; lng: number }) {
    const geocoder = new google.maps.Geocoder();

    geocoder
      .geocode({ location: latLng })
      .then((response) => {
        if (response.results[0]) {
          circleMarker?.setCenter(latLng);
          setValue('name', response.results[0].formatted_address);
          setValue('latitude', String(latLng.lat));
          setValue('longitude', String(latLng.lng));
          setValue('location', response.results[0].formatted_address);
          if (locationInputRef.current) {
            locationInputRef.current.value = response.results[0].formatted_address;
          }
        } else {
          console.log('No results found');
        }
      })
      .catch((e) => toast.error(e.message));
  }

  function createCircle() {
    const circleData: LocationData = {
      latLng: {
        lat: Number(getValues('latitude')),
        lng: Number(getValues('longitude')),
      },
      radius: Number(getValues('radius')),
    };
    // updating the circle
    circleMarker?.setCenter(circleData.latLng);
    circleMarker?.setRadius(circleData.radius);
    // now creating the new circle
    const marker = new google.maps.Circle({
      clickable: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      map: mapInstance,
      center: circleData.latLng,
      radius: circleData.radius,
    }) as GoogleMapCircle;

    // storing the reference
    circleMarker = marker;

    google.maps.event.addListener(marker, 'dragend', (e: any) => {
      findAddressByLatLng({
        lat: e.latLng.lat() as number,
        lng: e.latLng.lng() as number,
      });
    });

    const bounds = circleMarker.getBounds();

    // Zoom Programmatically in viewport
    if (bounds) {
      mapInstance.fitBounds(bounds);
    }
  }

  useEffect(() => {
    delay(() => {
      mapLoader
        .load()
        .then(() => {
          console.log('loaded');
        })
        .catch((e) => console.error(e));
      mapLoader.loadCallback((e) => {
        if (e) {
          console.log(e);
        } else {
          initMap();
        }
      });
    }, 1000);
  }, []);

  function addListenerForLocationSearch() {
    const place: google.maps.places.PlaceResult = locationAutoCompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.error('No place selected');
    } else if (place.geometry && locationInputRef.current) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setValue('latitude', String(lat));
      setValue('longitude', String(lng));
      setValue('location', locationInputRef.current.value);
      setValue('name', String(place.name));

      if (circleMarker) {
        circleMarker.setMap(null);
        circleMarker = null;
      }

      createCircle();
    }
  }

  useEffect(() => {
    setTimeout(() => {
      mapLoader
        .load()
        .then(() => {
          if (locationInputRef?.current) {
            locationAutoCompleteRef.current = new google.maps.places.Autocomplete(locationInputRef?.current, options);

            google.maps.event.addListener(
              locationAutoCompleteRef.current,
              'place_changed',
              addListenerForLocationSearch,
            );
          }
        })
        .catch((e) => console.error(e));

      return () => {
        locationAutoCompleteRef.current = null;
        google.maps.event.clearListeners(locationAutoCompleteRef.current, 'place_changed');
      };
    }, 1000);
  }, []);
  //Place autocomplete using google map end

  useEffect(() => {
    if (params.patientId) {
      setValue('patientId', params.patientId);
    }
  }, [params.patientId]);

  function onCompleteCreateUpdate(type: 'create' | 'update') {
    const message = type === 'create' ? 'Geofences created successfully' : 'Geofences updated successfully';
    toast.success(message);
    if (params.patientId && !location.pathname.includes('events')) {
      navigate(routes.listView.build(params.patientId));
      return;
    } else if (location.pathname.includes('events')) {
      navigate(routes.eventsListView.build(String(params.patientId), String(params.eventId)));
      return;
    }
    navigate(routes.geofencing.listView.match);
  }

  //GeoFence view
  const [geoFenceDetail, { data: fenceDetails, loading: loadingFence }] = useLazyQuery<
    PretaaHealthViewGeoFence,
    PretaaHealthViewGeoFenceVariables
  >(viewGeoFence, {
    onCompleted: (data) => {
      if (data.pretaaHealthViewGeoFence) {
        const value = data.pretaaHealthViewGeoFence;
        setValue('name', value.name || '');
        setValue('radius', value.radius || 0);
        setRadius(value.radius || 0);
        setValue('status', value.status);
        setValue('type', value.type);
        setValue('location', value.location);
        setValue('latitude', String(value.latitude));
        setValue('longitude', String(value.longitude));
        setValue('type', value.type);
        setSelectedForToggle(value.status);

        delay(createCircle, 3000);
      }
    },
    onError: e => catchError(e, true),
    fetchPolicy: 'network-only',
  });

  // GeoFence create
  const [createGeoFencingForm, { error: mutationError, reset, loading: createFormLoading }] = useMutation<
    CreateGeoFence,
    CreateGeoFenceVariables
  >(createGeoFencing, {
    onCompleted: () => onCompleteCreateUpdate('create'),
    onError: (e) => catchError(e, true),
  });

  const [createFencingForPatient, { loading: createFencingForPatientLoading }] = useMutation<
    CreateGeoFence,
    CreateGeoFenceVariables
  >(createCounselorGeoFencing, {
    onCompleted: () => onCompleteCreateUpdate('create'),
    onError: (e) => catchError(e, true),
  });
  // --------------

  // GeoFence update
  const [updateGeoFenceDetail, { loading: updateFormLoading }] = useMutation<UpdateGeoFence, UpdateGeoFenceVariables>(
    updateGeoFence,
    {
      onCompleted: () => onCompleteCreateUpdate('update'),
      onError: (e) => catchError(e, true),
    },
  );

  const [updateGeofencesCounselor, { loading: updateFenceCounselorLoading }] = useMutation<
    UpdateGeoFenceForCounselors,
    UpdateGeoFenceForCounselorsVariables
  >(updateGeoFenceForCounselor, {
    onCompleted: () => onCompleteCreateUpdate('update'),
    onError: (e) => catchError(e, true),
  });
  // --------------------

  const onSubmit = async (data: FormFields) => {
    data = {
      ...data,
      latitude: Number(data.latitude) as any,
      longitude: Number(data.longitude) as any,
    }
    try {
      if (isClinician && params.fenceId) {
        await updateGeofencesCounselor({
          variables: {
            fenceId: params.fenceId,
            name: data.name,
            location: data.location,
            type: data.type,
            status: data.status,
            radius: data.radius,
            latitude: data.latitude,
            longitude: data.longitude,
            patientId: String(data.patientId),
          },
        });
      } else if (isClinician) {
        createFencingForPatient({
          variables: {
            ...data,
            latitude: data.latitude,
            longitude: data.longitude,
            status: selectedForToggle
          },
        });
      } else if (params.fenceId) {
        await updateGeoFenceDetail({
          variables: {
            fenceId: params.fenceId,
            name: data.name,
            location: data.location,
            type: data.type,
            status: data.status,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
          },
        });
      } else {
        createGeoFencingForm({
          variables: {
            ...data,
            facilityId: getValues('facilityId') || patientFacilityId,
            status: selectedForToggle
          },
        });
      }
    } catch (e: any) {
      catchError(e, true);
    }
  };

  const resetForm = () => {
    if (mutationError) {
      reset();
    }
  };

  // get patient detail
  const [getPatientName, { loading: titleLoading }] = useLazyQuery<GetPatientName, GetPatientNameVariables>(
    getPatientNameQuery,
    {
      onCompleted: (d) => {
        setPatientHeading(
          fullNameController(d.pretaaHealthPatientDetails.firstName, d.pretaaHealthPatientDetails.lastName),
        );
        if (d.pretaaHealthPatientDetails.userFacilities) {
          setPatientFacilityId(d.pretaaHealthPatientDetails.userFacilities[0].id);
        }
      },
      onError: (e) => catchError(e, true)
    },
  );

  useEffect(() => {
    if (params.patientId) {
      getPatientName({
        variables: {
          patientId: params.patientId,
        },
      });
    }
  }, [params.patientId]);


  useEffect(() => {
    if (params.fenceId) {
      geoFenceDetail({
        variables: {
          fenceId: params.fenceId,
        },
      });
    }
    //
  }, [params.fenceId]);

  watch('facilityId');

  const updateLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('location', e.target.value);
    if (!e.target.value) {
      setValue('latitude', '');
      setValue('longitude', '');
    }
  }

  return (
    <div>
      {!params.patientId && (
        <ContentHeader
          title="Geofence Area"
          className="lg:pt-14"
        />
      )}
      {params.patientId && (
        <ContentHeader
          title={patientHeading}
          titleLoading={titleLoading}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={resetForm}>
        <div className="px-6 lg:px-16 mt-7">
          <div className="fieldWidth">
            {(!params.patientId && !params.fenceId) && (
                <div className='mb-7'>
                     <Controller
                       name="facilityId"
                       control={control}
                       rules={{
                         required: isFacilityIDRequired,
                       }}
                       render={({ field: { onChange } }) => (
                         <SelectedFacilityList
                           onInt={setIsFacilityIDRequired}
                           labelStyle="text-xsm font-semibold text-gray-750 mb-2"
                           onChange={(e) => {
                             onChange(e);
                             setValue('facilityId', e);
                             trigger('facilityId');
                           }}
                         />
                       )}
                       />
                      {errors.facilityId && <ErrorMessage message={messagesData.errorList.required} />}
                     </div>
            )}
         
      
            <div>
              <label className="block text-xsm font-normal text-gray-750 mb-2">Name</label>
              <TextInputFields
                placeholder="Total Wine & More"
                type="text"
                register={register('name', {
                  required: true
                })}
              />
              {errors.name && <ErrorMessage message={messagesData.errorList.required} />}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center pt-7 gap-7">
              <div className="text-xsm font-normal text-gray-750">Types of geofence</div>
              <div>
                {!loadingFence && (
                  <Radio.Group
                    defaultValue={
                      fenceDetails?.pretaaHealthViewGeoFence?.type
                        ? fenceDetails?.pretaaHealthViewGeoFence?.type
                        : GeoFencingTypes.IN
                    }
                    name="geofences-type"

                    onChange={(type) => {
                      setValue('type', type as GeoFencingTypes);
                      trigger('type');
                    }}
                    className="flex flex-row radio-group">
                    {Object.values(GeoFencingTypes).map((label) => (
                      <Radio
                        size='md'
                        key={label}
                        value={label}
                        label={label.replaceAll('_', ' ')}
                        className="mb-0 text-xsm font-normal text-gray-750 uppercase mr-4 custom-radio"
                      />
                    ))}
                  </Radio.Group>
                )}
              </div>
            </div>
            <div className="flex gap-5 pt-8">
              <div className="block text-xsm font-normal text-gray-750 mt-1">Radius</div>
              <div className="flex-auto sliderWidth">
                <Controller
                  control={control}
                  name="radius"
                  render={({ field: { value, onChange } }) => (
                    <Slider
                      classNames={classes}
                      thumbChildren={<ThumbIcon />}
                      size="xl"
                      styles={sliderBarStyles}
                      min={200}
                      max={3218.69}
                      step={10}
                      label={(v) => {
                        return meterToMiles(+v);
                      }}
                      onChange={(val) => {
                        onChange(val);
                        setValue('radius', val);
                        setRadius(val);
                        if (circleMarker) {
                          circleMarker.setRadius(val);
                        }
                      }}
                      value={value}
                    />
                  )}
                />
              </div>
              <div className="block text-xss font-normal text-gray-600 mt-1.5">
                {meterToMiles(
                  radius || fenceDetails?.pretaaHealthViewGeoFence?.radius || meterToMiles(+getValues('radius')),
                )}
                mi
              </div>
            </div>
            {errors.radius?.message && <ErrorMessage message={errors.radius?.message} />}
            <div className="relative mt-10">
              <label className="block text-xsm font-normal text-gray-750 mb-2">Location</label>
              <input type="hidden" {...register('latitude', {
                      required: true
                     })} />
              <Controller
                control={control}
                name="location"
                render={() => (
                  <div>
                    <input
                     {...register('location', {
                      required: true
                     })}
                      placeholder="Search a location"
                      className="rounded-lg flex-1 appearance-none border pr-10 border-gray-300 w-full
                          bg-white text-gray-750  text-xsm font-normal px-4 py-4 truncate
                            focus:outline-none focus:ring-0 hover:border-yellow-550 focus:border-transparent"
                      ref={locationInputRef}
                      defaultValue={fenceDetails?.pretaaHealthViewGeoFence?.location}
                      onBlur={updateLocation}
                      onChange={updateLocation}
                    />

                    <button
                      className="absolute right-0 top-0 mt-10 mr-4 cursor-default"
                      type="button">
                      <SearchIcon />
                    </button>
                  </div>
                )}
              />
              {errors.location  && <ErrorMessage message={messagesData.errorList.required} />}
              {!errors.location && errors.latitude && <ErrorMessage message="Enter valid location" />}
            </div>
            <div className="pt-7 flex gap-5">
              <div className="text-xsm font-normal text-gray-750 mt-2">Status</div>
              <div>
                {(!createFormLoading || !loadingFence || !createFencingForPatientLoading) && (
                  <ToggleSwitch
                    color="blue"
                    onChange={(val) => {
                      setValue('status', val);
                      setSelectedForToggle(!selectedForToggle);
                      trigger('status');
                    }}
                    checked={selectedForToggle}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full pt-9 pb-36">
            <div
              id="map"
              ref={googleMapRef}
              style={{ height: '400px', width: '100%' }}></div>
          </div>
        </div>

        <div className="fixed bottom-0 w-full">
          <ContentFooter>
            <div className="flex flex-wrap justify-between w-full">
              <div className="flex">
                <Button
                  type="submit"
                  className="lg:px-20"
                  loading={
                    createFormLoading ||
                    updateFormLoading ||
                    updateFenceCounselorLoading ||
                    createFencingForPatientLoading
                  }
                  disabled={
                    createFormLoading ||
                    updateFormLoading ||
                    updateFenceCounselorLoading ||
                    createFencingForPatientLoading
                  }>
                  Save
                </Button>
                <Button
                  type="button"
                  buttonStyle="bg-none"
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

