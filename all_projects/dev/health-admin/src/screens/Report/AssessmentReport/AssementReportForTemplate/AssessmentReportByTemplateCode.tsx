import AssessmentBiometricScale from '../AssessmentBiometricScale';
import useGetReportForTemplate from './useGetReportForTemplate';
import { Modal, Skeleton } from '@mantine/core';
import {
  CampaignStatsType,
  ScoreColor,
  ScoreDirection,
  TemplateCodes,
} from './assement-report-interface';
import UpArrowIcon from 'components/icons/UpArrowIcon';
import DownArrowIcon from 'components/icons/DownArrow';
import AssessmentPatientListModal from './PatientListModal/AssessmentPatientListModal';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { reportSliceActions } from 'lib/store/slice/assessment-report/assessment.slice';
import GadPhqChart from 'components/charts/GadPhqSeriesChart/GadPhqChart';
import useAssessmentTemplateCharts from '../customHooks/useAssessmentTemplateCharts';
import { ChartTypes } from 'components/charts/enum/ChartTypes.enum';
import BamChart from 'components/charts/BamSeriesChart/BamChart';
import { ChartDataPayload } from 'components/charts/GadPhqSeriesChart/interface/GadPhqChart.Interface';
import '../_assessment.scoped.scss';
import { ChartPayloadDataInterface } from 'components/charts/BamSeriesChart/interface/BamChart.interface';
import React from 'react';
import { toast } from 'react-toastify';
import { SelectedCampaign } from 'lib/store/slice/assessment-report/report.slice.interface';
import NoDataFound from 'components/NoDataFound';
import DateFormat from 'components/DateFormat';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import AssessmentStatsExcelDownloadExcel from '../Component/AssessmentStatsExcelDownloadExcel';

export default function AssessmentReportByTemplateCode() {
  const navigate = useNavigate();
  const { tableData, tableHeader, campaignsLoading, isGroup, templateCode } =
    useGetReportForTemplate();

  const selectedCampaign = useAppSelector(
    (state) => state.assessmentReport.selectedCampaign
  );
  const dispatch = useAppDispatch();

  function closeModal() {
    dispatch(reportSliceActions.setSelectedCampaign(null));
  }

  function openModal(d: SelectedCampaign) {
    if (d) {
      dispatch(reportSliceActions.setSelectedCampaign(d));
    } else {
      toast.error('NO assessment ID found!');
    }
  }

  const { loading, chartData, labels, frequencyText } = useAssessmentTemplateCharts();

  function getChartTitle() {
    if (
      (templateCode === TemplateCodes.PHQ9 ||
        templateCode === TemplateCodes.PHQ15 ||
        templateCode === TemplateCodes.GAD7) &&
      isGroup
    ) {
      return <>{templateCode} results by severity</>;
    } else if (templateCode === TemplateCodes.URICA && isGroup) {
      return <>{templateCode} result by average score</>;
    } else if (
      templateCode === TemplateCodes.BAM_IOP ||
      templateCode === TemplateCodes.BAM_R
    ) {
      return <>{templateCode} result by factors</>;
    } else if (isGroup) {
      return <>{templateCode} results by result type</>;
    } else {
      return <>{templateCode} - results by answer type</>;
    }
  }

  return (
    <div>
      <div className="border rounded-xl flex flex-col py-10 px-10 bg-white mt-6 relative">
        <AssessmentStatsExcelDownloadExcel />
        <div className="font-medium text-xsmd  text-gray-600 pb-3.5">
          {getChartTitle()}{frequencyText && ` - ${frequencyText}`}
        </div>

        <Skeleton visible={loading}>
          {templateCode &&
            (templateCode === 'PHQ-9' ||
              templateCode === 'GAD-7' ||
              templateCode === 'PHQ-15') && (
              <GadPhqChart
                yAxisTitle={{
                  leftAxis: isGroup ? 'Result' : 'Score',
                  rightAxis: isGroup ? 'Severity' : 'Questions',
                }}
                loading={loading}
                chart={templateCode.toLowerCase() as unknown as ChartTypes}
                data={chartData as ChartDataPayload}
                labels={labels}
                grid={{
                  vertical: false,
                  horizontal: {
                    left: true,
                    right: false,
                  },
                }}
              />
            )}

          {templateCode && templateCode === 'URICA' && (
            <GadPhqChart
              yAxisTitle={{
                leftAxis: isGroup ? 'Result' : 'Questions',
              }}
              loading={loading}
              chart={templateCode.toLowerCase() as unknown as ChartTypes}
              data={chartData as ChartDataPayload}
              labels={labels}
              grid={{
                vertical: false,
                horizontal: {
                  left: true,
                  right: false,
                },
              }}
            />
          )}

          {templateCode &&
            (templateCode === 'BAM-R' || templateCode === 'BAM-IOP') && (
              <BamChart
                data={
                  {
                    ...chartData,
                    labels,
                  } as ChartPayloadDataInterface
                }
                loading={loading}
              chart={templateCode.toLowerCase() as unknown as ChartTypes}
              chartDirection={{
                  leftAxis: 'line',
                  rightAxis: 'bar',
              }}
              />
            )}
        </Skeleton>
      </div>

      {/* Campaign Summary  */}

      <Skeleton
        visible={campaignsLoading}
        className="mt-10 mb-5">
        <div className="mb-5 mt-5 overflow-x-auto">
          <table className={`w-full ${tableData.length > 0 && 'min-w-900'}`}>
            <tbody>
              <tr className="bg-gray-50 header-table row-header">
                {tableData.length > 0 &&
                  tableHeader?.map((col, colIndex) => {
                    return (
                      <th key={col}
                        className={`whitespace-nowrap px-3 row-header font-bold md:text-more text-gray-900 
                      ${colIndex > 0 ? 'text-center' : 'text-left'} 
                      ${colIndex === 0 ? 'pl-5' : ''} `}
                        style={{ width: `${col.length + 4}%` }}>
                        {col}
                      </th>
                    );
                  })}
                <th></th>
              </tr>

              {tableData.length > 0 &&
                tableData.map((row) => (
                  <tr key={row.id}>
                    {row.data.map((col, colIndex) => (
                      <td
                        key={col.id}
                        className="row-element"
                        width={colIndex === 0 ? 250 : ''}>
                        {colIndex === 0 && (
                          <div>
                            <div
                              className="font-bold md:text-base cursor-pointer text-pt-blue-300 underline leading-5 whitespace-nowrap"
                              onClick={() => {
                                if (isGroup) {
                                  openModal({
                                    campaignId: String(col.assessmentNumber),
                                    templateCode: String(templateCode),
                                    campaignName: String(col.value),
                                    campaignType: CampaignStatsType.COMPLETED
                                  });
                                } else {
                                  if (row.patientId && row.assessmentId) {
                                    navigate(
                                      routes.patientSurvey.submittedSurvey.build(
                                        row.patientId,
                                        row.assessmentId
                                      )
                                    );
                                  }
                                }
                              }}>
                              {col.value}
                            </div>
                            {col.info && (
                              <div className="font-medium text-xss text-gray-150 mt-1">
                                Date:{' '}
                                <DateFormat
                                  date={col.info}
                                  onlyDate={true}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {colIndex > 0 && (
                          <div className="text-center">
                            {typeof col.biometric === 'number' && (
                              <AssessmentBiometricScale
                                biometricScore={Number(col.biometric)}
                              />
                            )}

                            {col.percent?.value && (
                              <div className="flex flex-row items-center gap-x-2 justify-center">
                                {!isGroup && col.value && (
                                  <div className="font-bold md:text-xmd whitespace-nowrap">
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
                                  } font-bold md:text-xsmd whitespace-nowrap`}>
                                  {`${Math.round(col.percent.value)}%`}
                                </div>
                              </div>
                            )}

                            {col.value && !col.percent && (
                              <div
                                className={`md:text-xsmd whitespace-nowrap ${
                                  !isNaN(Number(col.value))
                                    ? 'font-extrabold'
                                    : ''
                                }`}>
                                {col.value}
                              </div>
                            )}

                            {col.info && (
                              <div className="font-medium text-xss text-gray-600 mt-2">
                                {col.info}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Skeleton>

      {tableData.length === 0 && !campaignsLoading && (
        <div className=" h-max flex justify-center items-center">
          <NoDataFound
            type="NODATA"
            heading="No campaign list yet"
          />
        </div>
      )}

      <Modal
        opened={Boolean(selectedCampaign)}
        onClose={closeModal}
        size="90%"
        padding={0}
        zIndex={10000}
        withCloseButton={false}>
        <AssessmentPatientListModal
          onClose={closeModal}
          selectedAssessmentType={true}
        />
      </Modal>
    </div>
  );
}
