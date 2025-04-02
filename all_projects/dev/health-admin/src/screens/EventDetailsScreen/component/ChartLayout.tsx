import { ChartFooterData } from 'interface/chart-header.interface';
import React from 'react';
import ChartFooter from './ChartFooter';

export default function ChartLayout({
  children,
  chartFooterData,
}: {
  children: JSX.Element;
  chartFooterData?: ChartFooterData;
}) {
  return (
    <React.Fragment>
      <div className='graph-place mt-1 sm:mt-5'>
        {children}
      </div>
      
      <ChartFooter
        chartFooterData={chartFooterData}
      />
    </React.Fragment>
  );
}
