import { LazyQueryExecFunction } from '@apollo/client';
import * as yup from 'yup';
import { ImSpinner7 } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

import {
  DeleteFacilityUsersForFacilityAdmin,
  DeleteFacilityUsersForFacilityAdminVariables,
  FacilityUserDeletionRoles,
} from 'health-generatedTypes';
import { DeletePatientOrStaffStateInterfaceByFacilityAdmin } from 'screens/Settings/interface/DeletePatientOrStaffStateInterfaceByFacilityAdmin';

export enum PatientStatus {
  IN = 'In',
  DISCHARGED = 'Discharged',
}
export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum PatientListHeader {
  name = 'name', // common column
  phone = 'phone',
  email = 'email',
  dob = 'dob',
  gender = 'gender', // common column
  genderIdentity = 'genderIdentity',
  race = 'race',
  ethnicity = 'ethnicity',
  state = 'state',
  firstContactName = 'firstContactName',
  referrerName = 'referrerName',
  insuranceCompany = 'insuranceCompany',
  levelOfCare = 'levelOfCare',
  buildingName = 'buildingName',
  locationName = 'locationName',
  maidenName = 'maidenName',
  emergencyContact = 'emergencyContact',
  trackLocation = 'trackLocation',
  careTeamsCol = 'careTeamsCol',
  facilityName = 'facilityName',
  inPatient = 'inPatient', // common column
  active = 'active', // common column
  friendsAndFamily = 'friendsAndFamily',
  emrSyncTime = 'emrSyncTime',
  intakeDate = 'intakeDate', // common column
  dischargeDate = 'dischargeDate', // common column
  anticipatedDischargeDate = 'anticipatedDischargeDate',
  dateOfOnboarding = 'dateOfOnboarding',
  lastLogin = 'lastLogin', // common column
  lastSyncTime = 'lastSyncTime', // common column
  lastDailyReportAt = 'lastDailyReportAt', // common column
  lastWeeklyReportAt = 'lastWeeklyReportAt', // common column
  lastMonthlyReportAt = 'lastMonthlyReportAt', // common column
  kipuVerified = 'kipuVerified',
  primaryTherapistsCol = 'primaryTherapistsCol', // common column
  caseManagerCol = 'caseManagerCol', // common column
  addressStreet = 'addressStreet',
  addressStreet2 = 'addressStreet2',
  addressCity = ' addressCity',
  addressCountry = 'addressCountry',
  addressZip = 'addressZip',
  invitationStatus = 'invitationStatus', // common column
  dischargeType = 'dischargeType'
}

export const CommonColumnHeaderNames: string [] = [
  PatientListHeader.name,
  PatientListHeader.gender,
  PatientListHeader.inPatient,
  PatientListHeader.active,
  PatientListHeader.intakeDate,
  PatientListHeader.dischargeDate,
  PatientListHeader.lastLogin,
  PatientListHeader.lastSyncTime,
  PatientListHeader.lastDailyReportAt,
  PatientListHeader.lastWeeklyReportAt,
  PatientListHeader.lastMonthlyReportAt,
  PatientListHeader.primaryTherapistsCol,
  PatientListHeader.caseManagerCol,
  PatientListHeader.invitationStatus,
]

export const PatientListHeaderName: string[] = [
  PatientListHeader.name,
  PatientListHeader.phone,
  PatientListHeader.email,
  PatientListHeader.dob,
  PatientListHeader.gender,
  PatientListHeader.genderIdentity,
  PatientListHeader.race,
  PatientListHeader.ethnicity,
  PatientListHeader.state,
  PatientListHeader.firstContactName,
  PatientListHeader.referrerName,
  PatientListHeader.insuranceCompany,
  PatientListHeader.levelOfCare,
  PatientListHeader.buildingName,
  PatientListHeader.locationName,
  PatientListHeader.maidenName,
  PatientListHeader.emergencyContact,
  PatientListHeader.trackLocation,
  PatientListHeader.careTeamsCol,
  PatientListHeader.facilityName,
  PatientListHeader.inPatient,
  PatientListHeader.active,
  PatientListHeader.friendsAndFamily,
  PatientListHeader.emrSyncTime,
  PatientListHeader.intakeDate,
  PatientListHeader.dischargeDate,
  PatientListHeader.anticipatedDischargeDate,
  PatientListHeader.dateOfOnboarding,
  PatientListHeader.lastLogin,
  PatientListHeader.lastSyncTime,
  PatientListHeader.lastDailyReportAt,
  PatientListHeader.lastWeeklyReportAt,
  PatientListHeader.lastMonthlyReportAt,
  PatientListHeader.kipuVerified,
  PatientListHeader.primaryTherapistsCol,
  PatientListHeader.caseManagerCol,
  PatientListHeader.addressStreet,
  PatientListHeader.addressStreet2,
  PatientListHeader.addressCity,
  PatientListHeader.addressCountry,
  PatientListHeader.addressZip,
  PatientListHeader.invitationStatus,
  PatientListHeader.dischargeType,
];
export interface BulkEmailInviteStateInterface {
  modalState: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}

export const getFilteredGenderValues = (data, field) => {
  const uniqueValues = new Set(data.map((item) => item[field]));
  // Filter out null and undefined values
  return Array.from(uniqueValues).filter((value) => value !== 'null' && value !== 'undefined' && value !== 'Null');
};

export const emailSchema = yup.string().email();

export function deletePatient(
  userIds: string[],
  callBack: LazyQueryExecFunction<DeleteFacilityUsersForFacilityAdmin, DeleteFacilityUsersForFacilityAdminVariables>,
) {
  callBack({
    variables: {
      userType: FacilityUserDeletionRoles.PATIENT,
      all: false,
      userIds,
    },
  });
}

export function onPatientStatus(status: boolean | null | undefined) {
  if (status) {
    return PatientStatus.IN;
  } else if (status === false) {
    return PatientStatus.DISCHARGED;
  }
  return 'N/A';
}

export const onStatusFormatter = (params) => {
  const status = params.value;

  if (status) {
    return Status.ACTIVE;
  } else {
    return Status.INACTIVE;
  }
}

export function PatientNameComponent({
  data,
  loading,
  deletePatientState,
  setDeletePatientState,
}: {
  data: any;
  loading: boolean;
  deletePatientState: DeletePatientOrStaffStateInterfaceByFacilityAdmin;
  setDeletePatientState: React.Dispatch<React.SetStateAction<DeletePatientOrStaffStateInterfaceByFacilityAdmin>>;
}) {
  return (
    <div className="flex flex-row items-center clinician-name cursor-pointer justify-between ">
      <Link
        to={routes.admin.patientDetails.userDetails.build(data.id)}
        className=" patineName">
        {data.name || 'N/A'}
      </Link>
      <button
        disabled={loading || deletePatientState.modalState}
        className=" edit-btn ml-1 flex flex-row items-center  cursor-pointer px-2 py-1 bg-gray-300 rounded text-xss"
        onClick={() => {
          if (loading) {
            return;
          }
          setDeletePatientState(() => ({
            modalState: true,
            selectedPatient: [data.id],
          }));
        }}>
        Delete
        {deletePatientState?.selectedPatient?.includes(data.id) && loading ? (
          <ImSpinner7 className="animate-spin ml-2" />
        ) : (
          ''
        )}
      </button>
    </div>
  );
}
