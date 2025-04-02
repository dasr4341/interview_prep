/* eslint-disable max-len */
import { ChartFooterData } from 'interface/chart-header.interface';
import { ChartNames } from 'interface/chart.interfaces';
import React from 'react';

export default function ChartFooter({ chartFooterData }: { chartFooterData?: ChartFooterData }) {
  return (
    <React.Fragment>
      {chartFooterData && chartFooterData?.legend && (
        <ul className="flex justify-center mt-7 mb-5 md:mt-10 md:mb-8">
          <li className="inline-block mr-6">
            <div className="flex items-center">
              <div style={{ background: 'rgba(234, 63, 42, 0.9)' }} className="inline-block w-4 h-4 md:w-5 md:h-5"></div>
              <span className="inline-block text-xs font-bold text-primary ml-3">Anomaly</span>
            </div>
          </li>
          <li className="inline-block mr-6">
            <div className="flex items-center">
              <div style={{ background: '#DCDEDF' }} className="inline-block w-4 h-4 md:w-5 md:h-5"></div>
              <span className="inline-block text-xs font-bold text-primary ml-3">Other days</span>
            </div>
          </li>
        </ul>
      )}

      {(chartFooterData?.chartName === ChartNames.heart || chartFooterData?.chartName === ChartNames.steps) && 
        <span className='block text-center mb-3'>({chartFooterData?.timeZone})</span>
      }
    </React.Fragment>
  );
}
