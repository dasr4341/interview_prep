import { GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys, SurveyStatusType } from "health-generatedTypes";

function FormatContext(data?: string) {
  if (data) {
    return data.split('_').map(el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  }

  return 'N/A';
};

export function getStatus({ campaignData }: { campaignData: GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys }) {
  const { currentStatus } = campaignData || {};
  const status = {
    name: '',
    tooltip: '',
    styleClass: '',
  };

  if (currentStatus === SurveyStatusType.PAUSED) {
    status.name = FormatContext(currentStatus);
    status.tooltip = 'This campaign paused. Assessments are not being sent.';
    status.styleClass = 'bg-gray-500';

    // paused status takes precedence over other statuses so we return
    return status;
  }

  if (currentStatus === SurveyStatusType.DRAFT) {
    status.name = FormatContext(currentStatus);
    status.tooltip = 'This campaign is not live. Edit the campaign to schedule it.';
    status.styleClass = 'bg-gray-500';
  }

  if (currentStatus === SurveyStatusType.IN_PROGRESS) {
    status.name = FormatContext(currentStatus);
    status.tooltip = 'This campaign is in progress. Assessments are being sent.';
    status.styleClass = 'bg-pt-green-500';
  }

  if (currentStatus === SurveyStatusType.SCHEDULED) {
    status.name = FormatContext(currentStatus);
    status.tooltip = 'This campaign is scheduled and assessments will be sent on the start date.';
    status.styleClass = 'bg-gray-500';
  }

  if (currentStatus === SurveyStatusType.ENDED) {
    status.name = FormatContext(currentStatus);
    status.tooltip = 'This campaign has ended.';
    status.styleClass = '';
  }

  return status;
}