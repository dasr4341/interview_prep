import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { messagesData } from 'lib/messages';
import { useNavigate } from 'react-router-dom';
import useQueryParams from 'lib/use-queryparams';
import { routes } from 'routes';
import PatientDetailsFormSkeletonLoading from './SkeletonLoading/PatientDetailsFormSkeletonLoading';
import { SelectBox } from 'interface/SelectBox.interface';
import DatePicker from 'react-datepicker';
import { config } from 'config';
import { format } from 'date-fns';
import { useLazyQuery } from '@apollo/client';
import {
  EHRGetPatientGenderIdentityTypes,
  GetPatientDetails,
  GetPatientDetailsVariables,
  GetPatientDetails_pretaaHealthPatientDetails,
  UserInvitationOptions,
} from 'health-generatedTypes';
import { eHRGetPatientGenderIdentityTypes } from 'graphql/eHRGetPatientGenderIdentityTypes.query';
import { PatientDetailContext } from './AddPatientContext';

import { DropdownIndicator } from 'components/ui/SelectBox';
import Select from 'react-select';
import './_patient-form.scoped.scss';
import { getPatientDetails } from 'graphql/getPatientDetails.query';
import usePatientFieldMetaData from './usePatientFieldMetaData';
import { isValidPhoneNumber } from 'libphonenumber-js';
import SelectedFacilityList from 'components/SelectFacilityList/SelectedFacilityList';
import catchError from 'lib/catch-error';
import {
  FormDataInterface,
  PatientFormFields,
  customStyleSelectBoxEhr,
  genderOption,
} from './helper/PatientFormHelper';
import { getAppData } from 'lib/set-app-data';

export default function PatientDetailsForm() {
  const navigate = useNavigate();
  const query: { patientId: string } = useQueryParams();
  const { updatePatientDetail, patientDetail } = useContext(PatientDetailContext);
  const [patientDetailsState, setPatientDetailsState] = useState<GetPatientDetails_pretaaHealthPatientDetails>();
  const [genderIdentity, setGenderIdentity] = useState<SelectBox[]>([]);
  const appData = getAppData();
  const [isTimeValid, setIsTimeValid] = useState<boolean>(true);

  const { patientMetaData } = usePatientFieldMetaData();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PatientFormFields>({
    mode: 'onChange',
  });

  function setFormValue(formData: FormDataInterface) {
    setValue('firstName', formData.firstName || '');
    setValue('lastName', formData?.lastName || '');
    setValue('email', formData?.email || '');
    setValue('phone', formData?.phone || '');
    setValue('gender', formData?.gender?.replace(/^./, formData.gender[0]?.toUpperCase()) || '');
    setValue('genderIdentity', formData?.genderIdentity || '');
    setValue('intakeDate', formData?.intakeDate || '');
    setValue('dischargeDate', formData?.dischargeDate || '');
    setValue('dob', formData?.dob || '');
    setValue('facilityId', formData.selectFacility || '');

    trigger('firstName');
    trigger('lastName');
    trigger('email');
    trigger('phone');
    trigger('gender');
    trigger('genderIdentity');
    trigger('intakeDate');
    trigger('dischargeDate');
    trigger('dob');
    trigger('facilityId');
  }

  function onSubmit(patientDetails: PatientFormFields) {
    console.log(patientDetails);
    navigate(routes.admin.addPatient.patientContactDetails.build({ patientId: query.patientId }));
    updatePatientDetail((prevData) => ({
      ...prevData,
      ...patientDetails,
      intakeDate: patientDetails.intakeDate && format(new Date(patientDetails.intakeDate), config.dateFormat),
      dischargeDate: patientDetails.dischargeDate
        ? format(new Date(patientDetails.dischargeDate), config.dateFormat)
        : '',
      dob: patientDetails.dob ? format(new Date(patientDetails.dob), config.dateFormat) : '',
      gender: getValues('gender') ? getValues('gender') : '',
      genderIdentity: getValues('genderIdentity') ? getValues('genderIdentity') : '',
      facilityId: getValues('facilityId') ? getValues('facilityId') : '',
    }));
  }

  // ------------ API -----------------------
  const [getGenderIdentityCallback, { loading: genderIdentityLoading }] =
    useLazyQuery<EHRGetPatientGenderIdentityTypes>(eHRGetPatientGenderIdentityTypes, {
      onCompleted: (d) =>
        d.pretaaHealthEHRGetPatientGenderIdentityTypes &&
        setGenderIdentity(
          () =>
            d.pretaaHealthEHRGetPatientGenderIdentityTypes?.map((e) => ({
              label: String(e?.name).replace(/^./, e?.value[0]?.toUpperCase()),
              value: String(e?.value),
            })),
        ),
      onError: (e) => catchError(e, true),
    });
  // ------------ API ENDs --------------------

  useEffect(() => {
    getGenderIdentityCallback();
  }, []);

  const [getPatientsDetailsData, { loading: patientsDetailsLoading }] = useLazyQuery<
    GetPatientDetails,
    GetPatientDetailsVariables
  >(getPatientDetails, {
    onCompleted: (data) => {
      if (data) {
        setPatientDetailsState(data.pretaaHealthPatientDetails);
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    if (query.patientId) {
      getPatientsDetailsData({
        variables: {
          patientId: query.patientId,
        },
      });
    }
  }, [query.patientId]);

  useEffect(() => {
    if (patientDetail.firstName) {
      setFormValue({...patientDetail,selectFacility:patientDetail.facilityId});
    } else if (!patientDetail.firstName && patientDetailsState?.id && patientDetailsState.patientDetails) {
      const savedFormData = {
        firstName: patientDetailsState?.firstName,
        lastName: patientDetailsState?.lastName,
        email: patientDetailsState?.email,
        phone: patientDetailsState?.patientDetails.phone,
        gender: patientDetailsState?.patientDetails?.gender || '',
        genderIdentity: patientDetailsState?.patientDetails?.genderIdentity || '',
        dischargeDate: patientDetailsState?.patientDetails?.dischargeDate,
        intakeDate: patientDetailsState?.patientDetails?.intakeDate,
        dob: patientDetailsState?.patientDetails?.dob,
      };
      setFormValue({...savedFormData,selectFacility:patientDetail.facilityId});
    }
  }, [patientDetailsState?.id]);

  return (
    <div className="relative pb-10 parent-frame">
      <ContentFrame className=" mb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-600 flex flex-col space-y-6">
          {patientsDetailsLoading && <PatientDetailsFormSkeletonLoading />}

          {!patientsDetailsLoading && (
            <React.Fragment>
              <div className={`flex flex-col ${Number(appData.selectedFacilityId?.length) > 1 ? '' : 'hidden'}`}>
                {/* 
                  Show facility dropdown selection only when adding a patient 
                  And multiple facility is selected in sidebar 
                */}
                {!query.patientId && (
                  <>
                    <SelectedFacilityList
                      {...register('facilityId', {
                        required: {
                          value: Number(appData.selectedFacilityId?.length) > 1,
                          message: messagesData.errorList.required,
                        },
                      })}
                      labelStyle="text-xsm text-gray-750 mb-2 font-semibold"
                      dropdownStyle="rounded-md"
                      onChange={(e) => {
                        setValue('facilityId', e);
                        trigger('facilityId');
                      }}
                      defaultValue={patientDetail.facilityId}
                    />
                    {errors.facilityId?.message && <ErrorMessage message={String(errors.facilityId?.message)} />}
                  </>
                )}
              </div>
              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">First Name</label>
                <input
                  disabled={patientMetaData?.firstName === false ? true : false}
                  className={`${
                    patientMetaData?.firstName === false &&
                    'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                  } 
                  rounded border-gray-350 py-3`}
                  type="text"
                  {...register('firstName', {
                    required: {
                      value: patientMetaData?.firstName === false ? false : true,
                      message: messagesData.errorList.required,
                    },
                    validate: (v) => !!v.trim().length || messagesData.errorList.spaceNotAllowed,
                  })}
                  placeholder="Enter patient first name"
                />
                {errors.firstName?.message && <ErrorMessage message={String(errors.firstName?.message)} />}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', {
                    required: {
                      value: patientMetaData?.lastName === false ? false : true,
                      message: messagesData.errorList.required,
                    },
                    validate: (v) => !!v.trim().length || messagesData.errorList.spaceNotAllowed,
                  })}
                  placeholder="Enter patient last name"
                  disabled={patientMetaData?.lastName === false ? true : false}
                  className={`${
                    patientMetaData?.lastName === false &&
                    'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                  } 
                  rounded border-gray-350 py-3`}
                />
                {errors.lastName?.message && <ErrorMessage message={errors.lastName?.message} />}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Email</label>
                <input
                  disabled={
                    String(patientDetailsState?.userInvitationStatus) === UserInvitationOptions.REGISTERED ||
                    patientMetaData?.email === false
                  }
                  type="email"
                  {...register('email', {
                    required: {
                      value: patientMetaData?.email === false ? false : true,
                      message: messagesData.errorList.required,
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: messagesData.errorList.email,
                    },
                  })}
                  placeholder="Enter patient email"
                  className={
                    String(patientDetailsState?.userInvitationStatus) === UserInvitationOptions.REGISTERED ||
                    patientMetaData?.email === false
                      ? 'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                      : 'rounded border-gray-350 py-3'
                  }
                />

                {errors.email?.message && <ErrorMessage message={errors.email.message} />}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Phone Number</label>
                <input
                  type="text"
                  {...register('phone', {
                    validate: (v: string) =>
                      isValidPhoneNumber(v, {
                        defaultCountry: 'US',
                        defaultCallingCode: '+1',
                      }) || v.trim() === '',
                  })}
                  placeholder="Enter patient phone number"
                  disabled={patientMetaData?.phone === false ? true : false}
                  className={`${
                    patientMetaData?.phone === false &&
                    'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                  } 
                  rounded border-gray-350 py-3`}
                />
                {errors.phone?.type === 'validate' && (
                  <ErrorMessage message={messagesData.errorList.validPhoneNumber} />
                )}
              </div>

              <div className="flex flex-col">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Gender</label>
                <Select
                  {...register('gender')}
                  placeholder="Select gender"
                  closeMenuOnSelect={true}
                  styles={customStyleSelectBoxEhr}
                  isDisabled={patientMetaData?.gender === false ? true : false}
                  hideSelectedOptions={false}
                  className="app-react-select w-full rounded "
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator,
                  }}
                  value={
                    getValues('gender') && {
                      label: getValues('gender'),
                      value: getValues('gender'),
                    }
                  }
                  options={genderOption}
                  onChange={(data) => {
                    const value = (data as SelectBox)?.value;
                    setValue('gender', value);
                    trigger('gender');
                  }}
                />
                {errors.gender?.message && <ErrorMessage message={errors.gender?.message} />}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Gender Identity</label>
                <Select
                  isLoading={genderIdentityLoading}
                  isDisabled={patientMetaData?.genderIdentity === false ? true : false}
                  {...register('genderIdentity')}
                  placeholder="Select gender identity"
                  closeMenuOnSelect={true}
                  styles={customStyleSelectBoxEhr}
                  hideSelectedOptions={false}
                  className="app-react-select w-full rounded "
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator,
                  }}
                  value={
                    getValues('genderIdentity') && {
                      label: getValues('genderIdentity'),
                      value: getValues('genderIdentity'),
                    }
                  }
                  options={genderIdentity}
                  onChange={(data) => {
                    const value = (data as SelectBox)?.value;
                    setValue('genderIdentity', value);
                    trigger('genderIdentity');
                  }}
                />

                {errors.genderIdentity?.message && <ErrorMessage message={errors.genderIdentity?.message} />}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Date Of Birth</label>
                <DatePicker
                  {...register('dob', {
                    required: patientMetaData?.dob === false ? false : true,
                  })}
                  disabled={patientMetaData?.dob === false ? true : false}
                  showYearDropdown
                  dropdownMode="select"
                  showMonthDropdown
                  popperPlacement="auto"
                  placeholderText={config.dateFormat}
                  wrapperClassName="date-picker"
                  maxDate={new Date()}
                  onChange={(date: Date) => {
                    const value = format(new Date(date), config.dateFormat);
                    setValue('dob', value);
                    trigger('dob');
                  }}
                  value={getValues('dob')}
                  dateFormat={config.dateFormat}
                  className={`${
                    patientMetaData?.dob === false
                      ? 'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                      : 'cursor-pointer border-gray-350'
                  } 
                      w-full rounded  py-3`}
                />

                {errors.dob?.type === 'required' && <ErrorMessage message={String(messagesData.errorList.required)} />}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Intake Date</label>
                <DatePicker
                  {...register('intakeDate', {
                    required: patientMetaData?.dob === false ? false : true,
                    validate: () => {
                      if (
                        new Date(getValues('dischargeDate')).getTime() < new Date(getValues('intakeDate')).getTime()
                      ) {
                        setIsTimeValid(false);
                        return 'Intake date cannot be after discharge date';
                      }
                    },
                  })}
                  popperPlacement="auto"
                  placeholderText={config.dateFormat}
                  wrapperClassName="date-picker"
                  onChange={(date: Date) => {
                    const value = format(new Date(date), config.dateFormat);
                    setValue('intakeDate', value);
                    trigger('intakeDate');
                  }}
                  value={getValues('intakeDate')}
                  dateFormat={config.dateFormat}
                  disabled={patientMetaData?.intakeDate === false ? true : false}
                  className={`${
                    patientMetaData?.intakeDate === false
                      ? 'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                      : 'cursor-pointer border-gray-350'
                  } 
                      w-full rounded  py-3`}
                />

                {errors.intakeDate?.type === 'required' && (
                  <ErrorMessage message={String(messagesData.errorList.required)} />
                )}
                {!isTimeValid && getValues('dischargeDate') && errors.intakeDate?.type === 'validate' && (
                  <ErrorMessage message={String(errors.intakeDate?.message)} />
                )}
              </div>

              <div className="flex flex-col ">
                <label className=" text-xsm font-normal text-gray-750 mb-2">Discharge Date</label>
                <DatePicker
                  popperPlacement="auto"
                  showYearDropdown
                  dropdownMode="select"
                  showMonthDropdown
                  placeholderText={config.dateFormat}
                  wrapperClassName="date-picker"
                  onChange={(date: Date) => {
                    const value = format(new Date(date), config.dateFormat);
                    setValue('dischargeDate', value);
                    trigger('dischargeDate');
                    if (new Date(value).getTime() >= new Date(getValues('intakeDate')).getTime()) {
                      setIsTimeValid(true);
                    }
                  }}
                  value={getValues('dischargeDate')}
                  dateFormat={config.dateFormat}
                  disabled={patientMetaData?.dischargeDate === false ? true : false}
                  className={`${
                    patientMetaData?.dischargeDate === false
                      ? 'cursor-not-allowed bg-gray-450 placeholder-gray-500 opacity-50 select-auto'
                      : 'cursor-pointer border-gray-350'
                  } 
                      w-full rounded  py-3`}
                />
              </div>
            </React.Fragment>
          )}
        </form>
      </ContentFrame>
      <ContentFooter className=" fixed bottom-0 w-full">
        <div className="flex space-x-4">
          <Button
            type="button"
            disabled={patientsDetailsLoading}
            onClick={() => handleSubmit(onSubmit)()}>
            Next
          </Button>
        </div>
      </ContentFooter>
    </div>
  );
}
