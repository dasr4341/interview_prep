import React from 'react';
import { useParams } from 'react-router-dom';

import { makeSettingsNavLinks } from 'components/NavBar/SideNavBar';
import { routes } from 'routes';
import { SurveyCountPerParticipantType } from 'health-generatedTypes';

export default function SchedulingManagerNav() {
  const params = useParams() as any;
  return (
    <>
      {makeSettingsNavLinks(
        [
          routes.schedulingManagerList.match,
          routes.scheduleManagerDetail.listCampaigns.build(String(params.templateId), SurveyCountPerParticipantType.SINGLE),
          routes.scheduleManagerDetail.listCampaigns.build(String(params.templateId), SurveyCountPerParticipantType.MULTIPLE),
          routes.scheduleManagerDetail.scheduleCampaign.build(params.templateId),
          routes.scheduleManagerDetail.editCampaign.build(params.campaignId),
          routes.scheduleManagerDetail.duplicateCampaign.build(params.duplicateId),
        ],
        'Scheduler',
        location.pathname
      )}
    </>
  );
}
