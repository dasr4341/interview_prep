export enum Frequency {
  daily = 'DAILY',
  weekly = 'WEEKLY',
  monthly = 'MONTHLY',
}
export interface ReportTestPayload {
  facilityId: string;
  date: string;
  freQuency?: Frequency;
}

export enum ReportTableColumnKeys {
  fullName = 'fullName',
  user_id = 'user_id',
  report_count = 'report_count',
  no_report_count = 'no_report_count',
  email = 'email',
  fitbit_user_id = 'fitbit_user_id',
  events = 'events',
  total_events = 'total_events',
  in_patient = 'in_patient',
  discharge_date = 'discharge_date',
}

export interface ReportTableColumn {
  field: ReportTableColumnKeys;
  headerName: string;
  hide?: boolean;
  cellDataType?: string;
}
export interface ReportTestResponse {
  message: string;
  payload: ReportTestPayload;
  table: {
    rows: any;
    columns: ReportTableColumn[];
  };
  userResponse: any;
  eventResponse: any;
}

export interface ReportEvent {
  id: string;
  text_detail: string;
  text: string;
  created_at: string;
  type: string;
  consolidated: boolean;
  patient_id: string;
  frequency: string;
  first_name: string;
  last_name: string;
  email: string;
  time_zone: string;
  name: string;
  no_report: boolean;
}

export interface UserObject {
  first_name: string;
  last_name: string;
  email: string;
  fitbit_token_invalid: boolean;
  user_type: string;
  fitbit_user_id: string;
  in_patient: boolean;
  discharge_date: string;
  id: string;
}

export const reportTestDataColumns: ReportTableColumn[] = [
  {
    field: ReportTableColumnKeys.fullName,
    headerName: 'Full Name',
  },
  {
    field: ReportTableColumnKeys.report_count,
    headerName: 'Valid Report Event Count',
  },
  {
    field: ReportTableColumnKeys.no_report_count,
    headerName: 'No Report Event Count',
  },
  {
    field: ReportTableColumnKeys.email,
    headerName: 'Email',
  },
  {
    field: ReportTableColumnKeys.fitbit_user_id,
    headerName: 'Fitbit User ID',
  },
  {
    field: ReportTableColumnKeys.discharge_date,
    headerName: 'Discharge Date',
    cellDataType: 'date',
  },
  {
    field: ReportTableColumnKeys.in_patient,
    headerName: 'Patient Status',
  },
  {
    field: ReportTableColumnKeys.total_events,
    headerName: 'Total Event Count',
    cellDataType: 'number',
  },
];
