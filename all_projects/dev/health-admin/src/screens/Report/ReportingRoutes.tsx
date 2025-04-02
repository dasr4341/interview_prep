import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';
import { routes } from 'routes';
import PoorSurveyContext from './components/PoorSurveyScores/PoorSuvreyContext';

const ReportPage = lazyWithPreload(() => import('screens/Report/ReportPageLayout'));
const AnomaliesReportedPage = lazyWithPreload(() => import('screens/Report/components/AnomaliesReported/AnomaliesReportedPage'));
const PoorSurveyScoresPage = lazyWithPreload(() => import('screens/Report/components/PoorSurveyScores/PoorSurveyScoresPage'));
const SelfHarmReportPage = lazyWithPreload(() => import('screens/Report/components/SelfHarmReport/SelfHarmReportPage'));
const HelpLineContactedPage = lazyWithPreload(() => import('screens/Report/components/HelpLineContacted/HelpLineContactedPage'));
const GeoFencesBreachedPage = lazyWithPreload(() => import('screens/Report/components/GeoFencesBeached/GeoFencesBreachedPage'));

export const reportRoutesPreload = [
  ReportPage,
  AnomaliesReportedPage,
  PoorSurveyScoresPage,
  SelfHarmReportPage,
  HelpLineContactedPage,
  GeoFencesBreachedPage
];

const PoorSurveyContextLayout = () => {
  return (
    <PoorSurveyContext>
      <PoorSurveyScoresPage />
    </PoorSurveyContext>
  );
};

export const ReportingRoutes = [
  <Route key="Reporting">
    <Route element={<ReportPage />} path={routes.report.reportPage.match}>
      
      <Route element={<AnomaliesReportedPage />} path={routes.report.anomaliesReported.match} >
          <Route path=":patientId" element={<AnomaliesReportedPage/>}/>
      </Route>
     
      <Route element={<PoorSurveyContextLayout />} path={routes.report.poorSurveyScores.match} >
          <Route path=":patientId" element={<PoorSurveyContextLayout/>}/>
      </Route>
    
      <Route element={<SelfHarmReportPage />} path={routes.report.selfHarmReport.match} >
          <Route path=":patientId" element={<SelfHarmReportPage/>}/> 
      </Route>
      <Route element={<HelpLineContactedPage />} path={routes.report.helpLineContacted.match} >
          <Route path=":patientId" element={<HelpLineContactedPage/>}/> 
      </Route>
      <Route element={<GeoFencesBreachedPage />} path={routes.report.geoFencesBreached.match} >
           <Route path=":patientId" element={<GeoFencesBreachedPage/>}/> 
      </Route>
    </Route>
  </Route>,
];
