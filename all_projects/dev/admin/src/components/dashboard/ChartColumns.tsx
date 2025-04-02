import { salesStageColors } from 'lib/constant/chartColor';
import { FC } from 'react';
import './_chartColumn.scoped.scss';
import Humanize from 'humanize-plus';
import { PipelineFilterType } from 'interface/pipeline.interface';

interface Props {
  selectedPipelineFilter: PipelineFilterType;
  // eslint-disable-next-line max-len
  pipelineData: any;
}

const ChartColumns: FC<Props> = ({ selectedPipelineFilter, pipelineData }) => {
  return (
    <>
      {selectedPipelineFilter === PipelineFilterType.BY_REVENUE &&
        pipelineData?.pipelineData?.map((d: any, i: number) => (
          <div
            key={d.label}
            className={`flex flex-col mt-4
            md:border-r md:border-gray-600 last:border-0 last:border-r-0
           column-num gray pr-5 mr-5 md:pr-3 mb-2 chart-column-w`}>
            <div>
              <sup className="font-bold text-base text-gray-150">$</sup>
              <span className="font-bold text-md text-gray-150 pl-1">
                {Humanize.compactInteger(d?.revenueAmount, 1)}
              </span>
            </div>
            <div className="text-sm text-gray-600 text-label relative pl-4">
              <span
                className="color-box absolute left-0 top-1.5"
                style={{ backgroundColor: salesStageColors[i] }}></span>
              {d.label}
            </div>
          </div>
        ))}
      {selectedPipelineFilter === PipelineFilterType.BY_OPPORTUNITY &&
        pipelineData?.pipelineData?.map((d: any, i: number) => (
          <div
            className="flex flex-col mt-4
            md:border-r md:border-gray-600 last:border-0 last:border-r-0
           column-num gray pr-5 mr-5 md:pr-3 mb-2 chart-column-w"
            key={d.label}>
            <span className="font-bold text-md text-gray-150">{d.opportunity}</span>
            <span className="text-sm text-gray-600 text-label stage-num relative pl-4">
              <span
                className="color-box absolute left-0 top-1.5"
                style={{ backgroundColor: salesStageColors[i] }}></span>
              {d.label}
            </span>
          </div>
        ))}
      {selectedPipelineFilter === PipelineFilterType.BY_PERCENT &&
        pipelineData?.pipelineData?.map((d: any, i: number) => (
          <div
            className="flex flex-col mt-4
          md:border-r md:border-gray-600 last:border-0 last:border-r-0
         column-num gray pr-5 mr-5 md:pr-3 mb-2 chart-column-w"
            key={d.label}>
            <span className="font-bold text-md text-gray-150">{d.percentage || 0}%</span>
            <span className="text-sm text-gray-600 text-label stage-num relative pl-4">
              <span
                className="color-box absolute left-0 top-1.5"
                style={{ backgroundColor: salesStageColors[i] }}></span>

              {d.label}
            </span>
          </div>
        ))}
    </>
  );
};

export default ChartColumns;
