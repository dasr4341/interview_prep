/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';

import { Radio, Skeleton } from '@mantine/core';
import { ContentHeader } from 'components/ContentHeader';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { addDays, format, subDays } from 'date-fns';
import messagesData from 'lib/messages';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

import { useLazyQuery, useQuery } from '@apollo/client';
import { DropdownIndicator } from 'components/ui/SelectBox';
import { config } from 'config';
import { dynamicGroupsName } from 'graphql/dynamic-group-name.query';
import { getTemplateForCampaign } from 'graphql/getTemplateForCampagin.query';
import {
  CampaignSurveyAssignmentTypes,
  CampaignSurveyFrequency,
  CampaignSurveyGroupType,
  CampaignSurveyReminderCompletion,
  CampaignSurveyTriggerTypes,
  GetDynamicGroups,
  GetTemplateForCampaign,
  GetTemplateForCampaignVariables,
  SurveyCountPerParticipantType,
  UserPermissionNames,
} from 'health-generatedTypes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { useDispatch } from 'react-redux';
import ScheduleCampaignSkeleton from './ScheduleCampaignSkeleton';
import { CampaignEventType, FormSubmitData, RecipientType } from './SchedulingCampaignInterface';
import SelectPatientModal from '../SelectPatientModal/SelectPatientModal';
import './_schedule_template.scoped.scss';
import useHandleFormSubmit from './useHandleFormSubmit';
import useCampaignFormPatch from './useCampaignFormPatch';
import { useParams } from 'react-router-dom';
import {
  CheckboxOption,
  DynamicGroupsName,
  customStylesSelectBox,
  defaultCampaignValues,
  formatLabel,
  pluralize,
} from './ScheduleCampaginLibs';
import { cloneDeep } from 'lodash';
import SelectedFacilityList from 'components/SelectFacilityList/SelectedFacilityList';
import { campaignIsPublished } from '../CampaignStatusHelpers';
import { getAppData } from 'lib/set-app-data';
import { filterPassedTime, validateFutureDate } from 'screens/surveys/lib/filter-time';

interface DefaultSelectedValue {
  label: string;
  value: string;
}

export default function SchedulingCampaign() {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FormSubmitData>({
    defaultValues: defaultCampaignValues,
  });

  const isUserHaveEditPermission = useGetPrivilege(UserPermissionNames.CAMPAIGN_SCHEDULER, CapabilitiesType.EDIT);

  const [groupNames, setGroupNames] = useState<DynamicGroupsName[]>();
  const [selectedGroupNames, setSelectedGroupNames] = useState<DynamicGroupsName[]>();
  const params: {
    templateId?: string;
    campaignId?: string;
    duplicateId?: string;
  } = useParams();
  const dispatch = useDispatch();
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [pageTitle, setPageTitle] = useState<string>('');
  const [multipleParticipantState, setMultipleParticipantState] = useState(false);
  const [patientListModal, setPatientListModal] = useState(false);
  const [patientListData, setPatientListData] = useState<RecipientType[]>([]);
  const [eventBasedState, setEventBasedState] = useState(false);
  const [groupState, setGroupState] = useState(false);
  const [viewUserButton, setViewUserButton] = useState(false);
  const [isRequired, setIsRequired] = useState<boolean>();
  const [buttonName, setButtonName] = useState('');
  const [showSaveAsDraftButton, setShowSaveAsDraftButton] = useState<boolean>();
  const [isSelectedFcaility, setIsSelectedFacility] = useState('');
  const [isGroupOrRecipientRequired, setIsGroupOrRecipientRequired] = useState(false);
  const [hasInOutPatientChecked, setInOutPatientStatus] = useState<boolean>(false);
  const selectedPatientRow =
    useAppSelector((state) => state.app.sentToPatient.selectedPatientRow) || [];
  const selectedRow =
    useAppSelector((state) => state.app.sentToPatient.selectedRows) || [];
    const appData = getAppData();

  // reset recipient state when user select groups
  function handleSelectGroups() {
    dispatch(appSliceActions.setSelectedPatientList([]));
    dispatch(appSliceActions.setSelectedPatientRows([]));
    setPatientListData([]);
    setValue('campaignGroupRecipients', CampaignSurveyAssignmentTypes.GROUP);
  }

  const handlePatientSubmit = () => {
    setPatientListModal(false);
  };

  watch('delayChecked');
  watch('campaignSurveyStartDate');
  watch('campaignSurveyEndDate');
  watch('campaignSurveyFrequencyType');
  watch('campaignParticipantType');


  // Side effects
  useEffect(() => {
    if (getValues('campaignParticipantType') === SurveyCountPerParticipantType.SINGLE) {
      setValue('campaignSurveyFrequencyType', null);
      trigger('campaignSurveyFrequencyType');
      setValue('campaignSurveyFrequencyCustomData', '');
    }

    if (getValues('campaignTriggerType') === CampaignSurveyTriggerTypes.EVENT_BASED) {
      setValue('campaignSurveyFrequencyType', {
        label: formatLabel(CampaignSurveyFrequency.CUSTOM),
        value: CampaignSurveyFrequency.CUSTOM,
      });
      trigger('campaignSurveyFrequencyType');
      setValue('campaignSurveyFrequencyCustomData', '');
    }
  }, [getValues('campaignParticipantType')]);

  useEffect(() => {
    if (!getValues('delayChecked')) {
      setValue('delayOfDays', undefined);
      trigger('delayOfDays');
    }
  }, [getValues('delayChecked')]);

  // Get template details
  const [getTemplateData, { data: templateData, loading: loadingTemplateData }] = useLazyQuery<
    GetTemplateForCampaign,
    GetTemplateForCampaignVariables
  >(getTemplateForCampaign);

  // get group names
  useQuery<GetDynamicGroups>(dynamicGroupsName, {
    onCompleted: (d) => {
      const output = Object.entries(d.pretaaHealthAllGroups).map((p) => ({
        value: p[0],
        label: formatLabel(p[1] as string),
      }));
      setGroupNames(output);
    },
  });

  function updatedGroupNames(): Array<DynamicGroupsName> {
    const selectedList = selectedGroupNames?.map((sGroup) => sGroup.value);
    const newGroupList = cloneDeep(groupNames) || [];

    return newGroupList.map((group) => {
      let disabledType: any = null;

      switch (group.value) {
        case CampaignSurveyGroupType.IN_PATIENT:
          disabledType = CampaignSurveyGroupType.OUT_PATIENT;
          break;
        case CampaignSurveyGroupType.OUT_PATIENT:
          disabledType = CampaignSurveyGroupType.IN_PATIENT;
          break;
        case CampaignSurveyGroupType.FEMALE:
          disabledType = CampaignSurveyGroupType.MALE;
          break;
        case CampaignSurveyGroupType.MALE:
          disabledType = CampaignSurveyGroupType.FEMALE;
          break;
        default:
          disabledType = null;
          break;
      }

      if (selectedList?.includes(group.value) && disabledType) {
        const index = newGroupList.findIndex((e) => e.value === disabledType);
        if (index >= 0) {
          newGroupList[index].isDisabled = true;
        }
      }

      return group;
    });
  }

  // Get campaign and form dispatch
  const { campaignDataLoading, campaign, isEditable } = useCampaignFormPatch({
    setValue,
    trigger,
    setPatientListData,
    setSelectedStartDate,
    setMultipleParticipantState,
    setSelectedEndDate,
    setEventBasedState,
  });

  // Manage form submissions
  // This functions can call back on create campaign and edit campaign and duplicate campaign
  const { handleFormSubmit, creating, updating, buttonClicked } = useHandleFormSubmit({
    setError,
    selectedPatientRow,
    campaign,
    clearErrors,
  });

  useEffect(() => {
    if (campaign?.surveyTemplateId) {
      getTemplateData({
        variables: {
          templateId: campaign?.surveyTemplateId,
        },
      });
    } else if (params.templateId || params.duplicateId) {
      getTemplateData({
        variables: {
          templateId: String(params.templateId || params.duplicateId),
        },
      });
    }
  }, [campaign?.surveyTemplateId, params.templateId, params.duplicateId]);

  // close recipient modal
  function handleOnClose() {
    if (selectedPatientRow.length) {
      setPatientListModal(false);
    } else if (params.campaignId) {
      setPatientListModal(false);
      setValue('campaignGroupRecipients', CampaignSurveyAssignmentTypes.GROUP);
    } else {
      setPatientListModal(false);
      dispatch(appSliceActions.setSelectedPatientRows([]));
      clearErrors('campaignGroupRecipients');
      setValue('campaignGroupRecipients', CampaignSurveyAssignmentTypes.GROUP);
    }
  }

  // set required field if value is not available
  useEffect(() => {
    if (!selectedGroupNames?.length && !selectedPatientRow.length && !patientListData.length) {
      setIsGroupOrRecipientRequired(true);
    } else {
      setIsGroupOrRecipientRequired(false);
    }
  }, [selectedGroupNames?.length, selectedPatientRow.length, patientListData.length]);

  function isExistingCampaign() {
    return params?.campaignId;
  }

  function isDuplicateCampaign() {
    return params?.duplicateId;
  }

  function isNewCampaign() {
    return !isExistingCampaign() || !isDuplicateCampaign();
  }

  function handleSaveAndSchedule(formData: FormSubmitData) {
    const saveAndScheduleFormData = {
      ...formData,
      saveAsDraft: false,
    };
    handleFormSubmit(saveAndScheduleFormData);
  }

  // set button name, show save as draft button, and page title
  useEffect(() => {
    if (campaign && campaignIsPublished(campaign.published) && !isDuplicateCampaign()) {
      setButtonName('Save');
      setShowSaveAsDraftButton(false);
    } else {
      setButtonName('Schedule');
      setShowSaveAsDraftButton(true);
    }
    if (templateData?.pretaaHealthGetTemplate?.name) {
      if (isExistingCampaign()) {
        setPageTitle(`Edit Campaign - ${campaign?.title}`);
      } else  if (isDuplicateCampaign()) {
        setPageTitle(`Duplicate campaign - ${campaign?.title}`);
      } else if (isNewCampaign()) {
        setPageTitle(`Schedule new - ${templateData?.pretaaHealthGetTemplate?.name}`);
      }
    }
  }, [params?.campaignId, params?.templateId, params?.duplicateId, templateData?.pretaaHealthGetTemplate]);

  //update patient state when duplicate id detected
  useEffect(() => {
    if (params.duplicateId && selectedRow.length === 0 && !groupState) {
      dispatch(appSliceActions.setSelectedPatientList(patientListData as any));
    } else if (params.campaignId && isEditable && selectedRow.length === 0 && !groupState) {
      dispatch(appSliceActions.setSelectedPatientList(patientListData as any));
    } else if (selectedRow.length > 0 && !groupState) {
      dispatch(appSliceActions.setSelectedPatientList(selectedPatientRow as any));
    } else if (params.campaignId && !isEditable) {
      dispatch(appSliceActions.setSelectedPatientList(patientListData as any));
    }
  }, [selectedPatientRow, patientListData]);

  // showing view user button
  useEffect(() => {
    if (selectedPatientRow.length > 0) {
      setViewUserButton(true);
    } else if (!isEditable && patientListData && patientListData.length > 0) {
      setViewUserButton(true);
    } else {
      setViewUserButton(false);
    }
  }, [selectedPatientRow, patientListData, params.duplicateId]);

  useEffect(() => {
    if (getValues('selectFacility')) {
      setIsSelectedFacility('');
    }
  }, [getValues('selectFacility')]);

  
  useEffect(() => {
    const getSelectedValue = getValues('campaignSurveyGroup') as unknown as DefaultSelectedValue[];
    const defaultSelectedValue = getSelectedValue?.map(el => el.value);
    const hasDefaultInOrOutPatient = (defaultSelectedValue?.includes(CampaignSurveyGroupType.IN_PATIENT) || defaultSelectedValue?.includes(CampaignSurveyGroupType.OUT_PATIENT));
    if (isEditable && hasDefaultInOrOutPatient) {
      setInOutPatientStatus(true);
    } else if (isEditable && !hasDefaultInOrOutPatient) {
      setInOutPatientStatus(false);
      setValue('delayChecked', false);
    }
  }, [getValues('campaignSurveyGroup')]);
  

  return (
    <div>
      <ContentHeader className="lg:sticky z-50">
        <>
          <div className="block sm:flex sm:justify-between items-start heading-area">
            <div className="header-left">
              {isUserHaveEditPermission ? (
                <h1 className="h1 leading-none text-primary font-semibold text-md lg:text-lg mt-3">
                  {!pageTitle && (
                    <Skeleton
                      width={window.innerWidth < 640 ? '90%' : 400}
                      height={24}
                      mt={4}
                      className="ml-2"
                    />
                  )}
                  {pageTitle}
                </h1>
              ) : (
                <h1 className="h1 leading-none text-primary font-semibold text-md lg:text-lg mt-3">Campaign Preview</h1>
              )}
            </div>
          </div>
        </>
      </ContentHeader>

      {campaignDataLoading && <ScheduleCampaignSkeleton />}

      <form>
        {!campaignDataLoading && (
          <ContentFrame>
            <div className="mt-6">
              {!params.campaignId && (
                <div className="max-width-350 mb-8">
                  <Controller
                    name="selectFacility"
                    control={control}
                    rules={{
                      required: isRequired,
                    }}
                    render={({ field: { onChange } }) => (
                      <SelectedFacilityList
                        onInt={setIsRequired}
                        labelStyle="mb-3 font-bold"
                        onChange={(e) => {
                          setValue('campaignGroupRecipients', CampaignSurveyAssignmentTypes.GROUP);
                          setGroupState(true);
                          dispatch(appSliceActions.setSelectedPatientList([]));
                          dispatch(appSliceActions.setSelectedPatientRows([]));
                          onChange(e);
                          setValue('selectFacility', e);
                          trigger('selectFacility');
                        }}
                      />
                    )}
                  />
                  {errors.selectFacility && <ErrorMessage message={messagesData.errorList.required} />}
                </div>
              )}

              <div className="flex flex-col sm:flex-row md:gap-8">
                <div className="flex">
                  <p className="font-bold text-base mb-2 sm:mb-0 md:w-full sm:pr-5 ">Assessments per Participant</p>
                </div>
                <div>
                  <Controller
                    control={control}
                    name="campaignParticipantType"
                    render={({ field }) => (
                      <Radio.Group
                        onChange={(val) => field.onChange(val)}
                        defaultValue={getValues('campaignParticipantType')}
                        value={getValues('campaignParticipantType')}
                        className="flex flex-row radio-group">
                        <Radio
                          size="sm"
                          className="text-gray-750 text-xsm font-normal"
                          key={SurveyCountPerParticipantType.SINGLE}
                          value={SurveyCountPerParticipantType.SINGLE}
                          disabled={!isEditable}
                          label="Single"
                          onClick={() => {
                            setEventBasedState(false);
                            setMultipleParticipantState(false);
                            setValue('campaignSurveyFrequencyCustomData', '');
                            setValue('campaignSurveyFrequencyType', null);
                            trigger('campaignSurveyFrequencyType');
                          }}
                        />
                        <Radio
                          size="sm"
                          key={SurveyCountPerParticipantType.MULTIPLE}
                          value={SurveyCountPerParticipantType.MULTIPLE}
                          disabled={!isEditable}
                          className="md:pl-10 text-gray-750 text-xsm font-normal"
                          label="Multiple"
                          onClick={() => {
                            setMultipleParticipantState(true);
                            setValue('campaignTriggerType', CampaignSurveyTriggerTypes.TIME_BASED);
                          }}
                        />
                      </Radio.Group>
                    )}
                  />
                </div>
              </div>

              {multipleParticipantState && (
                <div className="flex flex-col sm:flex-row mt-6 md:gap-8">
                  <div className="flex">
                    <p className="font-bold text-base mb-2 sm:mb-0 md:w-full sm:pr-5">Trigger Type</p>
                  </div>
                  <div className="mt-1">
                    <Controller
                      control={control}
                      name="campaignTriggerType"
                      render={({ field }) => (
                        <Radio.Group
                          onChange={(val) => field.onChange(val)}
                          className="flex flex-row radio-group"
                          defaultValue={getValues('campaignTriggerType')}
                          value={getValues('campaignTriggerType')}>
                          <Radio
                            size="sm"
                            className="text-gray-750 text-xsm radioButton mr-4"
                            key={CampaignSurveyTriggerTypes.TIME_BASED}
                            value={CampaignSurveyTriggerTypes.TIME_BASED}
                            disabled={!isEditable}
                            onClick={() => setEventBasedState(false)}
                            label="Time Based"
                          />
                          <Radio
                            size="sm"
                            key={CampaignSurveyTriggerTypes.EVENT_BASED}
                            value={CampaignSurveyTriggerTypes.EVENT_BASED}
                            className=" text-gray-750 text-xsm mr-4"
                            disabled={!isEditable}
                            onClick={() => setEventBasedState(true)}
                            label="Event Based"
                          />
                        </Radio.Group>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="mt-7">
                <p className="mb-3 font-medium">Name</p>
                <input
                  disabled={!isEditable ? true : false}
                  placeholder="Campaign Name"
                  className={`min-width-500 px-4 py-3 border border-solid placeholder-gray-500 rounded-md 
                    ${errors.name ? 'border-red-800' : 'border-gray-ccc'} 
                    ${isEditable ? ' bg-white' : 'bg-on-disable opacity-50'}`}
                  {...register('name', {
                    maxLength: {
                      value: config.form.inputFieldMaxLength,
                      message: messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength),
                    },
                    required: {
                      value: true,
                      message: messagesData.errorList.required,
                    },
                    validate: (v) => !!v.trim().length || messagesData.errorList.required,
                  })}
                />
                {errors.name?.message && <ErrorMessage message={errors.name?.message.toString()} />}
              </div>

              <div className="mt-6">
                <div className="sm:flex sm:gap-5">
                  <div>
                    <p className="mb-3 font-medium">Start date </p>
                    <div
                      className={`w-full md:w-64 border border-gray-400 choose-date rounded-md z-10 ${
                        isEditable ? ' bg-white' : 'bg-on-disable opacity-50'
                      }`}>
                      <DatePicker
                        {...register('campaignSurveyStartDate', {
                          required: true,
                          validate: isEditable ? validateFutureDate : () => true
                        })}
                        autoComplete="off"
                        disabled={!isEditable ? true : false}
                        placeholderText="MM/DD/YYYY"
                        className="p-3 cursor-pointer "
                        timeFormat="p"
                        timeIntervals={15}
                        dateFormat="MM/dd/yyyy"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        onChange={(date) => {
                          if (date) {
                            setSelectedStartDate(date);
                            setValue('campaignSurveyStartDate', format(date, 'MM/dd/yyyy'));
                            trigger('campaignSurveyStartDate');
                          }
                        }}
                        selected={selectedStartDate}
                        minDate={subDays(new Date(), 0)}
                        maxDate={selectedEndDate ? subDays(selectedEndDate, 1) : null}
                      />
                    </div>
                    {errors.campaignSurveyStartDate && errors.campaignSurveyStartDate.type !== 'validate' && (
                      <ErrorMessage message={messagesData.errorList.required} />
                    )}
                   
                  </div>
                  <div>
                    <p className="mb-3 font-medium">Time of delivery</p>
                    <div
                      className={`w-full md:w-36 border border-gray-400 choose-date select-reminder-time-icon-blue rounded-md z-10 ${
                        isEditable ? ' bg-white' : 'bg-on-disable opacity-50'
                      }`}>
                      <DatePicker
                        {...register('campaignSurveyStartDate', {
                          required: true,
                        })}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="HH:MM"
                        className="p-3 cursor-pointer"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="hh:mm aa"
                        disabled={!isEditable ? true : false}
                        filterTime={filterPassedTime}

                        onChange={(date) => {
                          if (date) {
                            setSelectedStartDate(date);
                            setValue('campaignSurveyStartDate', format(date, 'MM/dd/yyyy HH:mm'));
                            trigger('campaignSurveyStartDate');
                          }
                        }}
                        selected={selectedStartDate}
                        minDate={subDays(new Date(), 0)}
                        maxDate={selectedEndDate ? subDays(selectedEndDate, 1) : null}
                      />
                    </div>
                    {errors.campaignSurveyStartDate && errors.campaignSurveyStartDate.type === 'validate' && isEditable && (
                      <ErrorMessage message={errors.campaignSurveyStartDate.message || ''  } />
                    )}
                  </div>

                  <div className="md:ml-6">
                    <p className="mb-3 mt-3 sm:mt-0 font-medium">End date</p>
                    <div className="w-full md:w-64 border border-gray-400 choose-date rounded-md bg-white">
                      <DatePicker
                        {...register('campaignSurveyEndDate', {
                          required: true,
                        })}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        placeholderText="MM/DD/YYYY"
                        className="p-3 cursor-pointer"
                        onChange={(date) => {
                          if (date) {
                            setSelectedEndDate(date);
                            setValue('campaignSurveyEndDate', format(date, config.dateFormat));
                            trigger('campaignSurveyEndDate');
                          }
                        }}
                        selected={selectedEndDate}
                        minDate={selectedStartDate ? addDays(selectedStartDate, 1) : addDays(new Date(), 1)}
                      />
                    </div>
                    {errors.campaignSurveyEndDate && <ErrorMessage message={messagesData.errorList.required} />}
                  </div>
                </div>
              </div>

              <div
                className={`mt-6 ${
                  (getValues('campaignTriggerType') === CampaignSurveyTriggerTypes.TIME_BASED &&
                    getValues('campaignParticipantType') === SurveyCountPerParticipantType.MULTIPLE) ||
                  campaign?.triggerType === CampaignSurveyTriggerTypes.TIME_BASED
                    ? ''
                    : 'hidden'
                }`}>
                <p className="mb-3 font-medium">Set frequency</p>
                <div className="flex flex-col md:flex-row">
                  <div className="max-width-350 md:w-full">
                    <Controller
                      name="campaignSurveyFrequencyType"
                      control={control}
                      rules={{
                        required:
                          getValues('campaignTriggerType') === CampaignSurveyTriggerTypes.TIME_BASED &&
                          getValues('campaignParticipantType') === SurveyCountPerParticipantType.MULTIPLE &&
                          isEditable
                            ? true
                            : false,
                      }}
                      render={({ field: { onChange, name } }) => (
                        <Select
                          isDisabled={!isEditable}
                          className="input-container bg-white rounded-xl app-react-select"
                          styles={customStylesSelectBox}
                          onChange={(val) => {
                            onChange(val);
                          }}
                          options={Object.entries(CampaignSurveyFrequency).map((d) => ({
                            value: d[0],
                            label: formatLabel(d[0]),
                          }))}
                          components={{
                            IndicatorSeparator: () => null,
                            DropdownIndicator,
                          }}
                          value={getValues(name)}
                        />
                      )}
                    />
                  </div>
                  {getValues('campaignSurveyFrequencyType') &&
                    getValues('campaignSurveyFrequencyType')?.value === CampaignSurveyFrequency.CUSTOM && (
                      <div>
                        <div className="flex md:ml-2 mt-2 md:mt-0">
                          <input
                            {...register('campaignSurveyFrequencyCustomData', {
                              required:
                                getValues('campaignSurveyFrequencyType')?.value === CampaignSurveyFrequency.CUSTOM &&
                                getValues('campaignTriggerType') === CampaignSurveyTriggerTypes.TIME_BASED
                                  ? true
                                  : false,
                              validate: (value) => {
                                if (getValues('campaignSurveyFrequencyCustomData') && Number(value) <= 0) {
                                  return messagesData.errorList.positiveValue;
                                } else if (getValues('campaignSurveyFrequencyCustomData') && !Number(value)) {
                                  return messagesData.errorList.specialCharactersNotAllowed;
                                }
                              },
                            })}
                            type="number"
                            disabled={!isEditable}
                            className={`px-4 py-3 border border-solid placeholder-gray-500  rounded-md w-24  border-gray-ccc 
                          ${!isEditable ? 'bg-on-disable opacity-50' : 'bg-white'}`}
                          />
                          <p className="pl-3 pt-3">Days</p>
                        </div>

                        {errors.campaignSurveyFrequencyCustomData &&
                          errors.campaignSurveyFrequencyCustomData.type !== 'validate' && (
                            <ErrorMessage message={messagesData.errorList.required} />
                          )}
                        {errors.campaignSurveyFrequencyCustomData &&
                          errors.campaignSurveyFrequencyCustomData.type === 'validate' && (
                            <ErrorMessage message={String(errors.campaignSurveyFrequencyCustomData.message)} />
                          )}
                      </div>
                    )}
                </div>
                {errors.campaignSurveyFrequencyType && <ErrorMessage message={messagesData.errorList.required} />}
              </div>

              {eventBasedState && (
                <div className="mt-6">
                  <p className="mb-3 font-medium">Choose Event</p>
                  <div className="chooseEventWidth">
                    <Controller
                      name="campaignEventType"
                      control={control}
                      rules={{
                        required: isEditable ? true : false,
                      }}
                      render={({ field: { onChange, name } }) => (
                        <Select
                          isDisabled={true}
                          className=" bg-white rounded-lg app-react-select"
                          placeholder="Select Event"
                          menuIsOpen={false}
                          components={{
                            IndicatorSeparator: () => null,
                            DropdownIndicator,
                          }}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              padding: '6px 0',
                              borderRadius: '8px',
                              borderColor: '#E5E5EF',
                            }),
                            placeholder: (defaultStyles: any) => {
                              return {
                                ...defaultStyles,
                                color: '#363646',
                                opacity: 0.3,
                              };
                            },
                          }}
                          onChange={(val) => {
                            onChange(val);
                          }}
                          options={Object.entries(CampaignEventType).map((d) => ({
                            value: d[0],
                            label: formatLabel(d[1]),
                          }))}
                          value={getValues(name)}
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              {eventBasedState && (
                <div className="mt-6">
                  <p className="mb-3 font-medium">Set frequency </p>
                  <div className="flex">
                    <input
                      {...register('campaignSurveyFrequencyData', {
                        required:
                          getValues('campaignTriggerType') === CampaignSurveyTriggerTypes.EVENT_BASED ? true : false,
                        validate: (value) => {
                          if (getValues('campaignSurveyFrequencyData') && Number(value) <= 0) {
                            return messagesData.errorList.positiveValue;
                          } else if (getValues('campaignSurveyFrequencyData') && !Number(value)) {
                            return messagesData.errorList.specialCharactersNotAllowed;
                          }
                        },
                      })}
                      type="number"
                      placeholder="# of days Post Event "
                      disabled={!isEditable}
                      className={`px-4 py-3 border border-solid border-gray-300 placeholder-gray-500 bg-white rounded-lg chooseEventWidth
                      ${!isEditable ? 'bg-on-disable text-gray-650' : ''}`}
                    />
                    <p className="pl-3 pt-3 font-normal text-base text-gray-800">Days</p>
                  </div>
                  {errors.campaignSurveyFrequencyData &&
                    errors.campaignSurveyFrequencyData.type !== 'validate' && (
                      <ErrorMessage message={messagesData.errorList.required} />
                    )}
                  {errors.campaignSurveyFrequencyData &&
                    errors.campaignSurveyFrequencyData.type === 'validate' && (
                      <ErrorMessage message={String(errors.campaignSurveyFrequencyData.message)} />
                    )}
                </div>
              )}

              <div className="mt-6">
                <p className="mb-3 font-medium">Reminders to Completion Day</p>
                <div className="max-width-350">
                  <Controller
                    name="campaignSurveyReminderCompletionDay"
                    control={control}
                    rules={{
                      required: isEditable,
                    }}
                    render={({ field: { onChange, name } }) => (
                      <Select
                        isDisabled={!isEditable}
                        placeholder="None"
                        className="input-container bg-white rounded-xl max-width-350 app-react-select"
                        styles={customStylesSelectBox}
                        onChange={(val) => onChange(val)}
                        options={
                          Object.entries(CampaignSurveyReminderCompletion).map((c) => ({
                            value: c[0],
                            label: formatLabel(c[0]),
                          })) as any
                        }
                        components={{
                          IndicatorSeparator: () => null,
                          DropdownIndicator,
                        }}
                        value={getValues(name)}
                      />
                    )}
                  />
                </div>
                {errors.campaignSurveyReminderCompletionDay && (
                  <ErrorMessage message={messagesData.errorList.required} />
                )}
              </div>

              <div>
                <div className="mt-6 block sm:flex">
                  <div className="my-1">
                    <Controller
                      control={control}
                      name="campaignGroupRecipients"
                      render={({ field }) => (
                        <Radio.Group
                          onChange={(val) => field.onChange(val)}
                          className="flex flex-row radio-group"
                          defaultValue={getValues('campaignGroupRecipients')}
                          value={getValues('campaignGroupRecipients')}>
                          <Radio
                            size="sm"
                            className="text-gray-750 text-xsm mr-4"
                            key={CampaignSurveyAssignmentTypes.GROUP}
                            value={CampaignSurveyAssignmentTypes.GROUP}
                            disabled={!isEditable}
                            label="Select Groups"
                            onClick={() => {
                              if (params.templateId || params.duplicateId || params.campaignId) {
                                handleSelectGroups();
                                setGroupState(true);
                                clearErrors('campaignGroupRecipients');
                                setValue('campaignGroupRecipients', CampaignSurveyAssignmentTypes.GROUP);
                              }
                            }}
                          />
                          <Radio
                            size="sm"
                            key={CampaignSurveyAssignmentTypes.RECIPIENT}
                            value={CampaignSurveyAssignmentTypes.RECIPIENT}
                            className="md:pl-3 lg:pl-0 xl:pl-3 text-gray-750 text-xsm"
                            disabled={!isEditable}
                            label="Select Recipients"
                            onClick={() => {
                              if ((Number(appData.selectedFacilityId?.length) === 1) || (Number(appData.selectedFacilityId?.length) > 1 && getValues('selectFacility'))) {
                                clearErrors('campaignSurveyGroup');
                                setValue('campaignGroupRecipients', CampaignSurveyAssignmentTypes.RECIPIENT);
                                setGroupState(false);
                                setPatientListModal(true);
                              } else {
                                setIsSelectedFacility('Please select a facility from the dropdown to continue');
                              }
                            }}
                          />
                        </Radio.Group>
                      )}
                    />
                  </div>

                  {viewUserButton && (
                    <div className="mt-3 sm:mt-0 pl-0 sm:pl-4">
                      <button
                        type="button"
                        onClick={() => {
                          setPatientListModal(true);
                        }}
                        className="text-more bg-pt-blue-300 text-white font-medium px-4 py-0.5 sm:ml-4 rounded-lg whitespace-nowrap">
                        View User
                      </button>
                    </div>
                  )}

                  {isSelectedFcaility && <div className='pl-5 -mt-1'>
                    <ErrorMessage message="Please select a facility to continue" /></div>}

                  {selectedPatientRow.length > 0 && isEditable && (
                    <div className="text-more font-medium px-4 py-0.5 rounded-lg pl-0 sm:pl-4 whitespace-nowrap">
                      {`${pluralize(selectedPatientRow.length)} Selected`}
                    </div>
                  )}

                  {patientListData && patientListData?.length > 0 && !params.duplicateId && !isEditable && (
                    <div className="text-more font-medium px-4 py-0.5 rounded-lg">
                      {`${pluralize(patientListData?.length)}`}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${
                  getValues('campaignGroupRecipients') === CampaignSurveyAssignmentTypes.GROUP ||
                  (selectedPatientRow.length === 0 && !patientListData) ||
                  (getValues('campaignGroupRecipients') === CampaignSurveyAssignmentTypes.RECIPIENT &&
                    selectedPatientRow &&
                    selectedPatientRow.length <= 0)
                    ? ''
                    : 'hidden'
                } mt-5`}>
                <div className="max-width-350">
                  <Controller
                    name="campaignSurveyGroup"
                    control={control}
                    rules={{
                      required: isGroupOrRecipientRequired,
                    }}
                    render={({ field }) => (
                      <>
                        {getValues('campaignGroupRecipients') === CampaignSurveyAssignmentTypes.GROUP && (
                          <Select
                            isDisabled={!isEditable ? true : false}
                            isOptionDisabled={(option: DynamicGroupsName) => Boolean(option.isDisabled)}
                            placeholder="Select Groups"
                            name={field.name}
                            isMulti
                            className="input-container bg-white rounded-xl app-react-select capitalize"
                            styles={customStylesSelectBox}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            onChange={(p) => {
                              setSelectedGroupNames(p as DynamicGroupsName[]);
                              field.onChange(p);
                            }}
                            options={updatedGroupNames()}
                            components={{
                              Option: CheckboxOption,
                              DropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            value={getValues(field.name) as unknown as DynamicGroupsName[]}
                          />
                        )}
                      </>
                    )}
                  />
                </div>
                {errors.campaignSurveyGroup && <ErrorMessage message={messagesData.errorList.groupOrRecipient} />}
              </div>

              <div className="my-6 ">
                <div className="mb-6">
                  <p className="font-bold text-base pb-2">Days to Delay</p>
                  <p className="font-normal text-more text-gray-750 max-w-full md:max-w-1/2">
                    Assessment will be sent to all members of the group either starting immediately or be delayed with
                    the specified number of days after their group membership.
                  </p>
                </div>
                <div className="flex mt-2">
                  <div className="flex justify-start md:justify-center align-middle">
                    <label
                      htmlFor="delay"
                      className="flex items-center">
                      <input
                        id="delay"
                        type="checkbox"
                        disabled={!hasInOutPatientChecked}
                        className={`schedule-campaigns-checkbox appearance-none h-5 w-5 border 
                        border-primary-light checked:bg-primary-light checked:border-transparent 
                        rounded-md form-tick  ${hasInOutPatientChecked ? 'checkbox' : ''}`}
                        {...register('delayChecked')}
                      />
                      <span className="px-1 sm:px-3 text-gray-750 whitespace-nowrap">Delay</span>
                    </label>
                    <input
                      type="text"
                      {...register('delayOfDays', {
                        required: getValues('delayChecked') ? true : false,
                        validate: (value) => {
                          const regex = /^[0-9\b]+$/;
                          if (getValues('delayChecked') && Number(value) <= 0) {
                            return messagesData.errorList.positiveValue;
                          } else if (
                            getValues('delayChecked') &&
                            !Number(value) &&
                            value &&
                            regex.test(value.toString()) === false
                          ) {
                            return messagesData.errorList.specialCharactersNotAllowed;
                          }
                        },
                      })}
                      disabled={!getValues('delayChecked') || (getValues('delayChecked') && !isEditable)}
                      placeholder="No. of Days"
                      className={`border rounded-md bg-gray-300 max-width-130 py-3 ${
                        getValues('delayChecked') && isEditable ? 'bg-white' : 'bg-on-disable opacity-50'
                      }`}
                    />
                    {errors.delayOfDays && errors.delayOfDays.type !== 'validate' && (
                      <ErrorMessage
                        className="pl-2 pt-1.5"
                        message={messagesData.errorList.required}
                      />
                    )}
                    {errors.delayOfDays && errors.delayOfDays.type === 'validate' && (
                      <ErrorMessage
                        className="pl-2 pt-1.5"
                        message={String(errors.delayOfDays.message)}
                      />
                    )}
                    <p className="pl-1 sm:pl-3 pt-3 whitespace-nowrap">Days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mr-10 flex">
                <input
                  type="checkbox"
                  className={`schedule-campaigns-checkbox appearance-none h-5 w-5 border border-primary-light checked:bg-primary-light checked:border-transparent
          rounded-md form-tick margin-top-15 ${isEditable ? 'checkbox' : ''}`}
                  {...register('signatureChecked')}
                  disabled={!isEditable ? true : false}
                  id="sign"
                />
                <label
                  htmlFor="sign"
                  className="pl-3 pt-3">
                  Signature Required
                </label>
              </div>
            </div>

            <div className="pb-32"></div>
          </ContentFrame>
        )}

        {!!isUserHaveEditPermission && (
          <ContentFooter className="fixed bottom-0 w-full z-50">
            {!campaignDataLoading && !loadingTemplateData && (
              <div className="flex space-x-4">
                <Button
                  onClick={handleSubmit((formData) => handleSaveAndSchedule(formData))}
                  type="button"
                  text={buttonName}
                  className="mt-3 md:mt-0"
                  loading={(buttonClicked === 'scheduled' && (creating || updating))}
                  disabled={creating || updating}></Button>
                {showSaveAsDraftButton && (
                  <Button
                    text={'Save Draft'}
                    buttonStyle="gray"
                    onClick={handleSubmit(handleFormSubmit)}
                    type="button"
                    className="mt-3 md:mt-0"
                    loading={(buttonClicked === 'draft' && (creating || updating))}
                    disabled={creating || updating}></Button>
                )}
              </div>
            )}
          </ContentFooter>
        )}
        {patientListModal && (
          <div className="fixed modal-overlay pt-3 md:pt-5 px-3 md:px-8 pb-20 md:pb-10 top-0 left-0 right-0 bottom-0 bg-overlay">
            <SelectPatientModal
              onClose={() => handleOnClose()}
              onSubmit={() => handlePatientSubmit()}
              patientListData={patientListData}
              surveyTemplateId={campaign?.surveyTemplateId}
              isEditable={isEditable}
              selectedFacilityId={getValues('selectFacility')}
            />
          </div>
        )}
      </form>
    </div>
  );
}
