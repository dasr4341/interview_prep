import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getConfigChart } from './lib/chartConfig';
import { ChartTypes } from '../enum/ChartTypes.enum';
import {
  ChartDataInterface,
  ChartPayloadDataInterface,
} from './interface/BamChart.interface';
import { Skeleton } from '@mantine/core';

export default function BamChart({
    currentPoint = 'null',
    chart,
    loading,
  data,
  chartDirection,
  isDownloadPdfRoute
}: {
    chart: ChartTypes;
    currentPoint?: string;
    data: ChartPayloadDataInterface;
    loading?: boolean;
    chartDirection?: {
      leftAxis: 'line' | 'bar',
      rightAxis: 'line' | 'bar',
    };
    isDownloadPdfRoute?: boolean;
  }) {
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [dataSets, setDataSets] = useState<ChartDataInterface>({
    allData: [],
    filteredData: [],
    labels: [],
    leftAxis: {
      max:  0,
      min: 0
    },
    rightAxis: {
      max: 0, 
      min: 0
    }
  });

  useLayoutEffect(() => {
    if (chartRef.current?.getContext('2d')) {
      const chartInstance = getConfigChart(
        chart,
        chartRef.current.getContext('2d') as CanvasRenderingContext2D,
        dataSets.labels,
        dataSets.filteredData,
        currentPoint,
        dataSets.leftAxis,
        dataSets.rightAxis,
        chartDirection
      );
      return () => {
        chartInstance?.destroy();
      };
    }
  }, [chart, chartDirection, currentPoint, dataSets]);


  useEffect(() => {
    setDataSets(() => {
      return {
        labels: data.labels,
        leftAxis: data.leftAxis,
        rightAxis: data.rightAxis,
        allData: data.data,
        filteredData: data.data,
      };
    });
  }, [data]);

  return (
    <div>
      {loading && <Skeleton height={256} my={16} />}
      {(!dataSets.labels.length && !dataSets.allData.length)
        && !loading && <div className="bg-gray-100 rounded w-full p-4  flex justify-center items-center text-sm my-6 text-gray-150">
          No Data Found
        </div>}
      {!loading && !!dataSets.allData.length && (
        <div className={`mt-5 w-full flex items-center ${isDownloadPdfRoute ? 'flex-col' : 'md:flex-row'}`}>
          <div className={`${isDownloadPdfRoute ? 'w-full' : 'w-full md:mr-6 md:w-4/6 lg:w-3/4 xl:w-4/5'}`}>
            <canvas
              id="2"
              ref={chartRef}
              className="mb-7 w-full"></canvas>
          </div>
          <div className="md:space-y-2 flex flex-col space-x-0 flex-wrap mb-7">
            {dataSets.allData.map((d) => {
              return (
                <div className=" space-x-2 flex flex-row  items-center" key={d.label}>
                  {!d.borderDash?.length && (
                    <div
                      style={{ backgroundColor: d.backgroundColor, width: '0.75rem', height: '0.75rem', minWidth: '0.75rem', maxHeight: '0.75rem' }}></div>
                  )}
                  {!!d.borderDash?.length && (
                    <div
                      className=" w-4  border-dashed "
                      style={{
                        borderWidth: d.borderWidth || '2px',
                        borderColor: d.borderColor,
                      }}></div>
                  )}
                  <div
                    className={'inline-block whitespace-nowrap text-xs md:text-sm 2xl:text-base text-gray-600 font-normal'}>
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
