import { ContentHeader } from 'components/ContentHeader';
import SelectWithDate from 'components/filters/SelectWithDate/SelectWithDate';
import { SelectBox } from 'interface/SelectBox.interface';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import AssessmentIcon from '../../../assets/images/assessmentIcon.svg';
import './_assessment.scoped.scss';
import { AssessmentPatientsDischargeFilterTypes, ReportingDateFilter } from 'health-generatedTypes';
import useAssessmentReport from './customHooks/useAssessmentReport';
import AssessmentPatientFilter from './Component/patientFilter/AssessmentPatientFilter';
import TabSkeletonLoading from '../skeletonLoading/TabSkeletonLoading';
import React, {useEffect, useState} from 'react';
import { config } from 'config';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import AppDropDown from 'components/themeDropDown/appDropdown/AppDropDown';
import { useDischargeDropDownPlaceholder } from './helper/DischargeDropDownPlaceholderProvider';
import { range } from 'lodash';
import { appSliceActions } from 'lib/store/slice/app/app.slice';

export default function AssessmentReportLayout() {
  const { selectedDayMonth, selectedPatients, selectedDischargeStatusTypes } =
    useAppSelector((state) => state.app.assessmentFilter);
  const placeholder = useDischargeDropDownPlaceholder().error;
  
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [lastVisitedUrl, setLastVisitedUrl] = useState<null | string>(null);

  const assessmentFilterState = useAppSelector(
    (state) => state.app.assessmentFilter
  );

    
  const {
    dayMonthRangeFilter,
    patientInfo,
    reportSummaries,
    dischargeStatusTypes,
    onSelectedPatientsChange,
    onSelectedDayMonthChange,
    onDischargeStatusTypesChange,
  } = useAssessmentReport({ assignDefaultValueForFilter: selectedDischargeStatusTypes?.value !== AssessmentPatientsDischargeFilterTypes.IN_CENSUS });

  useEffect(() => {
    if (selectedDischargeStatusTypes?.value === AssessmentPatientsDischargeFilterTypes.IN_CENSUS) {
      onSelectedDayMonthChange(null);
    }
  }, [selectedDischargeStatusTypes]);

  useEffect(() => {
    if (!lastVisitedUrl && !assessmentFilterState.selectedPatients.all && !assessmentFilterState.selectedPatients.list.length) {
      dispatch(appSliceActions.setAssessmentFilter({
        ...assessmentFilterState,
        selectedPatients: {
          list: [],
          all: true
        }
      }));
    } 
    setLastVisitedUrl(location.pathname);
  }, [location.pathname]);

  return (
      <>
      <ContentHeader
        title={`Reporting:  Assessments 
          ${
            selectedDayMonth?.dayMonth?.value === ReportingDateFilter.CUSTOM
              ? `for ${format(
                  new Date(String(selectedDayMonth.dateRange.startDate)),
                  config.dateFormat
                )} - 
          ${format(
            new Date(String(selectedDayMonth.dateRange.endDate)),
            config.dateFormat
          )}`
              : ''
          }`}
        className="px-6 pt-8 lg:px-16 shadow-none pb-0 lg:py-0"
        disableGoBack={true}>
        <div className=" flex flex-row space-x-4 items-start md:mt-12 mb-12 md:mb-0">
          <div className=" w-full md:w-11/12 lg:w-full flex flex-col md:flex-row   md:space-x-2 flex-wrap ">
            <div className=" w-full font-medium md:w-24 md:mt-3.5 text-xsm text-gray-600 capitalize">
                Filter by:
            </div>
            <AppDropDown
              className=" mt-4 md:mt-0 relative md:w-2/12 mb-16 md:mb-0 h-10  w-full"
              options={dischargeStatusTypes.option}
              loading={false}
              onChange={onDischargeStatusTypesChange}
              value={selectedDischargeStatusTypes}
              placeholder="Select Discharge Types"
              showCheckBox={false}
              dropDownClassName='text-xs'
              searchable={false}
            />
         
            

            <SelectWithDate
              disabled={selectedDischargeStatusTypes?.value === AssessmentPatientsDischargeFilterTypes.IN_CENSUS }
                loading={dayMonthRangeFilter.loading}
                keyToShowDateRange={ReportingDateFilter.CUSTOM}
                options={dayMonthRangeFilter.options}
                defaultValue={
                  selectedDayMonth?.dayMonth || {
                    value: '',
                    label: '',
                  }
                }
                className="w-full rounded-xl mb-16 md:mt-0 md:w-3/12"
                maxDate={new Date()}
                onApply={(
                  fieldData: SelectBox,
                  startDate: Date | null,
                  endDate: Date | null
                ) => {
                  onSelectedDayMonthChange({
                    dayMonth: fieldData,
                    dateRange: {
                      startDate: startDate ? String(startDate) : null,
                      endDate: endDate ? String(endDate) : null,
                    },
                  });
                }}
              />

            <AssessmentPatientFilter
              onSearch={(searchedText) => patientInfo.onSearch(searchedText)}
              onChange={onSelectedPatientsChange}
              className={'w-full md:w-4/12 '}
              patientList={patientInfo.list}
              loading={patientInfo.loading}
              selectedPatients={selectedPatients}
              placeholder={placeholder}
            />
          </div>
        </div>
      </ContentHeader>
      <div className=" px-4 lg:px-16 bg-white pt-4 ">
        <div className="flex flex-row">
          
          <NavLink
            to={routes.assessmentsReport.patientsOverview.match}
            className={({ isActive }) =>
              `flex flex-col justify-center cursor-pointer w-32 capitalize py-8 border-r-2 last:border-r-0 px-4  ${
                isActive ? 'active' : 'nab-item'
              }`
            }>
            <div className="w-7 h-7 rounded-md flex items-center justify-center active-icon">
              <img
                src={AssessmentIcon}
                alt="icon"
                className="w-5"
              />
            </div>
            <div className="font-medium text-xss mt-2 text-gray-150">
              Patients
              <br />
              Overview
            </div>
          </NavLink>
          <div className='overflow-x-scroll w-full flex flex-row md:overflow-hidden'>
              {!reportSummaries.loading && !!reportSummaries.countData?.length
                && reportSummaries.countData.map((each) => {
                    return (
                      <NavLink
                        to={routes.assessmentsReport.assessmentReportByTemplateCode.build(
                          { templateCode: each.name }
                        )}
                        key={ each.name }
                        className={({ isActive }) =>
                          `flex flex-col  justify-center cursor-pointer capitalize py-8 break-keep border-r-2 last:border-r-0 px-4  ${
                            isActive ? 'active' : 'nab-item'
                          }  w-32`
                        }>
                        <div className="font-extrabold text-sm md:text-xmd text-gray-150">
                          {each.count
                            ? each.count
                            : 0}
                        </div>
                        <div className="font-medium w-20 md:w-full text-xss mt-3 break-keep text-gray-150">
                          {each.name}
                        </div>
                      </NavLink>
                    );
                  })
            }
             {reportSummaries.loading && (
               <React.Fragment>
               { range(0, 6).map(el => (
                <div key={el}><TabSkeletonLoading className="ml-2" /></div>
               )) }
             </React.Fragment>
             )}
          </div>
         
         
        </div>
      </div>
      <ContentFrame>
        <Outlet />
      </ContentFrame>
      </>
  );
}
