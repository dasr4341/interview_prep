import { SurveyTemplateTypes } from "health-generatedTypes";
import { useOutletContext } from "react-router-dom";

export interface CampaignDetailsOutlet {
  templateType: SurveyTemplateTypes | null
}

export function useCampaignDetailsOutletContext() {
  return useOutletContext<CampaignDetailsOutlet>();
}
