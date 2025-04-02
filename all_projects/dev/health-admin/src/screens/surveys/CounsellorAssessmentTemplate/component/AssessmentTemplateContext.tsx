import React, { ReactNode, createContext, useMemo, useState } from 'react';

interface SendPatientData {
  sendNow: boolean;
  setSendNow: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleAt: string;
  setScheduleAt: React.Dispatch<React.SetStateAction<string>>;
  campaignAssessmentSignature: boolean;
  setCampaignAssessmentSignature: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultFormContextData: SendPatientData = {
  sendNow: false,
  scheduleAt: '',
  campaignAssessmentSignature: false,
  setSendNow: () => {/**/},
  setScheduleAt: () => {/**/},
  setCampaignAssessmentSignature: () => {/**/},
};

export const AssessmentTemplateContext = createContext<SendPatientData>(
  defaultFormContextData
);

export default function SendPatientContextForm({
  children,
}: {
  children: ReactNode;
}) {
  const [sendNowData, setSendNowData] = useState(false);
  const [selectDate, setSelectDate] = useState<string>('');
  const [assessmentSignature, setAssessmentSignature] = useState(false);

  return (
    <AssessmentTemplateContext.Provider
      value={useMemo(() => {
        return {
          sendNow: sendNowData,
          setSendNow: setSendNowData,
          scheduleAt: selectDate,
          setScheduleAt: setSelectDate,
          campaignAssessmentSignature: assessmentSignature,
          setCampaignAssessmentSignature: setAssessmentSignature,
        };
      }, [sendNowData, selectDate, assessmentSignature])}>
      {children}
    </AssessmentTemplateContext.Provider>
  );
}
