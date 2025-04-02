export  interface SelectedCampaign {
  campaignId: string;
  templateCode: string;
  campaignName: string;
  campaignType: string;
}
export interface AssessmentReportSlice {
  selectedCampaign: SelectedCampaign | null;
}
