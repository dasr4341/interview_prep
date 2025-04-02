import { singleCampaignView } from 'graphql/single-campaign-view.query';
import { useLazyQuery } from '@apollo/client';
import {
  CampaignSurveyAssignmentTypes,
  CampaignSurveyGroupType,
  CampaignSurveyTriggerTypes,
  SingleCampaignSurvey,
  SingleCampaignSurveyVariables,
  SingleCampaignSurvey_pretaaHealthGetCampaignSurvey,
  SurveyCountPerParticipantType,
} from 'health-generatedTypes';
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { CommonTypes, FormSubmitData, RecipientType } from './SchedulingCampaignInterface';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatLabel } from './ScheduleCampaginLibs';
import { replaceTimeZone } from 'lib/dateFormat';

export default function useCampaignFormPatch({
  setValue,
  trigger,
  setPatientListData,
  setSelectedStartDate,
  setMultipleParticipantState,
  setSelectedEndDate,
  setEventBasedState
}: {
  setValue: UseFormSetValue<FormSubmitData>;
  trigger: UseFormTrigger<FormSubmitData>,
  setPatientListData: React.Dispatch<React.SetStateAction<RecipientType[]>>;
  setSelectedStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  setSelectedEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  setMultipleParticipantState: React.Dispatch<React.SetStateAction<boolean>>,
  setEventBasedState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params: {
    templateId?: string;
    campaignId?: string;
    duplicateId?: string;
  } = useParams();
  const [campaign, setCampaign] =
    useState<SingleCampaignSurvey_pretaaHealthGetCampaignSurvey | null>(null);

  const [isEditable, setIsEditable] = useState(true);

  // get campaign data
  const [
    getCampaignData,
    { loading: campaignDataLoading },
  ] = useLazyQuery<SingleCampaignSurvey, SingleCampaignSurveyVariables>(
    singleCampaignView,
    {
      onCompleted: (d) => {
        if (d.pretaaHealthGetCampaignSurvey) {
          if (params.duplicateId ) {
            setIsEditable(true);
          } else if ( params.campaignId ) {
            if (d.pretaaHealthGetCampaignSurvey.published === false && d.pretaaHealthGetCampaignSurvey.editable ) {
              setIsEditable(true);
            } else {
              setIsEditable(false);
            }
          }
          setCampaign(d.pretaaHealthGetCampaignSurvey);

          setValue(
            'campaignGroupRecipients',
            d.pretaaHealthGetCampaignSurvey
              .surveyAssignmentType as CampaignSurveyAssignmentTypes
          );
          const newGroup: CommonTypes[] =
            d.pretaaHealthGetCampaignSurvey.surveyGroup?.map((t) => {
              if (t.groupName === 'IN_CENSUS') {
                return { value: CampaignSurveyGroupType.IN_PATIENT, label: formatLabel(t.groupName) };
              } else if (t.groupName === 'DISCHARGED'){
                return { value: CampaignSurveyGroupType.OUT_PATIENT, label: formatLabel(t.groupName) };
              } else {
                return { value: t.groupName, label: formatLabel(t.groupName) };
              }
             
            }) as CommonTypes[];

          const recipients =
            d.pretaaHealthGetCampaignSurvey.surveyRecipients?.map((el) => {
              return {
                id: el.userId && String(el.userId),
                firstName:  el.recipientsFirstName,
                lastName: el.recipientsLastName,
              };
            }) || [];
          setPatientListData(recipients);

          setValue('campaignSurveyGroup', newGroup as any);
  

          if (params.duplicateId) {
            setValue(
              'name',
              `Copy of ${d.pretaaHealthGetCampaignSurvey.title}`
            );
          } else {
            setValue('name', d.pretaaHealthGetCampaignSurvey.title);
          }

          trigger('name');

          setValue(
            'delayChecked',
            d.pretaaHealthGetCampaignSurvey.delay || false
          );
          trigger('delayChecked');
          if (d.pretaaHealthGetCampaignSurvey.delayOfDays) {
            setValue(
              'delayOfDays',
              Number(d.pretaaHealthGetCampaignSurvey.delayOfDays)
            );
          }

          trigger('delayOfDays');


          // info: replace is intended as per backend info
          const formattedStartDate = replaceTimeZone(d.pretaaHealthGetCampaignSurvey.startDate);


          // For UX purposes UI does not needed to prefill the start and end date 
          if (!params.duplicateId) {
            setSelectedStartDate(
              new Date(formattedStartDate)
            );
            setValue(
              'campaignSurveyStartDate',
              formattedStartDate
            );
            trigger('campaignSurveyStartDate');
            setValue('selectFacility', d.pretaaHealthGetCampaignSurvey.facilityId);
            trigger('selectFacility');
            setValue(
              'campaignSurveyEndDate',
              d.pretaaHealthGetCampaignSurvey.campaignSurveyEndDate
            );
            trigger('campaignSurveyEndDate');
            setSelectedEndDate(
              new Date(d.pretaaHealthGetCampaignSurvey.campaignSurveyEndDate)
            );
          }
          

          setValue(
            'campaignParticipantType',
            d.pretaaHealthGetCampaignSurvey
              .surveyCountPerParticipantType as SurveyCountPerParticipantType
          );
          setValue(
            'campaignTriggerType',
            d.pretaaHealthGetCampaignSurvey
              .triggerType as CampaignSurveyTriggerTypes
          );
          if (d.pretaaHealthGetCampaignSurvey.triggerType) {
            setMultipleParticipantState(true);
          }
          if (
            d.pretaaHealthGetCampaignSurvey.triggerType ===
            CampaignSurveyTriggerTypes.EVENT_BASED
          ) {
            setEventBasedState(true);
          }
          if (d.pretaaHealthGetCampaignSurvey.campaignSurveyFrequencyType) {
            setValue('campaignSurveyFrequencyType', {
              value:
                d.pretaaHealthGetCampaignSurvey.campaignSurveyFrequencyType,
              label: formatLabel(
                d.pretaaHealthGetCampaignSurvey
                  .campaignSurveyFrequencyType as string
              ),
            });
            trigger('campaignSurveyFrequencyType');
          }

          setValue(
            'campaignSurveyFrequencyCustomData',
            d.pretaaHealthGetCampaignSurvey.campaignSurveyFrequencyCustomData
              ? String(
                  d.pretaaHealthGetCampaignSurvey
                    .campaignSurveyFrequencyCustomData
                )
              : ''
          );
          trigger('campaignSurveyFrequencyCustomData');


          setValue(
            'campaignSurveyFrequencyData', String(d.pretaaHealthGetCampaignSurvey.campaignSurveyFrequencyCustomData)
          );
          trigger('campaignSurveyFrequencyData');

          if (d.pretaaHealthGetCampaignSurvey.campaignSurveyCompletionDay) {
            setValue('campaignSurveyReminderCompletionDay', {
              value:
                d.pretaaHealthGetCampaignSurvey.campaignSurveyCompletionDay,
              label: formatLabel(
                d.pretaaHealthGetCampaignSurvey
                  .campaignSurveyCompletionDay as string
              ),
            });
            trigger('campaignSurveyReminderCompletionDay');
          }

          setValue(
            'signatureChecked',
            d.pretaaHealthGetCampaignSurvey.campaignSurveySignature
          );
        }
      },
    }
  );

  // Get Campaign data only if edit routes detected
  useEffect(() => {
   
    if (params?.campaignId || params.duplicateId) {
      getCampaignData({
        variables: {
          campaignSurveyId: (params.campaignId || params.duplicateId) as string,
        },
      });
    }
  }, [params?.campaignId, params.duplicateId]);

  return {
    campaignDataLoading,
    campaign,
    isEditable
  };
}
