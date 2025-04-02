import { ReportPageTypes } from '../ReportPageLayout';

export interface ReportRoutesParams {
  type: ReportPageTypes;
  patientId?: string;
}
