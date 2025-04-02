export interface ReportTableRow {
  key: string;
  value: string | ReportEvent;
}
export interface ReportTableColumn {
  key: string;
  value: string;
}

export interface ReportEvent  {
  id: string
  text_detail: string
  text: string
  created_at: string
  type: string
  consolidated: boolean
  patient_id: string
  frequency: string
  first_name: string
  last_name: string
  email: string
  time_zone: string
  name: string
  no_report: boolean;
}
export interface ReportsData {
    message: string;
    payload: any;
    userResponse: {
      rowsCount: number;
      rows: any;
    };
    eventResponse: {
      rowsCount: number;
      rows: any
    };
    table: {
      rows: ReportTableRow[][],
      columns: ReportTableColumn[]
    }
  }

  export interface ReportRow {
    name: string
    report_count: number
    no_report_count: number
    email: string
    fitbit_user_id: string
    user_id: string;
    total_events: number
    events: Event[]
  }
  
  export interface Event {
    id: string
    text_detail: string
    text: string
    created_at: string
    type: string
    consolidated: boolean
    patient_id: string
    frequency: string
    no_report: boolean
    first_name: string
    last_name: string
    email: string
    time_zone: string
    name: string
  }
  