export interface RittenPatientRawDataInterface {
  id: string;
  dob: string;
  name: Name;
  mrn: string;
  programStatus: string;
  latestClinicalProgram: LatestClinicalProgram;
  latestClinicalDischarge: any;
  programs: Program2[];
  careTeam: CareTeam;
  emails: string[];
  diagnoses: Diagnosis[];
}

export interface Name {
  first: string;
  middle: string;
  last: string;
  pronouns: string;
  chosenName: string;
}

export interface LatestClinicalProgram {
  id: string;
  program: Program;
  levelOfCare: string;
  admitDate: string;
  admittedByUserId: string;
  estimatedDischargeDate: string;
  dischargeTypeId: string;
  dischargeDate: string;
  transferredFrom: string;
  transferredTo: string;
}

export interface Program {
  id: string;
  programName: string;
  programType: string;
}

export interface Program2 {
  id: string;
  program: Program3;
  levelOfCare: string;
  admitDate: string;
  admittedByUserId: string;
  estimatedDischargeDate: string;
  dischargeTypeId: string;
  dischargeDate: string;
  transferredFrom: string;
  transferredTo: string;
}

export interface Program3 {
  id: string;
  programName: string;
  programType: string;
}

export interface CareTeam {
  id: string;
  primaryClinicianId: string;
  teamUserIds: string[];
  primaryClinician: PrimaryClinician;
}

export interface PrimaryClinician {
  id: string;
  email: string;
  first: string;
  middle: string;
  last: string;
}

export interface Diagnosis {
  diagnosis: string;
  isPrimary: boolean;
}

export interface PatientCareTeamsInterface {
  care_team_types: string
  email: string
  first_name: string
  middle_name: any
  last_name: string
}
export interface RittenFormattedPatientDataWithCareTeam {
  source_system_patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string | null;
  gender: string;
  intake_date: string | null;
  level_of_care: string | null;
  anticipated_discharge_date: string | null;
  discharge_date: string | null;
  mr_number: string;
  dob: string;
  diagnosis_codes: string;
  careTeam: CareTeam;
  patient_care_teams: PatientCareTeamsInterface[]
}

export interface RittenFormattedPatientData {
  source_system_patient_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string | null;
  gender: string;
  intake_date: string | null;
  level_of_care: string | null;
  anticipated_discharge_date: string | null;
  discharge_date: string | null;
  mr_number: string;
  dob: string;
  diagnosis_codes: string;
  patient_care_teams: PatientCareTeamsInterface[]
}


export interface RittenPatientRawCareTeamData {
  id: string
  email: string
  first: string
  middle: string
  last: string
}

