import { UserInvitationOptions } from 'health-generatedTypes';
import { ClinicianDetailsInterface } from '../PatientManagement/components/ClinicianTypeUpdate/ClinicianTypeDropDown';

export interface PatientManagementRow {
  id: string;
  name: string;
  gender: string | null | undefined;
  genderIdentity: string;
  dob: string | null | undefined;
  race: string;
  ethnicity: string;
  addressStreet: string;
  addressStreet2: string;
  addressCity: string;
  addressCountry: string;
  state: string;
  addressZip: string;
  email: string;
  intakeDate: string | null;
  dischargeDate: string | null;
  dischargeType: string;
  inPatient: string;
  firstContactName: string;
  referrerName: string;
  insuranceCompany: string;
  phone: string;
  levelOfCare: string;
  buildingName: string;
  locationName: string;
  maidenName: string;
  dateOfOnboarding: string | null;
  active: boolean;
  emergencyContact: string;
  friendsAndFamily: FriendsAndFamilyEnum;
  lastLogin: string | null;
  lastSyncTime: string | null;
  lastDailyReportAt: string | null;
  lastWeeklyReportAt: string | null;
  lastMonthlyReportAt: string | null;
  kipuVerified: string | null;
  trackLocation: string;
  invitationStatus: UserInvitationOptions;
  caseManager: ClinicianDetailsInterface | null;
  primaryTherapistsCol: string | null;
  facilityName: string;
  patientTimezone?: string | null;
}

export enum FriendsAndFamilyEnum {
  YES = 'YES',
  NO = 'NO',
}
