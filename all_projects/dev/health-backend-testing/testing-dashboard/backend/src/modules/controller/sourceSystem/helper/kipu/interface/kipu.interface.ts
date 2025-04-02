import { PatientDischargeStatus } from "../../../../../../config/config.enum"

export interface IKipuPatientDataFromDb {
  id: string
  in_patient: boolean,
  casefile_id: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  gender: string
  dob: string
  race: string
  ethnicity: string
  address_street: string
  address_city: string
  state: string
  address_zip: string
  address_country: string
  admission_date: string
  discharge_date: string
  anticipated_discharge_date: string
  date_of_death: any
  cause_of_death: any
  discharge_or_transition_id: any
  discharge_or_transition_name: string
  discharge_type: string
  discharge_type_code: string
  first_contact_name: string
  referrer_name: string
  mr_number: string
  payment_method: string
  payment_method_category: string
  insurances01: any
  room_name: string
  location_id: string
  gender_identity: string
  level_of_care: string
  bed_name: string
  next_level_of_care: string
  maiden_name: string
  phone: string
  preferred_language: string
  preferred_contact: string
  next_level_of_care_date: string
  diagnosis_codes: any
  building_name: string
  location_name: string
  created_at: string
  patient_contacts_full_name: string
  patient_contacts_relationship: string
  patient_contacts_contact_type: string
  patient_contacts_phone: string
  patient_contacts_alternative_phone: string
  patient_contacts_address: string
  patient_contacts_email: string
  patient_contacts_notes: string
}

export interface IPatientFormattedDataFromDb {
  id: string
  casefile_id: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  gender: string
  dob: string
  race: string
  ethnicity: string
  address_street: string
  address_city: string
  state: string
  address_zip: string
  address_country: string
  admission_date: string
  discharge_date: string
  anticipated_discharge_date: string
  date_of_death: any
  cause_of_death: any
  discharge_or_transition_id: any
  discharge_or_transition_name: string
  discharge_type: string
  discharge_type_code: string
  first_contact_name: string
  referrer_name: string
  mr_number: string
  payment_method: string
  payment_method_category: string
  insurances01: any
  room_name: string
  location_id: string
  gender_identity: string
  level_of_care: string
  bed_name: string
  next_level_of_care: string
  maiden_name: string
  phone: string
  preferred_language: string
  preferred_contact: string
  next_level_of_care_date: string
  diagnosis_codes: any
  building_name: string
  location_name: string
  created_at: string
  patient_contacts_notes: string
  patient_contacts: PatientContact[]
}

export interface PatientContact {
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}


export interface IKipuRowComparedData {
  patientStatus: PatientDischargeStatus
  casefile_id: string
  first_name: string
  middle_name: string
  last_name: string
  gender: string
  gender_identity: string
  dob: string
  race: string
  ethnicity: string
  address_street: string
  address_city: string
  state: string
  address_zip: string
  address_country: string
  email: string
  admission_date: string
  discharge_date: string
  anticipated_discharge_date: string
  date_of_death: any
  cause_of_death: any
  discharge_or_transition_id: any
  discharge_or_transition_name: string
  discharge_type: string
  discharge_type_code: string
  first_contact_name: string
  referrer_name: string
  mr_number: string
  payment_method: string
  payment_method_category: string
  created_at: string
  diagnosis_codes: string
  patient_contacts: PatientContacts
  phone: string
  level_of_care: string
  next_level_of_care: any
  next_level_of_care_date: any
  bed_name: string
  room_name: string
  building_name: string
  location_id: number
  location_name: string
  preferred_language: string
  preferred_contact: string
  maiden_name: string
  errors: Errors2
  uId: string
  source: string
}

export interface PatientContacts {
  data: Daum[]
  isPatientPresent: boolean
  matched: boolean
  dbData: DbDaum[]
  rawKipuData: RawKipuDaum[]
}

export interface Daum {
  source: Source
  full_name: FullName
  relationship: Relationship
  contact_type: ContactType
  phone: Phone
  alternative_phone: AlternativePhone
  address: Address
  email: Email
  notes: Notes
  errors: Errors
}

export interface Source {
  data: string
  isPatientPresent: boolean
  dbData: any
  matched: boolean
}

export interface FullName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Relationship {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface ContactType {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Phone {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface AlternativePhone {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Address {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Email {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Notes {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Errors {
  isErrorExist: boolean
  isPatientPresent: boolean
  dbData: DbData
}

export interface DbData {
  source: string
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}

export interface DbDaum {
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}

export interface RawKipuDaum {
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}

export interface Errors2 {
  casefile_id: CasefileId
  first_name: FirstName
  middle_name: MiddleName
  last_name: LastName
  gender: Gender
  gender_identity: GenderIdentity
  dob: Dob
  race: Race
  ethnicity: Ethnicity
  address_street: AddressStreet
  address_city: AddressCity
  state: State
  address_zip: AddressZip
  address_country: AddressCountry
  email: Email2
  admission_date: AdmissionDate
  discharge_date: DischargeDate
  anticipated_discharge_date: AnticipatedDischargeDate
  date_of_death: DateOfDeath
  cause_of_death: CauseOfDeath
  discharge_or_transition_id: DischargeOrTransitionId
  discharge_or_transition_name: DischargeOrTransitionName
  discharge_type: DischargeType
  discharge_type_code: DischargeTypeCode
  first_contact_name: FirstContactName
  referrer_name: ReferrerName
  mr_number: MrNumber
  payment_method: PaymentMethod
  payment_method_category: PaymentMethodCategory
  created_at: CreatedAt
  diagnosis_codes: DiagnosisCodes
  patient_contacts: PatientContacts2
  phone: Phone3
  level_of_care: LevelOfCare
  next_level_of_care: NextLevelOfCare
  next_level_of_care_date: NextLevelOfCareDate
  bed_name: BedName
  room_name: RoomName
  building_name: BuildingName
  location_id: LocationId
  location_name: LocationName
  preferred_language: PreferredLanguage
  preferred_contact: PreferredContact
  maiden_name: MaidenName
  isErrorExist: boolean
  isPatientPresent: boolean
}

export interface CasefileId {
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

export interface Gender {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface GenderIdentity {
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

export interface Race {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface Ethnicity {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface AddressStreet {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface AddressCity {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface State {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface AddressZip {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface AddressCountry {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface Email2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface AdmissionDate {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface DischargeDate {
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
  dbData: string
  rawKipuData: string
}

export interface DateOfDeath {
  data: any
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: any
}

export interface CauseOfDeath {
  data: any
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: any
}

export interface DischargeOrTransitionId {
  data: any
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: any
}

export interface DischargeOrTransitionName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface DischargeType {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface DischargeTypeCode {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface FirstContactName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface ReferrerName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface MrNumber {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface PaymentMethod {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface PaymentMethodCategory {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface CreatedAt {
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

export interface PatientContacts2 {
  data: Daum2[]
  isPatientPresent: boolean
  matched: boolean
  dbData: DbDaum2[]
  rawKipuData: RawKipuDaum2[]
}

export interface Daum2 {
  source: Source2
  full_name: FullName2
  relationship: Relationship2
  contact_type: ContactType2
  phone: Phone2
  alternative_phone: AlternativePhone2
  address: Address2
  email: Email3
  notes: Notes2
  errors: Errors3
}

export interface Source2 {
  data: string
  isPatientPresent: boolean
  dbData: any
  matched: boolean
}

export interface FullName2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Relationship2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface ContactType2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Phone2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface AlternativePhone2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Address2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Email3 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Notes2 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
}

export interface Errors3 {
  isErrorExist: boolean
  isPatientPresent: boolean
  dbData: DbData2
}

export interface DbData2 {
  source: string
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}

export interface DbDaum2 {
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}

export interface RawKipuDaum2 {
  full_name: string
  relationship: string
  contact_type: string
  phone: string
  alternative_phone: string
  address: string
  email: string
  notes: string
}

export interface Phone3 {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface LevelOfCare {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface NextLevelOfCare {
  data: any
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: any
}

export interface NextLevelOfCareDate {
  data: any
  isPatientPresent: boolean
  matched: boolean
  dbData: any
  rawKipuData: any
}

export interface BedName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface RoomName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface BuildingName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface LocationId {
  data: number
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: number
}

export interface LocationName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface PreferredLanguage {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface PreferredContact {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

export interface MaidenName {
  data: string
  isPatientPresent: boolean
  matched: boolean
  dbData: string
  rawKipuData: string
}

