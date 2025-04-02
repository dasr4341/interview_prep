
  

export interface PatientContactsInterface {
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}


export interface RittenComparedDataErrorInterface {
  source_system_patient_id: SourceSystemPatientId
  first_name: FirstName
  middle_name: MiddleName
  last_name: LastName
  email: Email
  gender: Gender
  dob: Dob
  discharge_date: DischargeDate
  intake_date: IntakeDate
  level_of_care: LevelOfCare
  anticipated_discharge_date: AnticipatedDischargeDate
  mr_number: MrNumber
  diagnosis_codes: DiagnosisCodes
  patient_care_teams: PatientCareTeams
}

export interface SourceSystemPatientId {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface FirstName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface MiddleName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface LastName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface Email {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface Gender {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface Dob {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface DischargeDate {
  data: any
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: any
}

export interface IntakeDate {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: string
}

export interface LevelOfCare {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface AnticipatedDischargeDate {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: string
}

export interface MrNumber {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface DiagnosisCodes {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: string
}

export interface PatientCareTeams {
  data: Daum[]
  isPatientPresent: boolean
  matched: boolean
  dbData: DbDaum[]
  rawKipuData: RawKipuDaum[]
}

export interface Daum {
  source: string
  care_team_types: CareTeamTypes
  email: Email2
  first_name: FirstName2
  middle_name: MiddleName2
  last_name: LastName2
  errors: Errors
}

export interface CareTeamTypes {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Email2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface FirstName2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface MiddleName2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: any
}

export interface LastName2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Errors {
  isErrorExist: boolean
  dbData: DbData
}

export interface DbData {
  source: string
  care_team_types: string
  email: string
  first_name: string
  middle_name: any
  last_name: string
}

export interface DbDaum {
  care_team_types: string
  email: string
  first_name: string
  middle_name: any
  last_name: string
}

export interface RawKipuDaum {
  care_team_types: string
  email: string
  first_name: string
  middle_name: string
  last_name: string
}




  