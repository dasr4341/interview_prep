import { PatientDischargeStatus } from "../../../../config/config.enum";

export interface TableCompatibleDataInterface {
    rows: TableRow[]
    cols: Col[]
  }

export interface TableRow {
    patientStatus: PatientDischargeStatus;
    source_system_patient_id: string
    first_name: string
    middle_name: string
    last_name: string
    email: string
    gender?: string
    dob: string
    discharge_date?: string
    intake_date?: string
    level_of_care?: string
    anticipated_discharge_date?: string
    mr_number: string
    diagnosis_codes?: string
    patient_care_teams: any
    errors?: Errors
    uId: string
    source: string
  }
  
  export interface Errors {
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
    isErrorExist: boolean
    isPatientPresent: boolean
  }
  
  export interface SourceSystemPatientId {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface FirstName {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface MiddleName {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface LastName {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface Email {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface Gender {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
    rawRittenData: string
  }
  
  export interface Dob {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface DischargeDate {
    data?: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
    rawRittenData?: string
  }
  
  export interface IntakeDate {
    data?: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
    rawRittenData?: string
  }
  
  export interface LevelOfCare {
    data?: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData?: string
  }
  
  export interface AnticipatedDischargeDate {
    data?: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
    rawRittenData?: string
  }
  
  export interface MrNumber {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData: string
    rawRittenData: string
  }
  
  export interface DiagnosisCodes {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
    rawRittenData: string
  }
  
  export interface PatientCareTeams {
    data: Daum[]
    isPatientPresent: boolean
    matched: boolean
    dbData: DbDaum[]
    rawRittenData: RawRittenDaum[]
  }
  
  export interface Daum {
    source: Source
    care_team_types: CareTeamTypes
    email: Email2
    first_name: FirstName2
    middle_name: MiddleName2
    last_name: LastName2
    errors: Errors2
  }
  
  export interface Source {
    data: string
    isPatientPresent: boolean
    dbData: any
    matched: boolean
  }
  
  export interface CareTeamTypes {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
  }
  
  export interface Email2 {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
  }
  
  export interface FirstName2 {
    data: string
    isPatientPresent: boolean
    matched: boolean
    dbData?: string
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
    dbData?: string
  }
  
  export interface Errors2 {
    isErrorExist: boolean
    isPatientPresent: boolean
    dbData: DbData
  }
  
  export interface DbData {
    source: string
    care_team_types?: string
    email?: string
    first_name?: string
    middle_name: any
    last_name?: string
  }
  
  export interface DbDaum {
    care_team_types: string
    email: string
    first_name: string
    middle_name: any
    last_name: string
  }
  
  export interface RawRittenDaum {
    care_team_types: string
    email: string
    first_name: string
    middle_name: string
    last_name: string
  }
  
  export interface Col {
    field: string
    sortable: boolean
    headerName: string
    isMultiple: boolean
  }
  