import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chartConfig } from './lib/chartConfig';

export interface StackGroupChartInterface {
  data: number[];
  labelForFilter?: string;
  label: string;
  stack: string;
  barPercentage: number;
  backgroundColor: string;
  assessmentType: 'complete' | 'incomplete';
}

export default function StackedGroupChart({
  loading,
  labels,
  dataSet,
  yMax,
  yAxisSteps,
}: {
  loading: boolean;
  labels: string[];
  dataSet: StackGroupChartInterface[];
  yMax: number;
  yAxisSteps?: number;
  }) {
  const prevSelected = useRef<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const [chartDataSets, setChartDataSets] = useState<{
    all: StackGroupChartInterface[];
    filtered: StackGroupChartInterface[];
  }>({
    all: [],
    filtered: [],
  });

  useEffect(() => {
    if (!!dataSet.length) {
      setChartDataSets({
        all: dataSet,
        filtered: dataSet,
      });
    }
  }, [dataSet]);

  useLayoutEffect(() => {
    const canvas2dContext = chartRef.current?.getContext('2d');
    if (canvas2dContext) {
      const chartInstance = chartConfig(
        canvas2dContext as CanvasRenderingContext2D,
        {
          labels,
          datasets: chartDataSets.filtered,
        }
      );
      return () => {
        chartInstance?.destroy();
      };
    }
  }, [chartDataSets, labels, yAxisSteps, yMax]);

  return (
    <div className='flex h-full items-center'>
      {!loading && !!chartDataSets.all.length && !!labels.length && (
        <div className=' flex md:flex-row flex-col md:w-full '>
          <div className=' pl-5 md:mr-6 lg:w-3/5 md:w-4/6 xl:w-3/4 2xl:w-10/12 '>
            <canvas
              ref={chartRef}
              className='mb-7'></canvas>
          </div>
          <ul className='mb-7 md:mb-0 md:space-y-2 flex flex-col space-x-0 flex-wrap'>
            {chartDataSets.all.map((el, i) => {
              return (
                <li
                  onClick={() => {
                    const filtered = el.label === prevSelected.current ? chartDataSets.all : chartDataSets.all.filter((f) => f.label === el.label);
                    setChartDataSets((state) => ({
                      ...state,
                      filtered,
                    }));
                    if (el.label ===  prevSelected.current) {
                      prevSelected.current = null;
                      return;
                    } 
                    prevSelected.current = el.label;
                  }}
                  className='flex flex-row items-center'
                  key={i}>
                  <div
                    className={`w-2.5 h-2.5 inline-block cursor-pointer mr-3 ${prevSelected.current === el.label ? 'text-bold' : ''}`}
                    style={
                      el.backgroundColor
                        ? {
                            backgroundColor: el.backgroundColor,
                            width: '0.75rem',
                            height: '0.75rem',
                            minWidth: '0.75rem',
                            maxHeight: '0.75rem',
                          }
                        : { borderBottom: '2px dashed #000' }
                    }></div>
                  <span
                    className={
                      'inline-block whitespace-nowrap text-xs 2xl:text-base text-gray-600  font-normal'
                    }>
                    {el.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {loading && (
        <div className=' mx-auto w-10/12 bg-gray-700 animate-pulse h-96'></div>
      )}
      {(!labels.length || !chartDataSets.all.length) && !loading && (
        <div className='bg-gray-100 rounded w-full p-4  flex justify-center items-center text-sm my-6 text-gray-150'>
          No Data Found
        </div>
      )}
    </div>
  );
}
