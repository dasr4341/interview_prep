import { useContext, useEffect, useState } from 'react';

import DoughnutChartComponent from 'components/charts/doughnutChart/doughnutChart';
import ReportDoughnutChartFilter from './ReportDoughnutChartFilter';
import {
  ChartDataInterface,
  DoughnutChartInfoDetailsInterface,
} from 'screens/Report/interface/doughnutChartData.interface';
import { FilterStyleEnum } from 'interface/charts/dougnutChart.interface';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { PoorSurveyDetailContext } from '../PoorSurveyScores/PoorSuvreyContext';
import { customTooltipHandler } from './CustomChartTooltip';
import { Skeleton } from '@mantine/core';

// ----------------------- LIB ---------------------------
export function getDoughnutLabel(value: number, label: string) {
  return [
    {
      text: value,
      font: {
        size: '35',
        family: 'SF Pro Display, sans-serif',
        weight: '800',
      },
      color: '#000000',
    },
    {
      text: label,
      font: {
        size: '12',
        family: 'SF Pro Text, sans-serif',
        weight: '500',
      },
      color: '#8585A1',
    },
  ];
}
// ----------------------- LIB ---------------------------

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

export function getDoughnutOptions(labels: ReturnType<typeof getDoughnutLabel>) {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      doughnutlabel: {
        paddingPercentage: 5,
        labels,
      },
      tooltip: {
        enabled: false,
        external: customTooltipHandler,
      },
    },
    cutout: '90%',
  };
}
// ----------------------- HELPER -----------------------------

export default function ReportDoughnutChart({
  headerTitle,
  chartData,
  initialLabelData,
  loading,
  totalPatient, // Not needed for now
  infoDetails,
  filterStyle,
  labelClickable
}: {
  headerTitle?: string;
  chartData: ChartDataInterface[];
  initialLabelData: {
    label: string;
    value: number;
  };
  loading?: boolean;
  totalPatient?: number;
  infoDetails?: DoughnutChartInfoDetailsInterface | null;
  filterStyle?: FilterStyleEnum;
  labelClickable?: boolean
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
  const [clickedOption, setClickedOption] = useState(false);
  const location = useLocation();
  const poorSurveyLocation = location.pathname.includes(routes.report.poorSurveyScores.match);
  const { updateTemplateDetail, toggleReportState, updateToggleReport } = useContext(PoorSurveyDetailContext);

  const filterDoughnutChart = (keyNumber: number, index: number) => {
    /*eslint-disable*/
    const dataSet = doughnutData.doughnutChartDatasets[index];
    const chartDataSets = doughnutData.doughnutChartDatasets[index].dataWithKeys;
    let updatedData: any = [];
    let doughnutChatLbl: any = [];

    const foundIndex = chartDataSets.findIndex((each) => each.key === keyNumber);
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
      return { ...prevState,doughnutChartLabels: doughnutChatLbl };
    });
    /*eslint-disable*/

  };

  function clearSelection() {
    updateTemplateDetail('');
    updateToggleReport(false);
    setDoughnutFilterKey(0);
    setClickedOption(true);
  }

  useEffect(() => {
    setDoughnutData(() => {
      return {
        doughnutOptions: getDoughnutOptions(getDoughnutLabel(initialLabelData.value, initialLabelData.label)),
        doughnutChartLabels: chartData?.map((el) => {
          return el?.label;
        }),
        doughnutChartDatasets: getDoughnutChartDatasets(chartData),
      };
    });
  }, [headerTitle, chartData, initialLabelData, loading]);

  useEffect(() => {
    clearSelection();
  }, [location.pathname]);

  useEffect(() => {
    const selectedAnomaly = chartData.find((chartD) => chartD.key === doughnutFilterKey);

    const label = selectedAnomaly?.label || initialLabelData.label;
    const value = selectedAnomaly?.value || initialLabelData.value;

    setDoughnutData((d) => {
      return {
        ...d,
        doughnutOptions: getDoughnutOptions(getDoughnutLabel(value, label)),
      };
    });
  }, [doughnutFilterKey]);

  return (
    <div className="flex flex-col px-13">
      {loading && (
        <Skeleton
          height={256}
          my={32} 
        />
      )}
      {Boolean(doughnutData.doughnutChartDatasets.length) && !loading && (
        <div
          className={`${
            toggleReportState ? 'border border-b-0 rounded-t-xl' : 'border rounded-xl '
          }flex flex-col py-10 md:px-10 px-5 relative bg-white mt-6 h-3/4`}>
          <div className="flex justify-between">
            <div className="font-medium text-xsmd capitalize text-gray-600 pb-3.5 px-2">{headerTitle}</div>
            {Boolean(poorSurveyLocation && doughnutFilterKey) && (
              <div className=" text-pt-secondary text-xss font-medium">
                <button onClick={() => clearSelection()}>Clear Selected</button>
              </div>
            )}
          </div>

          <div
            className={`flex flex-col md:flex-row items-center ${
              infoDetails && ' md:justify-start'
            } justify-center md:gap-14 pl-2 md:pl-0 `}>
            {infoDetails && (
              <div className=" flex flex-col items-center  md:mr-36 mb-6 md:mb-0 justify-center md:self-end">
                <div className=" font-extrabold text-smd capitalize text-black">{infoDetails.header}</div>
                <div className="font-medium w-36 text-center mt-1 text-xss text-gray-600">{infoDetails.title}</div>
              </div>
            )}

            <DoughnutChartComponent
              xAxisLabels={doughnutData.doughnutChartLabels}
              datasets={doughnutData.doughnutChartDatasets}
              options={doughnutData.doughnutOptions}
              styleClass={'md:w-1/4 w-2/4 h-1/4 mt-4 self-center'}
            />
            <ReportDoughnutChartFilter
              allDoughnutChartDatasets={doughnutData.doughnutChartDatasets}
              filterDoughnutChart={filterDoughnutChart}
              filterSelected={doughnutFilterKey}
              filterStyle={filterStyle}
              totalPatient={totalPatient}
              clickedOption={clickedOption}
              labelClickable={labelClickable}
            />
          </div>
        </div>
      )}
      {/* --------------- NO DATA UI --------------- */}
      {!doughnutData.doughnutChartDatasets.length && !loading && (
        <div className="bg-gray-100 rounded p-4 mb-12 flex justify-center items-center text-sm my-12 text-gray-150">
          No Data Found
        </div>
      )}
    </div>
  );
}
