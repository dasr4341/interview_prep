import { CampaignSurveyEventTypes, CampaignSurveyFrequency, CampaignSurveyTriggerTypes, SurveyCountPerParticipantType, SurveyStatusType } from "health-generatedTypes";
import { formatDate } from "lib/dateFormat";
import { pluralize, toTitleCase } from "lib/helperFunction/common";

export interface Campaign {
  id: string;
  campaignName: string;
  frequencyType: string;
  startDate: string | null;
  startTime: string | null;
  endDate: string | null;
  createdOn: string | null;
  pause: boolean;
  campaignSurveyFrequencyCustomData: number;
  surveyCountPerParticipantType: SurveyCountPerParticipantType | null;
  triggerType: string;
  surveyEventType: CampaignSurveyEventTypes | null;
  publishedAt: string | null;
  published: boolean;
  facility?: string;
  frequency: string;
  status: SurveyStatusType;
  statusEl: any;
}

export default function FormattedStartDateCellRenderer(props: { data: Campaign }) {
  if (props.data.startDate) {
    return <div>{formatDate({ date: `${props.data.startDate} ${props.data.startTime}`, formatStyle: 'agGrid-date-time' }) || 'N/A'}</div>;
  }
}

export const FormattedCreateOnCellRenderer = (props: { data: Campaign }) => {
  if (props.data.createdOn) {
    return (<div>{formatDate({ date: props.data.createdOn }) || 'N/A'}</div>);
  }
};

export const FormattedEndDateCellRenderer = (props: { data: Campaign }) => {
  if (props.data.endDate) {
    return (<div>{formatDate({ date: props.data.endDate }) || 'N/A'}</div>);
  }
};

export function handleAssessmentType(triggerType: string | null) {
  if (triggerType === CampaignSurveyTriggerTypes.EVENT_BASED) {
    return 'Event Based';
  } else if (triggerType === CampaignSurveyTriggerTypes.TIME_BASED) {
    return 'Time Based';
  } else {
    return 'N/A';
  }
}

export const handleFrequencyData = (frequency: string, campaignSurveyFrequencyCustomData: number) => {
  if (frequency === CampaignSurveyFrequency.CUSTOM) {
    return pluralize(campaignSurveyFrequencyCustomData);
  } else {
    return toTitleCase(frequency || '');
  }
};