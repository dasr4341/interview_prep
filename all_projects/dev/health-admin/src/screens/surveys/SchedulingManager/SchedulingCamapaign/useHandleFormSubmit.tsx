import { FormSubmitData } from './SchedulingCampaignInterface';
import {
  CampaignSurveyAssignmentTypes,
  CampaignSurveyEventTypes,
  CampaignSurveyFrequency,
  CampaignSurveyGroupType,
  CampaignSurveyReminderCompletion,
  CampaignSurveyTriggerTypes,
  CreateCampaignSurvey,
  CreateCampaignSurveyVariables,
  SingleCampaignSurvey_pretaaHealthGetCampaignSurvey,
  SurveyCountPerParticipantType,
  UpdateCampaignSurvey,
  UpdateCampaignSurveyVariables,
} from 'health-generatedTypes';
import { useMutation } from '@apollo/client';
import { updateCampaign as updateCampaignMutation } from 'graphql/update-campaign.mutation';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'routes';
import catchError from 'lib/catch-error';
import { SentToPatientSelectedRows } from 'interface/app.slice.interface';
import { createCampaignMutation } from 'graphql/create-campaign.mutation';
import { useAppDispatch } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';
import { useState } from 'react';
import { cloneDeep } from 'lodash';

export default function useHandleFormSubmit({
  setError,
  clearErrors,
  campaign,
  selectedPatientRow,
}: {
  setError: UseFormSetError<FormSubmitData>;
  clearErrors: UseFormClearErrors<FormSubmitData>;
  campaign: SingleCampaignSurvey_pretaaHealthGetCampaignSurvey | null;
  selectedPatientRow: SentToPatientSelectedRows[] | null;
}) {
  const [buttonClicked, setButtonClicked] = useState<'scheduled' | 'draft' | ''>('')
  const params: {
    templateId?: string;
    campaignId?: string;
    duplicateId?: string;
  } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // update Campaign Template
  const [updateCampaign, { loading: updating }] = useMutation<UpdateCampaignSurvey, UpdateCampaignSurveyVariables>(
    updateCampaignMutation,
  );

  // Create template
  const [createCampaign, { loading: creating }] = useMutation<CreateCampaignSurvey, CreateCampaignSurveyVariables>(
    createCampaignMutation,
  );

  const handleFormSubmit = (onsubmitData: FormSubmitData) => {
    console.log('Campaign form data', cloneDeep(onsubmitData));

    setButtonClicked(onsubmitData.saveAsDraft === false ? 'scheduled' : 'draft' )
    let isValid = true;

    if (+new Date(onsubmitData.campaignSurveyStartDate) > +new Date(onsubmitData.campaignSurveyEndDate)) {
      isValid = false;
      setError('campaignSurveyStartDate', {
        message: 'Start Date needed less than end date',
        type: 'validate',
      });
    } else if (+new Date(onsubmitData.campaignSurveyStartDate) === +new Date(onsubmitData.campaignSurveyEndDate)) {
      isValid = false;
      setError('campaignSurveyStartDate', {
        message: 'Start date and end date can not be same',
        type: 'validate',
      });
    } else {
      clearErrors('campaignSurveyStartDate');
    }

    if (
      new Date(onsubmitData.campaignSurveyStartDate).getDate() > 28 &&
      onsubmitData.campaignSurveyFrequencyType?.value === CampaignSurveyFrequency.MONTHLY
    ) {
      isValid = false;
      setError('campaignSurveyStartDate', {
        message: 'When frequency set to monthly, only 1-28 can be selected',
        type: 'validate',
      });
    } else {
      clearErrors('campaignSurveyStartDate');
    }

    // Form Data transformation

    const selectedGroups = onsubmitData?.campaignSurveyGroup?.map((v: any) => {
      return v.value;
    }) as CampaignSurveyGroupType[];

    const selectedRecipients = selectedPatientRow?.map((v: SentToPatientSelectedRows) => {
      return v.id;
    }) as string[];

    // CreateCampaignSurveyVariables | UpdateCampaignSurveyVariables
    // Todo: find out data transformation process if more simpler
    const formData: any = {
      surveyCountPerParticipantType: onsubmitData.campaignParticipantType as SurveyCountPerParticipantType,
      triggerType:
        onsubmitData.campaignParticipantType === SurveyCountPerParticipantType.MULTIPLE
          ? (onsubmitData.campaignTriggerType as CampaignSurveyTriggerTypes)
          : null,
      name: onsubmitData.name,
      campaignSurveyEndDate: onsubmitData.campaignSurveyEndDate,
      campaignSurveyStartDate: onsubmitData.campaignSurveyStartDate,
      surveyEventType:
        onsubmitData.campaignTriggerType === CampaignSurveyTriggerTypes.EVENT_BASED &&
        onsubmitData.campaignParticipantType !== SurveyCountPerParticipantType.SINGLE
          ? (CampaignSurveyEventTypes.SURVEY_BY_PATIENT as CampaignSurveyEventTypes)
          : null,
      surveyAssignmentType: onsubmitData.campaignGroupRecipients as CampaignSurveyAssignmentTypes,
      campaignSurveyGroup:
        onsubmitData.campaignGroupRecipients === CampaignSurveyAssignmentTypes.GROUP ? selectedGroups : null,
      recipientsId:
        onsubmitData.campaignGroupRecipients === CampaignSurveyAssignmentTypes.RECIPIENT ? selectedRecipients : null,
      campaignSurveyReminderCompletionDay:
        (onsubmitData.campaignSurveyReminderCompletionDay?.value as CampaignSurveyReminderCompletion) || null,

      campaignSurveySignature: onsubmitData.signatureChecked || false,
      facilityId: onsubmitData.selectFacility,
      saveAsDraft: onsubmitData.saveAsDraft,
     
    };

    formData.delay = onsubmitData.delayChecked || false;
    formData.delayOfDays = onsubmitData.delayOfDays ? Number(onsubmitData.delayOfDays) : null;

    if (
      onsubmitData?.campaignTriggerType === CampaignSurveyTriggerTypes.EVENT_BASED &&
      onsubmitData.campaignParticipantType !== SurveyCountPerParticipantType.SINGLE
    ) {
      formData.campaignSurveyFrequencyType = CampaignSurveyFrequency.CUSTOM;

      formData.campaignSurveyFrequencyCustomData =
      onsubmitData.campaignSurveyFrequencyData
        ? Number(onsubmitData.campaignSurveyFrequencyData)
          : null;
      
    } else if (onsubmitData?.campaignTriggerType === CampaignSurveyTriggerTypes.TIME_BASED) {

      formData.campaignSurveyFrequencyCustomData =
          onsubmitData.campaignSurveyFrequencyCustomData
            ? Number(onsubmitData.campaignSurveyFrequencyCustomData)
            : null;
      

      formData.campaignSurveyFrequencyType = onsubmitData?.campaignSurveyFrequencyType
        ?.value as CampaignSurveyFrequency;
      
    } else {
      formData.campaignSurveyFrequencyType = null;
    }


    // Form Data transformation process done

    // Now Set template ID when someone creating
    // This is needed when only campaign creating
  if (params.templateId || campaign?.surveyTemplateId) {
      formData.surveyTemplateId = params.templateId || campaign?.surveyTemplateId;
    }

    // Now set survey ID when someone editing a campaign
    if (params.campaignId) {
      formData.campaignSurveyId = params.campaignId;
    }

    if (params?.campaignId && isValid) {
      // Only update campaign logic run when params contains campaign id
      updateCampaign({
        variables: {
          ...formData
        },
        onCompleted: () => {
          toast.success('Campaign updated successfully');
          if (onsubmitData.campaignParticipantType === SurveyCountPerParticipantType.MULTIPLE) {
            navigate(
              routes.scheduleManagerDetail.listCampaigns.build(
                (params.templateId || campaign?.surveyTemplateId) as string,
                SurveyCountPerParticipantType.MULTIPLE,
              ),
            );
          } else {
            navigate(
              routes.scheduleManagerDetail.listCampaigns.build(
                (params.templateId || campaign?.surveyTemplateId) as string,
                SurveyCountPerParticipantType.SINGLE,
              ),
            );
          }
        },

        onError: (e) => catchError(e, true),
      });
    } else if ((params.templateId || params.duplicateId) && isValid) {
      createCampaign({
        variables: {
          ...formData,
        },
        onCompleted: () => {
          if (params.campaignId) {
            toast.success('Campaign updated successfully');
          } else if (params.duplicateId) {
            toast.success('Campaign duplicated successfully');
          } else {
            toast.success('Campaign Scheduled Successfully');
          }
          dispatch(appSliceActions.setSelectedPatientList([]));
          dispatch(appSliceActions.setSelectedPatientRows([]));

          if (onsubmitData.campaignParticipantType === SurveyCountPerParticipantType.MULTIPLE) {
            navigate(
              routes.scheduleManagerDetail.listCampaigns.build(
                (params.templateId || campaign?.surveyTemplateId) as string,
                SurveyCountPerParticipantType.MULTIPLE,
              ),
            );
          } else {
            navigate(
              routes.scheduleManagerDetail.listCampaigns.build(
                (params.templateId || campaign?.surveyTemplateId) as string,
                SurveyCountPerParticipantType.SINGLE,
              ),
            );
          }
        },

        onError: (e) => catchError(e, true),
      });
    }
  };

  return {
    handleFormSubmit,
    updating,
    creating,
    setButtonClicked,
    buttonClicked
  };
}
