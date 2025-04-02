import { ContactTypes, PatientEHRContactType, RelationshipTypes } from "health-generatedTypes";


export interface ProfileContactsFormFields {
  name: string;
  email: string;
  phone: string;
  alternativePhone: string;
  patientEhrContactType: PatientEHRContactType | ContactTypes;
  relationship: RelationshipTypes;
  address: string;
  company: string;
  notes: string;
  url: string;
}