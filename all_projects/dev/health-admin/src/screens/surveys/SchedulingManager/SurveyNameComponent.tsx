import { SurveyCountPerParticipantType } from 'health-generatedTypes';
import { Link, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { campaignIsEnded, campaignIsPublished } from './CampaignStatusHelpers';
import { Campaign } from './SchedulingCamapaign/ScheduleManagerDetailsHelper';

export default function SurveyNameComponent({ data }: { data: Campaign }) {
  const { templateId } = useParams();
  
  const changeLink = () => {
    if (
      data.surveyCountPerParticipantType === 
      SurveyCountPerParticipantType.MULTIPLE && (campaignIsPublished(data.published) || campaignIsEnded(data.status))
    ) {
      return (
        <Link 
          to={routes.scheduleManagerDetail.surveyStats.build(String(templateId), String(data.id), { campaignName: data.campaignName })}>
          {data.campaignName}
        </Link>
      );
    } else if (
      data.surveyCountPerParticipantType === SurveyCountPerParticipantType.SINGLE && (campaignIsPublished(data.published) || campaignIsEnded(data.status))) {
      return <div className="cursor-pointer">{data.campaignName}</div>;
    } else if (!campaignIsPublished(data.published) || !campaignIsEnded(data.status)) {
      return <Link to={routes.scheduleManagerDetail.editCampaign.build(String(data.id))}>{data.campaignName}</Link>;
    } else {
      return data.campaignName || 'N/A';
    }
  };

  return (
    <div className="flex">
      <div className="mb-3">
        <div className=" block mt-2 w-full py-0.5 text-xsm capitalize leading-5 font-semibold text-pt-blue-300 ">
          {changeLink()}
        </div>
      </div>
    </div>
  );
}
