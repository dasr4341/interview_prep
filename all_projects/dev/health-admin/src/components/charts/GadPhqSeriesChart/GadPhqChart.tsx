import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GadPhqChartUtility } from './lib/GadPhqChartUtility';
import './scss/_surveyDetailsChart.scoped.scss';
import {
  ChartDataInterface,
  ChartDataPayload,
  ChartLabelDataInterface,
  SurveyDetailsChartInterface,
} from './interface/GadPhqChart.Interface';
import { ChartTypes } from '../enum/ChartTypes.enum';
import { Skeleton } from '@mantine/core';

interface ChartDataSetInterface {
  all: ChartDataInterface[];
  filtered: ChartDataInterface[];
  leftAxis: {
    steps?:number | null,
    max: number;
    min: number;
  };
  rightAxis: {
    steps?:number | null,
    max: number;
    min: number;
  };
}

export default function GadPhqChart({
  chart,
  currentPoint = '',
  data,
  labels,
  loading,
  yAxisTitle,
  grid = {
    vertical: true,
    horizontal: {
      left: false,
      right: true
    }
  },
  isDownloadPdfRoute
}: {
  currentPoint?: string;
  chart: ChartTypes;
  data: ChartDataPayload;
  loading?: boolean;
    labels: ChartLabelDataInterface[];
    yAxisTitle?: {
      leftAxis?: string,
      rightAxis?: string
    }
    grid?: {
      vertical?: boolean;
      horizontal?: {
        left: boolean,
        right: boolean
      }
    };
  isDownloadPdfRoute?: boolean;
}) {
  const surveyDetailsChart = useRef<HTMLCanvasElement>(null);

  const [chartDataSets, setChartDataSets] = useState<ChartDataSetInterface>({
    all: [],
    filtered: [],
    leftAxis: {
      max: 0,
      min: 0,
    },
    rightAxis: {
      max: 0,
      min: 0,
    },
  });


  useLayoutEffect(() => {
    const chartInstance: SurveyDetailsChartInterface = {
      ctx: surveyDetailsChart.current?.getContext('2d') || null,
    };

    if (surveyDetailsChart.current?.getContext('2d') && chartDataSets) {
      const barChart = GadPhqChartUtility(
        chart,
        chartInstance,
        chartDataSets.filtered,
        currentPoint,
        labels,
        chartDataSets.leftAxis,
        chartDataSets.rightAxis,
        grid,
        yAxisTitle,
      );
      return () => {
        barChart?.destroy();
      };
    }
    // 
  }, [chartDataSets]);

  useEffect(() => {
    setChartDataSets(() => {
      return {
        all: data.data,
        filtered: data.data,
        leftAxis: data.leftAxis,
        rightAxis: data.rightAxis,
      };
    });
  }, [data]);

  return (
    <div className="flex items-center justify-center">
      {!loading && !!chartDataSets.all.length && (
        <div className={`flex items-center ${isDownloadPdfRoute ?  'flex-col w-full' : 'flex-col md:flex-row w-11/12 md:w-full'}`}>
          <div className={`${isDownloadPdfRoute ? 'w-full' : 'md:mr-6 lg:w-3/5 md:w-4/6 xl:w-3/4 2xl:w-10/12'}`}>
            <canvas
              ref={surveyDetailsChart}
              className="mb-7 chart w-full"></canvas>
          </div>
          <ul className="mb-7 md:mb-0 md:space-y-2 flex flex-col space-x-0 flex-wrap">
            {chartDataSets.all.map((el) => {
              return (
                <li
                  className="  flex flex-row items-center "
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
                    className={'inline-block whitespace-nowrap text-xs 2xl:text-base text-gray-600  font-normal'}>
                    {el.label}
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

      {(!labels.length && !chartDataSets.all.length)
        && !loading && <div className="bg-gray-100 rounded w-full p-4  flex justify-center items-center text-sm my-6 text-gray-150">
          No Data Found
        </div>}
    </div>
  );
}
