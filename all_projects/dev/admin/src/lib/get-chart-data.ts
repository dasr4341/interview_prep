import Humanize from 'humanize-plus';
import { PipelineFilterType } from 'interface/pipeline.interface';

interface Props {
  selectedPipelineFilter: PipelineFilterType;
  pipelineData: any | null | undefined;
}

export const getChartData = ({ selectedPipelineFilter, pipelineData }: Props) => {
  let customData: number[] = [];
  let value = '';

  if (pipelineData) {
    if (selectedPipelineFilter === PipelineFilterType.BY_PERCENT) {
      customData =
        pipelineData.pipelineData?.map(
          // Need to pass 0 as default as customData must be number[] (without it, it'd be (number | null)[])
          (d: any) => d.percentage || 0
        ) || [];
        value =  pipelineData?.totalPercentage?.toString() + '%';
    } else if (selectedPipelineFilter === PipelineFilterType.BY_REVENUE) {
      value = '$' + Humanize.compactInteger(pipelineData.totalRevenue, 1);
      customData = pipelineData.pipelineData?.map((d: any) => d.revenueAmount || 0) || [];
    } else if (selectedPipelineFilter === PipelineFilterType.BY_OPPORTUNITY) {
      customData = pipelineData.pipelineData?.map((d: any) => d.opportunity || 0) || [];
      value =  pipelineData?.totalOpportunity?.toString() || '';
    }
  }
  return { customData, value };
};
