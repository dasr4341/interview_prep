import { useEffect, useState } from 'react';

import BarChartComponent from 'components/charts/barChart/barChart';
import ReportBarChartFilters from './ReportBarChartFilters';
import { BarChartDataInterface, BarChartInfoDetailsInterface } from 'screens/Report/interface/barChartData.interface';
import { Skeleton } from '@mantine/core';


export function transformChartYMax(yMax: number, isYAsixNegative?: boolean) {
  if (yMax <= 4) {
    return yMax + 1;
  }

  const buffer = 10;
  let multipleOfTen = 0;
   
  // concept is to transform yMax to multiple of 10
  //   formula example ->
  // let, YMax = 64
  //## (YMax % 10) = remainder
  //  -- 64 % 10 = 4
  //## (10 - (YMax % 10) = value needed to add into YMax
  //  -- 10 - 4 = 6
  //## YMax + (10 - (YMax % 10))
  //  -- 64 + 6 = 70
 
  if (yMax % 10 === 0) {
    multipleOfTen = yMax;
  } else {
    multipleOfTen = yMax + (10 - (yMax % 10));
  }

  if (multipleOfTen < 40) {
    return multipleOfTen ;
  }

  let multiplier = 5;
  if (multipleOfTen > 1) {
    multiplier = multipleOfTen < 50 ? 25 : 50;
  }
 
  if (multipleOfTen < multiplier) {
    return multipleOfTen > yMax ? multipleOfTen :  multipleOfTen + buffer ;
  }
   
  const result = (multipleOfTen + (multiplier - (multipleOfTen % multiplier)));
  
  if (isYAsixNegative) {
    if (yMax < (result - multiplier) && yMax > 0 ) {
      return 0;
    } else {
      return -(result - multiplier);
    }
  }
  return  result;
}

export function getStepBasedOnYMax(yMax: number) {
  if (!yMax) {
    return 1;
  }
  if (yMax <= 5) {
    return 1;
  }
  if (yMax <= 30) {
    return yMax / 2;
  }
  
  if (yMax <= 100) {
    return 25;
  } 
  if (yMax <= 1000) {
    return 50;
  }
  return 100;
}

function getRequiredDataSets(barChartData: BarChartDataInterface[]) {
 return  barChartData.map((d, i) => {
    return {
      ...d,
      backgroundColor: d.color,
      borderColor: d.color,
      key: i + 1,
      toggle: 'off',
    };
  });
}
function getBarOptions(max: number) {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: { 
        display: false,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#8585A1',
          font: {
            size: () => {
              if (window.innerWidth < 360) {
                return 4;
              }
              if (window.innerWidth >= 580) {
                return 12;
              }
              return 6;
            },
            weight: '500',
          },
        },
      },
      y: {
        max,
        min: 0,
        ticks: {
          stepSize: getStepBasedOnYMax(max),
          color: '#57576A',
          font: {
            size: () => {
              if (window.innerWidth < 360) {
                return 4;
              }
              if (window.innerWidth >= 580) {
                return 11;
              }
              return 6;
            },
            weight: '700',
          },
        },
      },
    },
  };
}



export default function ReportBarChart({
  yAxisMax: yAxisMaxValue,
  title: headerTitle,
  data: barChartData,
  labels: barChartLabels,
  loading,
  infoDetails
}: {
  yAxisMax: number;
  title?: string;
  data: BarChartDataInterface[];
  labels: string[];
  loading?: boolean;
  infoDetails?: BarChartInfoDetailsInterface  | null
  }) {
  
  
  const [barData, setBarData] = useState<{
    barChartLabels: string[];
    barOptions: ReturnType<typeof getBarOptions> | null;
    barChartDatasets: ReturnType<typeof getRequiredDataSets>;
    allBarChartDatasets: ReturnType<typeof getRequiredDataSets>;
  }>({
    barChartLabels: [],
    barOptions: null,
    barChartDatasets: [],
    allBarChartDatasets: [],
  });


  useEffect(() => {
    setBarData(() => {
      return {
        barOptions: getBarOptions(transformChartYMax(yAxisMaxValue) || 10),
        barChartLabels: barChartLabels,
        barChartDatasets: getRequiredDataSets(barChartData),
        allBarChartDatasets: getRequiredDataSets(barChartData),
      };
    });
  }, [barChartData, barChartLabels, headerTitle, loading, yAxisMaxValue]);

  return (
    <div className="flex flex-col">
      {loading && <Skeleton height={256} my={16} />}

      {!loading && (
        <div className="py-6 px-3 md:px-5 border-b border-gray-350 relative bg-white border rounded-2xl h-3/4 ">
          <div className='flex justify-between pb-3.5  px-2'>
          <div className="font-medium text-xsmd capitalize text-gray-600 ">{headerTitle}</div>
           {infoDetails && <div className=' flex flex-col items-center'>
              <div className=" font-extrabold text-smd capitalize text-black">{infoDetails.header}</div>
              <div className='font-medium w-36 text-center mt-1 text-xss text-gray-600'>{infoDetails.title}</div>
          </div>}
        </div>

          <div className="block md:flex justify-between flex-col md:flex-row w-11/12 md:w-full items-center">
            <BarChartComponent
              xAxisLabels={barData.barChartLabels}
              datasets={barData.barChartDatasets}
              options={barData.barOptions}
            />
            <ReportBarChartFilters
              allBarChartDatasets={barData.allBarChartDatasets}
            />
          </div>
        </div>
      )}
    </div>
  );
}
