import React from 'react';
import { Skeleton } from '@mantine/core';

import '../_assessment.scoped.scss';
import useGetPatientOverviewTemplate from './useGetPatientOverviewTemplate';
import {
  ScoreColor,
  ScoreDirection,
  TemplateCodes,
} from '../AssementReportForTemplate/assement-report-interface';
import UpArrowIcon from 'components/icons/UpArrowIcon';
import DownArrowIcon from 'components/icons/DownArrow';
import BiometricSection from './BiometricSection';
import usePatientOverViewGroupChart from '../customHooks/usePatientOverViewGroupChart';
import StackedGroupChart from 'components/charts/StackedGroupSeriesChart/StackedGroupChart';
import NoDataFound from 'components/NoDataFound';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function PatientOverView() {
  // patient overview
  const { tableData, patientOverviewLoading, isGroup } =
    useGetPatientOverviewTemplate();
  
  const { loading, chartDataSet } = usePatientOverViewGroupChart();
  
  return (
    <>
      <BiometricSection />
      {/* chart section */}
      <div className="border rounded-xl flex flex-col py-10 px-10  relative bg-white mt-8">
        <div className=' font-medium text-xsmd text-gray-600 mb-5'>{isGroup ? 'Percentage of patient assessments by type' : 'Assessments by type'}</div>
        <StackedGroupChart loading={loading} labels={chartDataSet?.labels} yAxisSteps={chartDataSet.steps} dataSet={chartDataSet.data} yMax={chartDataSet.yMax} />
      </div>

      {/* for patient overview list */}
      <Skeleton
        visible={patientOverviewLoading}
        className="mb-5 mt-6">
        <div className="mt-6 mb-5">
          
            <div className="font-medium text-xsmd text-gray-600 pb-4">
              {isGroup
                ? 'Performance from admission to discharge'
                : 'Performance'}
            </div>
          
          <div className=' overflow-x-scroll'>
            <table className={`w-full ${tableData.length > 0 && 'min-w-900'}`}>
              <tbody>
                {tableData.length > 0 &&
                  tableData.map((row) => (
                    <tr key={row.id}>
                      {row.data.map((col, colIndex) => (
                        <React.Fragment key={col.id}>
                          {colIndex === 0 && (
                            <td
                              className="row-element"
                              width={250}>
                              <Link className="font-bold text-base cursor-pointer text-pt-blue-300 underline"
                              to={routes.assessmentsReport.assessmentReportByTemplateCode.build({ templateCode: col.value as unknown as TemplateCodes })}>
                                {col.value}
                              </Link>
                            </td>
                          )}

                          {colIndex > 0 && (
                            <td className="row-element">
                              {col.percent?.value && (
                                <div className="flex flex-row items-center gap-x-2 mt-4">
                                  {!isGroup && col.value && (
                                    <div className="font-bold text-xmd">
                                      {col.value}
                                    </div>
                                  )}

                                  {col.percent.direction === ScoreDirection.up ? (
                                    <UpArrowIcon
                                      className={`${
                                        (col.percent.color === ScoreColor.green)
                                          ? 'text-green'
                                          : 'text-red-600'
                                      }`}
                                    />
                                  ) : (
                                    <DownArrowIcon
                                      className={`${
                                        (col.percent.color === ScoreColor.green)
                                          ? 'text-green'
                                          : 'text-red-600'
                                      }`}
                                    />
                                  )}

                                  <div
                                    className={`${
                                      (col.percent.color === ScoreColor.green)
                                        ? 'text-green'
                                        : 'text-red-600'
                                    } font-bold md:text-xsmd whitespace-nowrap`}>{`${Math.round(
                                    col.percent.value
                                  )}%`}</div>
                                </div>
                              )}

                              {col.info && (
                                <div className="font-medium text-xss text-gray-150 mt-1.5">
                                  {col.info}
                                </div>
                              )}
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      </Skeleton>

      {tableData.length === 0 && !patientOverviewLoading && (
        <div className=" h-max flex justify-center items-center ">
          <NoDataFound
            type="NODATA"
            heading="No summary available"
          />
        </div>
      )}
    </>
  );
}
