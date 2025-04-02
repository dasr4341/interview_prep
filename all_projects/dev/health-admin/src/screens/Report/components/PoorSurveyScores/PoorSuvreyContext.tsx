import { GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport } from 'health-generatedTypes';
import React, { ReactNode, createContext, useMemo, useState } from 'react';

interface PoorSurveyContextData {
  templateCode?: string;
  updateTemplateDetail: React.Dispatch<React.SetStateAction<string>>;
  templateScoreBreakDown: GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport | null;
  selectedTemplate: string | null;
  setTemplateScoreBreakDown: any;
  setSelectedTemplate: any;
  updateToggleReport: React.Dispatch<React.SetStateAction<boolean>>;
  toggleReportState: boolean
}

export const PoorSurveyDetailContext = createContext<PoorSurveyContextData>({
  templateCode: '',
  updateTemplateDetail: () => {/**/},
  templateScoreBreakDown: null,
  selectedTemplate: null,
  setTemplateScoreBreakDown: () => {/**/},
  setSelectedTemplate: () => {/**/},
  updateToggleReport: () => {/**/},
  toggleReportState: false
});

export default function PoorSurveyContext({
  children,
}: {
  children: ReactNode;
}) {
  const [poorSurveyData, setPoorSurveyData] = useState('');
  const [templateScoreBreakDown, setTemplateScoreBreakDown] =
    useState<GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport | null>(
      null
    );
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [toggleReport, setToggleReport] = useState(false);

  return (
    <PoorSurveyDetailContext.Provider
      value={useMemo(() => {
        return {
          templateCode: poorSurveyData,
          updateTemplateDetail: setPoorSurveyData,
          selectedTemplate,
          templateScoreBreakDown,
          setSelectedTemplate,
          setTemplateScoreBreakDown,
          updateToggleReport: setToggleReport,
          toggleReportState: toggleReport

        };
      }, [poorSurveyData, selectedTemplate, templateScoreBreakDown, toggleReport])}>
      {children}
    </PoorSurveyDetailContext.Provider>
  );
}
