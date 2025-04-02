import React, { useContext } from 'react';
import BiometricScalePart from './BiometricScalePart';
import './_health-report.scoped.scss';
import { SimpleDailyReportContext } from '../EventDetailAccordion';

export default function WelnessReport() {
  const dailyReportData = useContext(SimpleDailyReportContext);
  return (
    <React.Fragment>
      <div className="pb-0 md:pb-6 relative block sm:flex justify-between  mb-0 md:mb-5 bio-wrap">
        <div className="mb-3 md:mb-0">
          <div className="inline-block font-semibold uppercase text-xs-md text-gray-850 tracking-widest mb-2">
            {dailyReportData?.simpleReportData?.reportName ?? 'N/A'}
          </div>
          <div className="text-sm font-normal text-gray-850 tracking-widest">
            Event date:{' '}
            <span>{dailyReportData?.simpleReportData?.eventDate ?? 'N/A'}</span>
          </div>
          <div className="text-sm font-normal text-gray-850 tracking-widest">
            Date published:{' '}
            <span>
              {dailyReportData?.simpleReportData?.datePublished ?? 'N/A'}
            </span>
          </div>
          <div className="text-more text-gray-850 tracking-widest font-semibold mb-1 mt-2.5 capitalize">
            {dailyReportData?.simpleReportData?.name ?? 'N/A'}
          </div>
          <div className="capitalize text-sm font-normal text-gray-850 tracking-widest">
            Patient report:{' '}
            <span>{dailyReportData?.simpleReportData?.reportId ?? 'N/A'}</span>
          </div>
        </div>

        <div className="text-center">
          <React.Fragment>
            <BiometricScalePart />
          </React.Fragment>
        </div>
      </div>
    </React.Fragment>
  );
}
