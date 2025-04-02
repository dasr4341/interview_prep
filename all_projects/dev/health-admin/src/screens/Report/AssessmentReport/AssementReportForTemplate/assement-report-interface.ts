export enum TemplateCodes {
  PHQ9 = 'PHQ-9',
  PHQ15 = 'PHQ-15',
  GAD7 = 'GAD-7',
  BAM_R = 'BAM-R',
  BAM_IOP = 'BAM-IOP',
  URICA = 'URICA'
}

export enum ReportTableColumn {
  Assessment_Type = 'Assessment Type',
  Use_Factors = 'Use Factors',
  Risk_Factors = 'Risk Factors',
  Protective_Factors = 'Protective Factors',
}

export enum OpenStatTableColumn {
  Name = 'Name',
  Assigned = 'Assigned',
}

export interface Score {
  value: number;
  direction: ScoreDirection;
  color: ScoreColor;
}

export interface ScoreData {
  value: number;
  description: string;
  percent: Score;
}

export enum ScoreColor {
  red = 'red',
  green = 'green'
}

export enum ScoreDirection {
  up = 'up',
  down = 'down'
}

export enum CompletedStatsHeader {
  name = 'name',
  facility = 'facility',
  completed = 'completed',
  assigned = 'assigned',
  scoreAverage = 'scoreAverage',
  biometricScore = 'biometricScore',
  severityType = 'severityType',
  protectiveFactors = 'protectiveFactors',
  riskFactors = 'riskFactors',
  useFactors = 'useFactors',
  readinessScore = 'readinessScore'
}

export interface ReportTableCol {
  value?: string | number | null,
  percent?: Score;
  info?: string | null;
  assessmentNumber?: number | null;
  id?: string;
  biometric?: number | null;
  name?: string;
  assigned?: string | null;
  patientId?: string | null;
  assignmentId?: string | null;
  completed?: string | null;
  facility?: string | null;
  scoreAverage?:  ScoreData;
  protectiveFactors?: ScoreData;
  riskFactors?: ScoreData;
  useFactors?: ScoreData;
  readinessScore?: ScoreData;
}
export interface ReportTableRow {
  data: ReportTableCol[],
  id: string;
  patientId?: string | null;
  assessmentId?: string | null;
}

export interface PatientAssessmentOverview {
  anomaliesReportCount: number;
  biometricReport: number;
  geofenceBreachsReportCount: number;
  helpLineContactedReportCount: number;
}

export enum CampaignStatsType {
 COMPLETED = 'COMPLETED',
 OPEN = 'OPEN'
}






