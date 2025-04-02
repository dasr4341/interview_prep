/*  */
import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import React, { useState, useEffect, createContext, useMemo } from 'react';
import FormSubmittedRow from './components/FormSubmittedRow';
import { routes } from 'routes';
import { useNavigate, useParams } from 'react-router-dom';
import { GetMultipleCampaignSurveyList, GetMultipleCampaignSurveyListVariables, UserTypeRole } from 'health-generatedTypes';
import Select from 'react-select';
import { DropdownIndicator } from 'components/ui/SelectBox';
import { useLazyQuery } from '@apollo/client';
import catchError, { sentryErrorCatch } from 'lib/catch-error';
import { SelectBox } from 'interface/SelectBox.interface';
import { config } from 'config';
import { monthDateYearFormatter } from 'Helper/chart-helper';
import { cloneDeep, reverse } from 'lodash';
import { formatInTimeZone } from 'date-fns-tz';
import { differenceInMilliseconds } from 'date-fns';
import { SubmittedChartInterface } from 'components/charts/UricaSeriesChart/SubmittedChart.Interface';
import { getMultipleCampaignSurveyListQuery } from 'graphql/getMultipleCampaignSurveyList.query';
import useSelectedRole from 'lib/useSelectedRole';

const customStylesSelectBox = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    borderColor: '#C5C5D8',
    boxShadow: ' 0 !important',
    padding: '7px 6px',
    borderRadius: '6px',
    fontSize: '17px',
    '&:hover': {
      borderColor: '#ffcc01',
    },
  }),
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#363646',
    };
  }
};

export interface SurveyRouteData {
  userId: string;
  surveyId?: string;
  patientId?: string;
  eventId?: string;
  token?: string;
}

export const SurveyDetailsContext = createContext<{ chart: SubmittedChartInterface, token?: string | null }>(
  {
    chart: { date: [], radinessScore: [], currentPoint: '' },
    token: null,
  }
);

export default function SurveyFormSubmitted() {
  const isUserAllowed = useSelectedRole({ roles: [UserTypeRole.COUNSELLOR, UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });

  const { surveyId, userId, patientId, eventId, token } = useParams() as unknown as SurveyRouteData;
  const params: SurveyRouteData = useParams() as any;
  const [paramsData, setParamsData] = useState<SurveyRouteData | null>(null);
  const [multipleCampaignDate, setMultipleCampaignDate] = useState<SelectBox[]>([]);
  const [currentCampaignDate, setCurrentCampaignDate] = useState<SelectBox[]>([]);
  const navigate = useNavigate();
  const [submittedChartData, setSubmittedChartData] = useState<SubmittedChartInterface>({ date: [], radinessScore: [], currentPoint: '' });
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [getMultipleCampaignListDate] = useLazyQuery<
  GetMultipleCampaignSurveyList,
  GetMultipleCampaignSurveyListVariables
  >(getMultipleCampaignSurveyListQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetMultipleCampaignSurveyList) {
        const date = d.pretaaHealthGetMultipleCampaignSurveyList.map((e) => {
          return { value: String(e.surveyAssignmentId), label: formatInTimeZone(new Date(e.date as string), timeZone, config.dateFormat) };
        });

        const selected = date.find(e => e.value === surveyId) as SelectBox;
        if (selected) {
          setCurrentCampaignDate([selected]);
        }
        setMultipleCampaignDate(date);

        const res = cloneDeep(d.pretaaHealthGetMultipleCampaignSurveyList);
        
        const chartLabels = res.sort((a, b) => {
          if (a.date && b.date) {
            const date1 = new Date(a.date);
            const date2 = new Date(b.date);
            return differenceInMilliseconds(date1, date2);
          }
          return 1;
        }).map((e) => {
          return {
            value: String(e.surveyAssignmentId),
            label: formatInTimeZone(new Date(monthDateYearFormatter(e.date)), timeZone, config.monthDateFormat)
          };
        });

        const chartDataSets = res.map((el) => el.radinessScore);
        setSubmittedChartData({
          date: chartLabels,
          radinessScore: reverse(chartDataSets),
          currentPoint: selected.value
        });
      }
    },
    onError: (e) => {
      catchError(e, true);
      sentryErrorCatch(e);
    }
  });

  useEffect(() => {
    if ((isUserAllowed || token) && surveyId) {
      getMultipleCampaignListDate({
        variables: {
          campaignSurveyId: surveyId
        }
      });
    }

  }, [isUserAllowed, surveyId]);

  useEffect(() => {
    setParamsData({
      userId: String(userId ? userId : patientId),
      surveyId: surveyId
    });
    if (token) {
      localStorage.setItem(config.storage.token, token);
    }
  }, [surveyId, userId, patientId, token ]);

  return (
    <>
      {!token && (
        <ContentHeader>
          <div className="flex py-4 md:flex-row flex-col md:items-center justify-start items-start md:justify-between">
            <h1 className="h1 text-primary font-bold text-md lg:text-lg mb-2 md:mb-0">Assessment details</h1>
            {multipleCampaignDate.length > 0 && (
              <div>
                <Select
                  className=" w-72 bg-white rounded-xl app-react-select"
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator,
                  }}
                  value={currentCampaignDate}
                  styles={customStylesSelectBox}
                  options={multipleCampaignDate}
                  onChange={(e) => {
                    if (params.eventId && params.patientId) {
                      navigate(routes.eventSurveyDetailsPage.build(String(e?.value), params.patientId, params.eventId));
                    } else if (params.patientId) {
                      navigate(routes.patientSurvey.submittedSurvey.build(params.patientId, String(e?.value)));
                    }
                  }}
                />
              </div>
            )}
          </div>
        </ContentHeader>
      )}

      <ContentFrame className={`h-screen ${token && 'bg-white'}`}>
        <React.Fragment>
          <SurveyDetailsContext.Provider value={useMemo(() => {
            return { chart: submittedChartData, token,  };
            }, [submittedChartData])}>
            <FormSubmittedRow
              timeZoneUpdater={setTimeZone}
              surveyId={String(surveyId)}
              userId={paramsData?.userId}
              eventId={eventId ? String(eventId) : ''}
              token={token}
            />
          </SurveyDetailsContext.Provider>
        </React.Fragment>
        <br />
      </ContentFrame>
    </>
  );
}