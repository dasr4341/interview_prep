import {
  CampaignSurveyAssignmentTypes,
  CampaignSurveyEventTypes,
  CampaignSurveyReminderCompletion,
  CampaignSurveyTriggerTypes,
  SurveyCountPerParticipantType,
} from 'health-generatedTypes';
import { titleCase } from 'humanize-plus';
import { components } from 'react-select';
import { CampaignEventType } from './SchedulingCampaignInterface';

export interface DynamicGroupsName {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export function formatLabel(res: string) {
  return titleCase(res.split('_').join(' ').toLowerCase());
}

export const pluralize = (count: number) =>
  `${count} ${count > 1 ? 'Patients' : 'Patient'}`;

export const customStylesSelectBox = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    padding: '6px 0',
    borderRadius: '8px',
    borderColor: '#E5E5EF',
  }),
};

export const defaultCampaignValues = {
  campaignParticipantType: SurveyCountPerParticipantType.SINGLE,
  campaignTriggerType:  CampaignSurveyTriggerTypes.TIME_BASED,
  campaignGroupRecipients: CampaignSurveyAssignmentTypes.GROUP,
  campaignSurveyReminderCompletionDay: {
    label: formatLabel(CampaignSurveyReminderCompletion.NONE),
    value: CampaignSurveyReminderCompletion.NONE,
  },
  campaignEventType: {
    label: formatLabel(CampaignEventType.SURVEY_BY_PATIENT),
    value: CampaignSurveyEventTypes.SURVEY_BY_PATIENT,
  },
  saveAsDraft: true
};

export const CheckboxOption = (props: any) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => props.selectOption(props.data)}
        className="appearance-none h-5 w-5 border
        border-primary-light
        checked:bg-primary-light checked:border-transparent
        rounded-md form-tick mr-3 margin-top"
      />
      {props.label}
    </components.Option>
  );
};

