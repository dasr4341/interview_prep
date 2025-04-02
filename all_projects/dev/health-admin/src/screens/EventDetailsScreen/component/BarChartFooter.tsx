import { Stats } from 'interface/chart.interfaces';
import React from 'react';
import { BsArrowDownSquare, BsArrowsCollapse, BsArrowUpSquare } from 'react-icons/bs';

export default function BarChartFooter({
  chartStats,
  chartChangeUnit,
}: {
  chartStats?: Partial<Stats>;
  chartChangeUnit?: string;
}) {
  return (
    <>
      <div className="md:p-10 py-5 px-0">
        <div className='flex items-center md:mb-6 mb-3'>
          <BsArrowUpSquare className="text-red-800" size='1.5rem' /> 
          <p className='text-xs ml-3'>
            {chartStats?.max ? `${chartStats.max}${chartChangeUnit}—highest peak` : 'No data available'}
          </p>
        </div>
        <div className='flex items-center md:mb-6 mb-3'>
          <BsArrowsCollapse className='text-pt-blue-300' size='1.5rem' />
          <p className='text-xs ml-3'>
            {chartStats?.avg ? `${chartStats.avg}${chartChangeUnit}—avg for your age` : 'No data available'}
          </p>
        </div>
        <div className='flex items-center'>
          <BsArrowDownSquare className='text-gray-600' size='1.5rem' />
          <p className='text-xs ml-3'>
            {chartStats?.min ? `${chartStats.min}${chartChangeUnit}—lowest peak` : 'No data available'}
          </p>
        </div>
      </div>
    </>
  );
}
