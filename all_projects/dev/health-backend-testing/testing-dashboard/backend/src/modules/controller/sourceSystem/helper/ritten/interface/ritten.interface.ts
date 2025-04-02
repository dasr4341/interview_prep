export interface RittenPatientRawDbResponse {
  id: string;
  in_patient: boolean;
  source_system_patient_id: any;
  first_name: string;
  middle_name: any;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
  discharge_date: string;
  anticipated_discharge_date: any;
  mr_number: any;
  intake_date: any;
  level_of_care: any;
  diagnosis_codes: any;
  care_team_details_id: string;
}
export interface PatientCareTeamsInterface {
  care_team_types: string;
  email: string;
  first_name: string;
  middle_name: any;
  last_name: string;
}
export interface RittenCareTeamRawDbResponse {
  id: string;
  care_team_details_id: string;
  care_team_types: string;
  email: string;
  first_name: string;
  middle_name: any;
  last_name: string;
}
export interface FormattedPatientDataInterface {
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
  patient_care_teams: PatientCareTeamsInterface[];
}
