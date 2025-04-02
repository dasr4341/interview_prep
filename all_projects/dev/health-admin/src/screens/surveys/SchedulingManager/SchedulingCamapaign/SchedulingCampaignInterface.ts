import { CampaignSurveyAssignmentTypes, CampaignSurveyTriggerTypes, SurveyCountPerParticipantType } from 'health-generatedTypes';

export interface CommonTypes {
  label: string;
  value: string;
}

export interface FormSubmitData {
  campaignParticipantType: SurveyCountPerParticipantType;
  campaignTriggerType: CampaignSurveyTriggerTypes;
  campaignEventType: CommonTypes | null;
  campaignGroupRecipients: CampaignSurveyAssignmentTypes;
  campaignSurveyStartDate: string;
  campaignSurveyEndDate: string;
  campaignSurveyFrequencyType: CommonTypes | null;
  campaignFrequencyType: CommonTypes | null;
  campaignSurveyGroup: string[];
  campaignSurveyReminderCompletionDay: CommonTypes;
  name: string;
  surveyTemplateId: string;
  campaignSurveyFrequencyCustomData: string;
  campaignSurveyFrequencyData: string;
  campaignSurveySignature?: boolean;
  delay?: boolean;
  delayOfDays?: number;
  signatureChecked?: boolean;
  delayChecked?: boolean;
  selectFacility?: string;
  saveAsDraft?: boolean;
}

export enum CampaignEventType {
  SURVEY_BY_PATIENT = 'ASSESSMENT_BY_PATIENT',
}

export interface RecipientType {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}