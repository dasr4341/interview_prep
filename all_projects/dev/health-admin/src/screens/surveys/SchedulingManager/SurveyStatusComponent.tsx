import React from 'react';
import { ICellRendererParams } from '@ag-grid-community/core';
import {
} from './CampaignStatusHelpers';
import { Campaign } from './SchedulingCamapaign/ScheduleManagerDetailsHelper';

interface CustomScheduleManagerDetail extends ICellRendererParams {
  data: Campaign;
}
    

export default function SurveyStatusComponent(props: CustomScheduleManagerDetail) {
  const status:  {
    name: string,
    tooltip: string,
    styleClass: string,
  } = props.data.statusEl || {} as any;

  return (
    <div title={status.tooltip}>
      <div className="flex items-center">
        <span className="mr-2 block">{status.name}</span>
        <div className={`h-3 w-3 rounded-full ${status.styleClass}`}></div>
      </div>
    </div>
  );
}
