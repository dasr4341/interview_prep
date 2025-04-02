/*  */
import { useEffect, useRef, useState } from 'react';
import useDayMonthRangeFilter from '../../customHooks/useDayMonthRangeFilter';
import { useLazyQuery, useQuery } from '@apollo/client';
import catchError from 'lib/catch-error';
import {
  AssessmentPatientsDischargeFilterTypes,
  GetAssessmentPatientListByDate,
  GetAssessmentPatientListByDateVariables,
  GetAssessmentReportSummaryCounts,
  GetAssessmentReportSummaryCountsVariables,
  PatientDischargeStatusTypes,
  ReportingDateFilter,
} from 'health-generatedTypes';
import { getAssessmentPatientListByDateQuery } from 'graphql/getAssessmentPatientListByDate.query';
import { getAssessmentReportSummaryCountsQuery } from 'graphql/getAssessmentReportSummaryCounts.query';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { SelectedPatientsType } from '../../ReportFilter/ReportFilter';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import {
  AssessmentSelectedDayMonthInterface,
  AssessmentSelectedPatients,
} from 'interface/app.slice.interface';
import { getReportFilterVariables } from '../lib/getReportFilterVariables';
import { patientDischargeStatusQuery } from 'graphql/patientDischargeStatusTypes.query';
import { SelectBox } from 'interface/SelectBox.interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';

export interface AssessmentPatientListInterface {
  id: string;
  name: string;
}

export default function useAssessmentReport({ assignDefaultValueForFilter } : { assignDefaultValueForFilter:boolean }) {
  const searchedText = useRef<string | null>(null);
  const dispatch = useAppDispatch();
  const [patientList, setPatientList] = useState<
    AssessmentPatientListInterface[]
  >([]);
  const [dischargeStatusList, setDischargeStatusList] = useState<SelectBox[]>(
    []
  );
  const location = useLocation();
  const navigate = useNavigate();

  const assessmentFilterState = useAppSelector(
    (state) => state.app.assessmentFilter
  );
  
  const { loading, options } = useDayMonthRangeFilter(assignDefaultValueForFilter ? 'assessmentFilter' : null);

  const { selectedDayMonth, selectedPatients, selectedDischargeStatusTypes } = assessmentFilterState;

  // ------------------ HELPER -------------------------
  function onSelectedPatientsChange(
    selectedPatientsData: AssessmentSelectedPatients
  ) {
    dispatch(
      appSliceActions.setAssessmentFilter({
        selectedDischargeStatusTypes,
        selectedDayMonth,
        selectedPatients: selectedPatientsData,
      })
    );
  }
  function onSelectedDayMonthChange(
    selectedDayMonthData: AssessmentSelectedDayMonthInterface | null
  ) {
    dispatch(
      appSliceActions.setAssessmentFilter({
        selectedDischargeStatusTypes,
        selectedDayMonth: selectedDayMonthData,
        selectedPatients,
      })
    );
  }
  function onDischargeStatusTypesChange(
    statusTypes: SelectBox | null
  ) {
    setTimeout(() => dispatch(
      appSliceActions.setAssessmentFilter({
        selectedDischargeStatusTypes: statusTypes,
        selectedDayMonth,
        selectedPatients,
      })
    ), 100);
  }
  // ------------------ HELPER -------------------------

  const [getPatientList, { loading: patientListLoading }] = useLazyQuery<
    GetAssessmentPatientListByDate,
    GetAssessmentPatientListByDateVariables
  >(getAssessmentPatientListByDateQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetPatientListByDate) {
        
        const patientListResponse =  d.pretaaHealthGetPatientListByDate.map((data) => {
            return {
              id: data.id,
              name: data.name,
            };
        });
        
        const patientListResponseWithAll = [
          {
            id: String(SelectedPatientsType.ALL),
            name: String(SelectedPatientsType.ALL),
          },
        ].concat(patientListResponse);
        
        setPatientList(() => patientListResponse.length === 1 ? patientListResponse : patientListResponseWithAll);

        if (d.pretaaHealthGetPatientListByDate.length === 1 && searchedText.current === null) {
          const { id, name } = d.pretaaHealthGetPatientListByDate[0];
          onSelectedPatientsChange({
            all: false,
            list: [{ id, name }]
          });
        } 
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [
    getReportSummaryCount,
    { loading: reportSummariesCountLoading, data: reportSummariesCount },
  ] = useLazyQuery<
    GetAssessmentReportSummaryCounts,
    GetAssessmentReportSummaryCountsVariables
  >(getAssessmentReportSummaryCountsQuery, {
    onError: (e) => catchError(e, true),
    onCompleted: (d) => {
      const reportSummaryTabInfo = d.pretaaHealthGetAssessmentReportSummaryCounts.map( e => e.name);
      const routeToNavigate = routes.assessmentsReport.patientsOverview.match;
      const path = location.pathname;

      const tabName = path.substring(path.lastIndexOf('/') + 1);
      
      if ((!reportSummaryTabInfo.length || !reportSummaryTabInfo.includes(tabName) ) &&  path !== routeToNavigate) {
        navigate(routeToNavigate);
      }
    }
  });

  const { loading:dischargeStatusTypesLoading } = useQuery<PatientDischargeStatusTypes>(patientDischargeStatusQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthsPatientDischargeStatusTypes) {
        const response = d.pretaaHealthsPatientDischargeStatusTypes;
        setDischargeStatusList(
          () =>
            Object.entries(response).map((data) => {
              return {
                label: String(data[1]),
                value: String(data[0]),
              };
            }) || []
        );
      }
    },
    onError: e => catchError(e, true)
  });

  function filterPatients(searchText: string) {
    searchedText.current = searchText;
    getPatientList({
      variables: {
        admittanceStatus: assessmentFilterState.selectedDischargeStatusTypes?.value as AssessmentPatientsDischargeFilterTypes,
        filterMonthNDate: assessmentFilterState.selectedDayMonth?.dayMonth
          ?.value as ReportingDateFilter,
        rangeStartDate: assessmentFilterState.selectedDayMonth?.dateRange.startDate,
        rangeEndDate: assessmentFilterState.selectedDayMonth?.dateRange.endDate,
        searchText,
      },
    });
  }


  useEffect(() => {
    const variables = {
      admittanceStatus: selectedDischargeStatusTypes?.value as AssessmentPatientsDischargeFilterTypes,
      filterMonthNDate: selectedDayMonth?.dayMonth
        ?.value as ReportingDateFilter,
      rangeStartDate:
    selectedDayMonth?.dateRange.startDate,
      rangeEndDate: selectedDayMonth?.dateRange.endDate,
    };

    if ((variables.admittanceStatus === AssessmentPatientsDischargeFilterTypes.IN_CENSUS || !!variables.filterMonthNDate)) {
      getPatientList({
        variables
      });
    }
    
    onSelectedPatientsChange(selectedPatients);
  }, [selectedDayMonth, selectedDischargeStatusTypes]);

  useEffect(() => {
    const variables = getReportFilterVariables({ filter: assessmentFilterState });
    if (!(variables.admittanceStatus === AssessmentPatientsDischargeFilterTypes.IN_CENSUS || !!variables.filterMonthNDate)) return;
     
    if ((assessmentFilterState.selectedPatients.all || assessmentFilterState.selectedPatients.list.length > 0)) {
      getReportSummaryCount({
        variables,
      });
    }
  }, [assessmentFilterState]);

  return {
    dayMonthRangeFilter: {
      loading,
      options,
    },
    patientInfo: {
      loading: patientListLoading,
      list: patientList,
      onSearch: filterPatients
    },
    reportSummaries: {
      countData:
        reportSummariesCount?.pretaaHealthGetAssessmentReportSummaryCounts ||
        null,
      loading: reportSummariesCountLoading,
    },
    dischargeStatusTypes: {
      option:dischargeStatusList,
      loading: dischargeStatusTypesLoading
    },
    onSelectedPatientsChange,
    onSelectedDayMonthChange,
    onDischargeStatusTypesChange
  };
}
