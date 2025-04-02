import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chartConfig } from './lib/chartConfig';
import { Skeleton } from '@mantine/core';

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
  yAxisSteps
}: {
  loading: boolean;
  labels: string[];
  dataSet: StackGroupChartInterface[];
    yMax: number;
    yAxisSteps?: number
}) {
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
        },
        yMax,
        yAxisSteps
      );
      return () => {
        chartInstance?.destroy();
      };
    }
    // 
  }, [chartDataSets, labels]);

  return (
    <div className="flex h-full items-center">
      {!loading && (!!chartDataSets.all.length && !!labels.length)  && (
        <div className=' flex md:flex-row flex-col w-11/12 md:w-full '>
          <div className="md:mr-8 md:w-10/12 lg:w-3/4 xl:w-10/12 ">
            <canvas
              ref={chartRef}
              className="mb-7 max-h-96 "></canvas>
          </div>
          <ul className=" md:space-y-2 flex md:flex-col flex-row flex-wrap md:space-x-0">
            {chartDataSets.all
              .map((el) => {
                return (
                  <li
                    className=" uppercase mr-2 md:mr-0  flex flex-row items-center "
                    key={el.label}>
                    <div
                      className="w-2.5 h-2.5 inline-block mr-3"
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
                      className={'inline-block whitespace-nowrap text-xs md:text-sm 2xl:text-base text-gray-600 font-normal'}>
                      { el.assessmentType === 'complete' ? (el.labelForFilter ?? el.label ) : el.assessmentType}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      {loading && (
        <Skeleton height={320} />
      )}
      {(!labels.length || !chartDataSets.all.length)
        && !loading && <div className="bg-gray-100 rounded w-full p-4  flex justify-center items-center text-sm my-6 text-gray-150">
          No Data Found
        </div>}
    </div>
  );
}
