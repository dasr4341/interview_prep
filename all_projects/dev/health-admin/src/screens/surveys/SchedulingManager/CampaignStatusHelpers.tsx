import { SurveyStatusType } from 'health-generatedTypes';

export function campaignIsPublished(published: boolean) {
  // campaign is published, could be paused or unpaused as well
  // other arg type used in SchedulingManager detail
  return published
}

export function campaignIsPaused(pause: boolean) {
  // campaign is paused, only relevant for published campaigns
  return pause;
}

export function campaignIsScheduled(status: SurveyStatusType) {
  return status === SurveyStatusType.SCHEDULED;
}

export function campaignIsInProgress(status: SurveyStatusType) {
  return status === SurveyStatusType.IN_PROGRESS;
}

export function campaignIsEnded(status: SurveyStatusType) {
  return status === SurveyStatusType.ENDED
}
