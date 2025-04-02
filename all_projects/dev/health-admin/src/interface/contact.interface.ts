export interface CustomContactListDataFace {
  id: string;
  patientId?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  relationship?: string | null;
  phone?: string | null;
  alternativePhone?: string | null;
  address?: string | null;
  email?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  url?: string | null;
  dob?: string | null;
  company?: string | null;
  contactType: ContactTypesForContact;
  careTeamTypes?: string;
  canDeleteSupporter?: boolean | null;
  canDelete?: boolean | null;
}


export enum ContactTypesForContact {
  SUPPORTER = 'supporters',
  CARE_TEAM = 'careTeams',
  PATIENT_CONTACT = 'patientContacts',
}