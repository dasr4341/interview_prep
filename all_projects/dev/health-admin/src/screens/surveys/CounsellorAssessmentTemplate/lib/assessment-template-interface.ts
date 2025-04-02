import { SentToPatientSelectedRows } from 'interface/app.slice.interface';

export interface AssessmentDetails {
  createdAt: string | null;
  completePercentage: number | null;
  issuedAt: string | null;
  issuedTime: string | null;
  patients: number;
  openPercentage: number | null;
  createdByFullName: string | null;
  surveyTemplateId: string;
  surveyTemplateTitle: string | null;
  surveyId: string | null;
  published: string;
  isEditable: boolean;
}

export interface AdhocAssessmentAssignmentList {
  patientFirstName: string | null;
  patientId: string;
  patientLastName: string | null;
}
export interface AdhocAssessment {
  published: boolean;
  publishedAt: string | null;
  scheduledAt: string;
  assessmentAssignmentList: SentToPatientSelectedRows[] | null;
  assessmentId: string;
  campaignAssessmentSignature: boolean
}

export interface PatientListModalData {
  completed: string | null;
  name: string | null;
  patientId: string;
  score: number | null;
  finishTime?: string;
  finishDate?: string;
}

export interface SelectedCampaignDetails {
  issuedOn: string | null;
  surveyId: string | null
}