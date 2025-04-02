import { useEffect, useState } from 'react';

import DoughnutChartComponent from 'components/charts/doughnutChart/doughnutChart';
import {
  ChartDataInterface,
} from 'screens/Report/interface/doughnutChartData.interface';
import { FilterStyleEnum } from 'interface/charts/dougnutChart.interface';
import ReportChartDetailsFilter from './ReportChartDetailsFilter';
import { getDoughnutLabel, getDoughnutOptions } from './ReportDoughnutChart';
import { Skeleton } from '@mantine/core';

// ----------------------- HELPER -----------------------------
function getDoughnutChartDatasets(chartData: ChartDataInterface[]) {
  return [
    {
      label: 'Anomaly types',
      data: chartData?.map((el) => {
        return el?.value;
      }),
      backgroundColor: chartData?.map((el) => {
        return el?.background;
      }),
      borderColor: chartData?.map((el) => {
        return el?.background;
      }),
      borderWidth: 1,
      id: 1,
      dataWithKeys: chartData,
    },
  ];
}
// ----------------------- HELPER -----------------------------

export default function ReportDoughnutChartDetails({
  headerTitle,
  chartData,
  initialDetailsLabel,
  filterStyle,
  templateTitle,
  surveyDetailsLoading
}: {
  headerTitle?: string;
  chartData: ChartDataInterface[];
  initialDetailsLabel: {
    label: string;
    value: number;
  };
  filterStyle?: FilterStyleEnum;
  templateTitle?: string,
  surveyDetailsLoading?: boolean
}) {
  const [doughnutData, setDoughnutData] = useState<{
    doughnutChartLabels: string[];
    doughnutOptions: ReturnType<typeof getDoughnutOptions> | null;
    doughnutChartDatasets: ReturnType<typeof getDoughnutChartDatasets>;
  }>({
    doughnutChartLabels: [],
    doughnutOptions: null,
    doughnutChartDatasets: [],
  });
  const [doughnutFilterKey, setDoughnutFilterKey] = useState<number>(0);

  const filterDoughnutChart = (keyNumber: number, index: number) => {
    /*eslint-disable*/
    const dataSet = doughnutData.doughnutChartDatasets[index];
    const chartDataSets =
      doughnutData.doughnutChartDatasets[index].dataWithKeys;
    let updatedData: any = [];
    let doughnutChatLbl: any = [];

    const foundIndex = chartDataSets.findIndex(
      (each) => each.key === keyNumber
    );
    let filteredData = chartDataSets[foundIndex];

    if (keyNumber === doughnutFilterKey) {
      if (chartDataSets[foundIndex].flag === 'off') {
        dataSet.data = [filteredData.value];
        dataSet.backgroundColor = [filteredData.background];
        dataSet.borderColor = [filteredData.background];
        doughnutChatLbl = [filteredData.label];
        chartDataSets[foundIndex].flag = 'on';
        updatedData.push(dataSet);
        setDoughnutFilterKey(keyNumber);
      } else {
        chartDataSets[foundIndex].flag = 'off';
        dataSet.dataWithKeys = chartDataSets;
        dataSet.data = chartDataSets.map((el) => {
          return el.value;
        });
        dataSet.backgroundColor = chartDataSets.map((el) => {
          return el.background;
        });
        dataSet.borderColor = chartDataSets.map((el) => {
          return el.background;
        });
        doughnutChatLbl = chartDataSets.map((el) => {
          return el.label;
        });
        updatedData.push(dataSet);
        setDoughnutFilterKey(0);
      }
    } else {
      dataSet.data = [filteredData.value];
      dataSet.backgroundColor = [filteredData.background];
      dataSet.borderColor = [filteredData.background];
      doughnutChatLbl = [filteredData.label];
      chartDataSets[foundIndex].flag = 'on';
      dataSet.dataWithKeys = chartDataSets;
      updatedData.push(dataSet);
      setDoughnutFilterKey(keyNumber);
    }

    setDoughnutData((prevState: any) => {
      // Object.assign would also work
      return {
        ...prevState,
        doughnutChartDatasets: updatedData,
        doughnutChartLabels: doughnutChatLbl,
      };
    });
    /*eslint-disable*/
  };

  useEffect(() => {
    setDoughnutData(() => {
      return {
        doughnutOptions: getDoughnutOptions(
          getDoughnutLabel(initialDetailsLabel.value, initialDetailsLabel.label)
        ),
        doughnutChartLabels: chartData?.map((el) => {
          return el?.label;
        }),
        doughnutChartDatasets: getDoughnutChartDatasets(chartData),
      };
    });
  }, [headerTitle,
    chartData,
    initialDetailsLabel,
    filterStyle,
    templateTitle,
    surveyDetailsLoading]);

  useEffect(() => {
    const selectedAnomaly = chartData?.find(
      (chartD) => chartD.key === doughnutFilterKey
    );

    const label = selectedAnomaly?.label || initialDetailsLabel.label;
    const value = selectedAnomaly?.value || initialDetailsLabel.value;

    setDoughnutData((d) => {
      return {
        ...d,
        doughnutOptions: getDoughnutOptions(getDoughnutLabel(value, label)),
      };
    });
  }, [doughnutFilterKey]);


  return (
    <div className='px-10 bg-white border border-t-0 rounded-b-xl'>
      <div className="border border-gray-300  " />
      <div className="flex flex-col ">
        {surveyDetailsLoading && <Skeleton height={256} my={32} />}
        {!surveyDetailsLoading && !!initialDetailsLabel.value && (
          <div className="flex flex-col py-6  relative bg-white mb-8 h-3/4 ">
            <div className="font-medium text-xsmd capitalize text-gray-600 pb-3.5 px-2">
              {headerTitle}
            </div>
            <div
              className={`flex flex-col md:flex-row items-center  md:gap-10 pl-8`}>
              <DoughnutChartComponent
                xAxisLabels={doughnutData.doughnutChartLabels}
                datasets={doughnutData.doughnutChartDatasets}
                options={doughnutData.doughnutOptions}
                styleClass={'md:w-1/4 w-2/4 h-1/4 mt-4 self-center'}
              />
              <ReportChartDetailsFilter
                allDoughnutChartDatasets={doughnutData.doughnutChartDatasets}
                filterDoughnutChart={filterDoughnutChart}
                filterSelected={doughnutFilterKey}
                filterStyle={filterStyle}
                templateTitle={templateTitle}
              />
            </div>
          </div>
        )}

        {!initialDetailsLabel.value && !surveyDetailsLoading && (
          <div className="bg-gray-100 rounded p-4 mb-12 flex justify-center items-center text-sm my-12 text-gray-150">
            No Data Found
          </div>
        )}
      </div>
    </div>
  );
}
