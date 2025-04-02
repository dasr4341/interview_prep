/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminActiveUserList
// ====================================================

export interface AdminActiveUserList_pretaaHealthAdminActiveUserList {
  __typename: "ActiveUserList";
  id: string;
  fullName: string | null;
  email: string;
  numberOfReports: number;
  numberOfAssesmentCompleted: number;
}

export interface AdminActiveUserList {
  pretaaHealthAdminActiveUserList: AdminActiveUserList_pretaaHealthAdminActiveUserList[];
}

export interface AdminActiveUserListVariables {
  facilityId: string;
  startDate: any;
  endDate: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EHRAddPatientContact
// ====================================================

export interface EHRAddPatientContact {
  pretaaHealthEHRAddPatientContact: string;
}

export interface EHRAddPatientContactVariables {
  name: string;
  phone: string;
  relationship?: RelationshipTypes | null;
  address?: string | null;
  notes?: string | null;
  alternativePhone?: string | null;
  company?: string | null;
  dob?: string | null;
  url?: string | null;
  patientEhrContactType?: PatientEHRContactType | null;
  email?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddStaff
// ====================================================

export interface AddStaff {
  pretaaHealthAddStaffUser: string;
}

export interface AddStaffVariables {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: UserStaffTypes[];
  facilityIds?: string[] | null;
  careTeamTypes?: CareTeamTypes[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminCreateFacility
// ====================================================

export interface AdminCreateFacility_pretaaHealthAdminCreateFacility_locations {
  __typename: "KipuLocationsResponse";
  locationName: string;
  enabled: boolean;
  locationId: number;
  exists: boolean;
}

export interface AdminCreateFacility_pretaaHealthAdminCreateFacility {
  __typename: "AdminFacilityResponse";
  facilityId: string | null;
  facilityName: string | null;
  locations: AdminCreateFacility_pretaaHealthAdminCreateFacility_locations[] | null;
}

export interface AdminCreateFacility {
  pretaaHealthAdminCreateFacility: AdminCreateFacility_pretaaHealthAdminCreateFacility;
}

export interface AdminCreateFacilityVariables {
  pretaaHealthAdminCreateFacilityAccountId2: string;
  facilityName?: string | null;
  sourceSystemId: string;
  dynamicFields: SourceSystemFieldInput[];
  timeZone?: string | null;
  offset: string;
  platformType: PlatformTypes;
  fetchCareTeam?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminCreateFacilityForEMR
// ====================================================

export interface AdminCreateFacilityForEMR {
  pretaaHealthAdminCreateFacilityForEmr: string;
}

export interface AdminCreateFacilityForEMRVariables {
  accountId: string;
  dynamicFields: SourceSystemFieldInput[];
  sourceSystemId: string;
  locations?: AdminFacilityKipuLocationArgs[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminListFacilities
// ====================================================

export interface AdminListFacilities_pretaaHealthAdminListFacilities_sourceSystem {
  __typename: "SourceSystems";
  slug: string | null;
}

export interface AdminListFacilities_pretaaHealthAdminListFacilities {
  __typename: "AdminFacilityListResponse";
  id: string;
  isActive: boolean;
  name: string;
  timeZone: string | null;
  createdAt: any;
  sourceSystemId: string | null;
  sourceSystem: AdminListFacilities_pretaaHealthAdminListFacilities_sourceSystem | null;
  activePatients: number;
}

export interface AdminListFacilities {
  pretaaHealthAdminListFacilities: AdminListFacilities_pretaaHealthAdminListFacilities[];
}

export interface AdminListFacilitiesVariables {
  accountId: string;
  getActiveFacility?: boolean | null;
  searchPhrase?: string | null;
  skip?: number | null;
  take?: number | null;
  endDate?: any | null;
  startDate?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminForgotPassword
// ====================================================

export interface AdminForgotPassword {
  pretaaHealthAdminForgotPassword: string;
}

export interface AdminForgotPasswordVariables {
  forgotPwToken: string;
  newPassword: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminSourceSystemFields
// ====================================================

export interface AdminSourceSystemFields_pretaaHealthAdminSourceSystemFields {
  __typename: "SourceSystemFieldsResponse";
  id: string;
  name: string;
  placeholder: string;
  order: number;
  sourceSystemId: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminSourceSystemFields {
  pretaaHealthAdminSourceSystemFields: AdminSourceSystemFields_pretaaHealthAdminSourceSystemFields[];
}

export interface AdminSourceSystemFieldsVariables {
  sourceSystemId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminSourceSystems
// ====================================================

export interface AdminSourceSystems_pretaaHealthAdminSourceSystems {
  __typename: "SourceSystemListResponse";
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  logo: string | null;
}

export interface AdminSourceSystems {
  pretaaHealthAdminSourceSystems: AdminSourceSystems_pretaaHealthAdminSourceSystems[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminUpdateAccountStatus
// ====================================================

export interface AdminUpdateAccountStatus_pretaaHealthAdminUpdateAccountStatus {
  __typename: "Account";
  status: boolean;
}

export interface AdminUpdateAccountStatus {
  pretaaHealthAdminUpdateAccountStatus: AdminUpdateAccountStatus_pretaaHealthAdminUpdateAccountStatus;
}

export interface AdminUpdateAccountStatusVariables {
  accountId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppData
// ====================================================

export interface AppData {
  pretaaHealthReminderTypes: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AssessmentArchieveForCounsellors
// ====================================================

export interface AssessmentArchieveForCounsellors {
  pretaaHealthSurveyArchiveForCounsellors: string | null;
}

export interface AssessmentArchieveForCounsellorsVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssessmentEventList
// ====================================================

export interface AssessmentEventList_pretaaHealthAssessmentEventList_surveyAssignmentDetails {
  __typename: "SurveyAssignments";
  id: string;
}

export interface AssessmentEventList_pretaaHealthAssessmentEventList {
  __typename: "Event";
  text: string | null;
  textDetail: string | null;
  createdAt: any;
  type: EventTypes;
  id: string;
  patientId: string | null;
  surveyAssignmentDetails: AssessmentEventList_pretaaHealthAssessmentEventList_surveyAssignmentDetails | null;
}

export interface AssessmentEventList {
  pretaaHealthAssessmentEventList: AssessmentEventList_pretaaHealthAssessmentEventList[];
}

export interface AssessmentEventListVariables {
  parentEventId: string;
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BulkInvitePatients
// ====================================================

export interface BulkInvitePatients_pretaaHealthBulkInvitePatients {
  __typename: "PatientListOnboardingResponse";
  invalidEmails: string[] | null;
  registeredEmails: string[] | null;
}

export interface BulkInvitePatients {
  pretaaHealthBulkInvitePatients: BulkInvitePatients_pretaaHealthBulkInvitePatients;
}

export interface BulkInvitePatientsVariables {
  emails: string[];
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCampaignStandardTemplates
// ====================================================

export interface GetCampaignStandardTemplates_pretaaHealthGetCampaignStandardTemplates {
  __typename: "StandardSurveyTemplateResponse";
  id: string | null;
  status: boolean | null;
  name: string | null;
  description: string | null;
  topic: string | null;
  totalCampaignCount: number;
  templateEnableStatus: boolean | null;
}

export interface GetCampaignStandardTemplates {
  pretaaHealthGetCampaignStandardTemplates: GetCampaignStandardTemplates_pretaaHealthGetCampaignStandardTemplates[];
}

export interface GetCampaignStandardTemplatesVariables {
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteCareTeams
// ====================================================

export interface InviteCareTeams {
  pretaaHealthInviteCareTeams: string;
}

export interface InviteCareTeamsVariables {
  careTeamMembers: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CareTeamMemberContactDetails
// ====================================================

export interface CareTeamMemberContactDetails_pretaaHealthEHRGetCareTeamMemberDetails_user {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  email: string;
  mobilePhone: string | null;
}

export interface CareTeamMemberContactDetails_pretaaHealthEHRGetCareTeamMemberDetails {
  __typename: "PatientCareTeamResponse";
  user: CareTeamMemberContactDetails_pretaaHealthEHRGetCareTeamMemberDetails_user | null;
}

export interface CareTeamMemberContactDetails {
  pretaaHealthEHRGetCareTeamMemberDetails: CareTeamMemberContactDetails_pretaaHealthEHRGetCareTeamMemberDetails;
}

export interface CareTeamMemberContactDetailsVariables {
  careTeamId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeScheduleForSurvey
// ====================================================

export interface ChangeScheduleForSurvey {
  pretaaHealthChangeScheduleForSurvey: string;
}

export interface ChangeScheduleForSurveyVariables {
  sendNow?: boolean | null;
  surveyId: string;
  scheduledAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminCheckExpiredForgotPasswordLink
// ====================================================

export interface AdminCheckExpiredForgotPasswordLink_pretaaHealthAdminCheckExpiredForgotPasswordLink {
  __typename: "AdminUser";
  email: string;
}

export interface AdminCheckExpiredForgotPasswordLink {
  pretaaHealthAdminCheckExpiredForgotPasswordLink: AdminCheckExpiredForgotPasswordLink_pretaaHealthAdminCheckExpiredForgotPasswordLink;
}

export interface AdminCheckExpiredForgotPasswordLinkVariables {
  forgotPwToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckExpiredForgotPasswordLink
// ====================================================

export interface CheckExpiredForgotPasswordLink_pretaaHealthCheckExpiredForgotPasswordLink {
  __typename: "User";
  email: string;
}

export interface CheckExpiredForgotPasswordLink {
  pretaaHealthCheckExpiredForgotPasswordLink: CheckExpiredForgotPasswordLink_pretaaHealthCheckExpiredForgotPasswordLink;
}

export interface CheckExpiredForgotPasswordLinkVariables {
  forgotPwToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckSupporterExpiredLink
// ====================================================

export interface CheckSupporterExpiredLink_pretaaHealthCheckSupporterExpiredLink {
  __typename: "User";
  email: string;
}

export interface CheckSupporterExpiredLink {
  pretaaHealthCheckSupporterExpiredLink: CheckSupporterExpiredLink_pretaaHealthCheckSupporterExpiredLink;
}

export interface CheckSupporterExpiredLinkVariables {
  invitationToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminInviteSuperAdmin
// ====================================================

export interface AdminInviteSuperAdmin {
  pretaaHealthAdminInviteSuperAdmin: string;
}

export interface AdminInviteSuperAdminVariables {
  accountId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCampaignSurvey
// ====================================================

export interface CreateCampaignSurvey_pretaaHealthCreateCampaignSurvey {
  __typename: "Survey";
  id: string;
}

export interface CreateCampaignSurvey {
  pretaaHealthCreateCampaignSurvey: CreateCampaignSurvey_pretaaHealthCreateCampaignSurvey;
}

export interface CreateCampaignSurveyVariables {
  surveyTemplateId: string;
  surveyCountPerParticipantType: SurveyCountPerParticipantType;
  name: string;
  campaignSurveyEndDate: any;
  campaignSurveyStartDate: any;
  surveyAssignmentType: CampaignSurveyAssignmentTypes;
  campaignSurveyReminderCompletionDay: CampaignSurveyReminderCompletion;
  triggerType?: CampaignSurveyTriggerTypes | null;
  campaignSurveyGroup?: CampaignSurveyGroupType[] | null;
  recipientsId?: string[] | null;
  campaignSurveyFrequencyType?: CampaignSurveyFrequency | null;
  campaignSurveyFrequencyCustomData?: number | null;
  campaignSurveySignature?: boolean | null;
  delay?: boolean | null;
  delayOfDays?: number | null;
  surveyEventType?: CampaignSurveyEventTypes | null;
  facilityId?: string | null;
  saveAsDraft?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFacility
// ====================================================

export interface CreateFacility_pretaaHealthCreateFacility {
  __typename: "Facility";
  id: string;
}

export interface CreateFacility {
  pretaaHealthCreateFacility: CreateFacility_pretaaHealthCreateFacility;
}

export interface CreateFacilityVariables {
  facilityName: string;
  facilityUsers: FacilityUsersObjectArgs;
  sourceSystemId: string;
  patientProcessId: string;
  dynamicFields: SourceSystemFieldInput[];
  timeZone: string;
  offset: string;
  platformType: PlatformTypes;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EHRAddPatient
// ====================================================

export interface EHRAddPatient {
  pretaaHealthEHRAddPatient: string;
}

export interface EHRAddPatientVariables {
  patientDetails: EHRPatientDetails;
  careTeams?: EHRCareTeamMatrices[] | null;
  contacts?: Contacts[] | null;
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFeedback
// ====================================================

export interface CreateFeedback_pretaaHealthCreateFeedback {
  __typename: "Feedback";
  feedback: string;
  feedbackValue: number;
}

export interface CreateFeedback {
  pretaaHealthCreateFeedback: CreateFeedback_pretaaHealthCreateFeedback;
}

export interface CreateFeedbackVariables {
  feedback: string;
  feedbackValue: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCounselorGeoFence
// ====================================================

export interface CreateCounselorGeoFence_pretaaHealthCreateCounselorsGeoFence {
  __typename: "GeoFencing";
  id: string;
}

export interface CreateCounselorGeoFence {
  pretaaHealthCreateCounselorsGeoFence: CreateCounselorGeoFence_pretaaHealthCreateCounselorsGeoFence;
}

export interface CreateCounselorGeoFenceVariables {
  name: string;
  location: string;
  type: GeoFencingTypes;
  status: boolean;
  latitude: number;
  longitude: number;
  radius: number;
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateGeoFence
// ====================================================

export interface CreateGeoFence_pretaaHealthCreateGeoFence {
  __typename: "GeoFencing";
  id: string;
}

export interface CreateGeoFence {
  pretaaHealthCreateGeoFence: CreateGeoFence_pretaaHealthCreateGeoFence;
}

export interface CreateGeoFenceVariables {
  name: string;
  type: GeoFencingTypes;
  status: boolean;
  patientId?: string | null;
  latitude: number;
  location: string;
  longitude: number;
  radius: number;
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateStandardTemplate
// ====================================================

export interface CreateStandardTemplate {
  pretaaHealthAdminCreateSurveyTemplate: any;
}

export interface CreateStandardTemplateVariables {
  fields: SurveyTemplateFieldCreateAdminArgs[];
  title: string;
  description?: string | null;
  code?: string | null;
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSurveyTemplate
// ====================================================

export interface CreateSurveyTemplate {
  pretaaHealthCreateSurveyTemplate: any;
}

export interface CreateSurveyTemplateVariables {
  surveyTemplateFields: SurveyTemplateFieldCreateArgs[];
  description?: string | null;
  name?: string | null;
  title: string;
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserContacts
// ====================================================

export interface GetUserContacts_pretaaHealthCurrentUser_patientContactList_careTeams {
  __typename: "PatientCareTeam";
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  title: string | null;
  email: string;
  phone: string | null;
  careTeamTypes: CareTeamTypes | null;
}

export interface GetUserContacts_pretaaHealthCurrentUser_patientContactList_patientContacts {
  __typename: "PatientContacts";
  id: string;
  patientId: string;
  fullName: string | null;
  relationship: string | null;
  contactType: ContactTypes;
  phone: string | null;
  alternativePhone: string | null;
  address: string | null;
  email: string | null;
  notes: string | null;
  createdAt: any | null;
  url: string | null;
  dob: string | null;
  company: string | null;
  canDelete: boolean;
}

export interface GetUserContacts_pretaaHealthCurrentUser_patientContactList_suppoters {
  __typename: "User";
  email: string;
  id: string;
  mobilePhone: string | null;
  firstName: string | null;
  lastName: string | null;
  canDeleteSupporter: boolean | null;
}

export interface GetUserContacts_pretaaHealthCurrentUser_patientContactList {
  __typename: "PatientContactList";
  careTeams: GetUserContacts_pretaaHealthCurrentUser_patientContactList_careTeams[] | null;
  patientContacts: GetUserContacts_pretaaHealthCurrentUser_patientContactList_patientContacts[] | null;
  suppoters: GetUserContacts_pretaaHealthCurrentUser_patientContactList_suppoters[] | null;
}

export interface GetUserContacts_pretaaHealthCurrentUser {
  __typename: "User";
  patientContactList: GetUserContacts_pretaaHealthCurrentUser_patientContactList | null;
}

export interface GetUserContacts {
  pretaaHealthCurrentUser: GetUserContacts_pretaaHealthCurrentUser;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteCampaignSurvey
// ====================================================

export interface DeleteCampaignSurvey {
  pretaaHealthDeleteCampaignSurvey: string | null;
}

export interface DeleteCampaignSurveyVariables {
  campaignSurveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeleteFacilityUsersForSuperAdmin
// ====================================================

export interface DeleteFacilityUsersForSuperAdmin {
  pretaaHealthFacilityDeleteUsers: string;
}

export interface DeleteFacilityUsersForSuperAdminVariables {
  facilityId: string;
  userIds: string[];
  all: boolean;
  userType: FacilityUserDeletionRoles;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeleteFacilityUsersForFacilityAdmin
// ====================================================

export interface DeleteFacilityUsersForFacilityAdmin {
  pretaaHealthFacilityDeleteUsersForFacilityAdmins: string;
}

export interface DeleteFacilityUsersForFacilityAdminVariables {
  userType: FacilityUserDeletionRoles;
  userIds: string[];
  all: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSurvey
// ====================================================

export interface DeleteSurvey {
  pretaaHealthDeleteSurvey: any;
}

export interface DeleteSurveyVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSurveyTemplate
// ====================================================

export interface DeleteSurveyTemplate {
  pretaaHealthDeleteSurveyTemplate: any;
}

export interface DeleteSurveyTemplateVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DownloadASampleCsv
// ====================================================

export interface DownloadASampleCsv_pretaaHealthDownloadASampleCsv {
  __typename: "FileUrlResponse";
  fileURL: string | null;
}

export interface DownloadASampleCsv {
  pretaaHealthDownloadASampleCsv: DownloadASampleCsv_pretaaHealthDownloadASampleCsv | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DuplicateSurveyTemplate
// ====================================================

export interface DuplicateSurveyTemplate {
  pretaaHealthDuplicateSurveyTemplate: any;
}

export interface DuplicateSurveyTemplateVariables {
  surveyTemplateId: string;
  title?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDynamicGroups
// ====================================================

export interface GetDynamicGroups {
  pretaaHealthAllGroups: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EHRImportCareTeam
// ====================================================

export interface EHRImportCareTeam {
  pretaaHealthEHRImportCareTeam: any;
}

export interface EHRImportCareTeamVariables {
  file: any;
  updateExistingUsers?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EHRUpdatePatient
// ====================================================

export interface EHRUpdatePatient {
  pretaaHealthEHRUpdatePatient: string;
}

export interface EHRUpdatePatientVariables {
  pretaaHealthEhrUpdatePatientId: string;
  patientDetails: EHRPatientDetailsUpdate;
  careTeams?: EHRCareTeamMatrices[] | null;
  contacts?: Contacts[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EHRDeletePatientContact
// ====================================================

export interface EHRDeletePatientContact {
  pretaaHealthEHRDeletePatientContact: string;
}

export interface EHRDeletePatientContactVariables {
  patientContactId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EHRGetPatientGenderIdentityTypes
// ====================================================

export interface EHRGetPatientGenderIdentityTypes_pretaaHealthEHRGetPatientGenderIdentityTypes {
  __typename: "PatientGenderIdentityTypesResponse";
  name: string;
  value: string;
}

export interface EHRGetPatientGenderIdentityTypes {
  pretaaHealthEHRGetPatientGenderIdentityTypes: EHRGetPatientGenderIdentityTypes_pretaaHealthEHRGetPatientGenderIdentityTypes[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsersByUserType
// ====================================================

export interface GetUsersByUserType_pretaaHealthGetUsersByUserType_userRole {
  __typename: "UserRoleFieldResponse";
  name: string;
}

export interface GetUsersByUserType_pretaaHealthGetUsersByUserType {
  __typename: "User";
  fullName: string | null;
  email: string;
  createdAt: any;
  mobilePhone: string | null;
  lastLoginTime: any | null;
  active: boolean;
  accountId: string;
  id: string;
  userRole: GetUsersByUserType_pretaaHealthGetUsersByUserType_userRole | null;
}

export interface GetUsersByUserType {
  pretaaHealthGetUsersByUserType: GetUsersByUserType_pretaaHealthGetUsersByUserType[];
}

export interface GetUsersByUserTypeVariables {
  facilityId?: string | null;
  take?: number | null;
  skip?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EventCard
// ====================================================

export interface EventCard_pretaaHealthEventDetails_surveyDetails {
  __typename: "Survey";
  createdAt: any;
}

export interface EventCard_pretaaHealthEventDetails {
  __typename: "Event";
  id: string;
  type: EventTypes;
  eventAt: any | null;
  text: string | null;
  textDetail: string | null;
  createdAt: any;
  frequency: ReportFrequency;
  patientSupporterEventAction: PatientEventActionTypes | null;
  surveyDetails: EventCard_pretaaHealthEventDetails_surveyDetails | null;
}

export interface EventCard {
  pretaaHealthEventDetails: EventCard_pretaaHealthEventDetails;
}

export interface EventCardVariables {
  eventId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthEventSearch
// ====================================================

export interface PretaaHealthEventSearch_pretaaHealthEventSearch_userevent {
  __typename: "UserEvents";
  createdAt: any;
  eventId: string;
  flaggedAt: number | null;
  id: number;
  hideAt: any | null;
  readAt: any | null;
  userId: string;
}

export interface PretaaHealthEventSearch_pretaaHealthEventSearch_surveyAssignmentDetails {
  __typename: "SurveyAssignments";
  createdAt: any;
  id: string;
  isCompleted: boolean;
}

export interface PretaaHealthEventSearch_pretaaHealthEventSearch {
  __typename: "Event";
  id: string;
  text: string | null;
  textDetail: string | null;
  createdAt: any;
  type: EventTypes;
  eventAt: any | null;
  consolidated: boolean;
  patientSupporterEventAction: PatientEventActionTypes | null;
  frequency: ReportFrequency;
  patientId: string | null;
  userevent: PretaaHealthEventSearch_pretaaHealthEventSearch_userevent | null;
  surveyAssignmentDetails: PretaaHealthEventSearch_pretaaHealthEventSearch_surveyAssignmentDetails | null;
  surveyAssignmentId: string | null;
  surveyId: string | null;
}

export interface PretaaHealthEventSearch {
  pretaaHealthEventSearch: PretaaHealthEventSearch_pretaaHealthEventSearch[];
}

export interface PretaaHealthEventSearchVariables {
  dateRange?: DateRangArgs | null;
  eventType?: EventFilterTypes[] | null;
  patientId?: string | null;
  searchPhrase?: string | null;
  skip?: number | null;
  take?: number | null;
  selfHarm?: boolean | null;
  trigger?: boolean | null;
  dateFilter?: ReportingDateFilter | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: HealthEventDetails
// ====================================================

export interface HealthEventDetails_pretaaHealthEventDetails_fence {
  __typename: "GeoFenceResponse";
  longitude: number | null;
  latitude: number | null;
  radius: number | null;
  type: GeoFencingTypes | null;
  location: string | null;
}

export interface HealthEventDetails_pretaaHealthEventDetails_lastLocation {
  __typename: "LastLocationResponse";
  latitude: number | null;
  longitude: number | null;
}

export interface HealthEventDetails_pretaaHealthEventDetails {
  __typename: "Event";
  id: string;
  text: string | null;
  createdAt: any;
  type: EventTypes;
  patientId: string | null;
  timelineCount: number | null;
  noteCount: number | null;
  patientSupporterEventAction: PatientEventActionTypes | null;
  surveyId: string | null;
  noReport: boolean;
  fence: HealthEventDetails_pretaaHealthEventDetails_fence | null;
  lastLocation: HealthEventDetails_pretaaHealthEventDetails_lastLocation | null;
  fenceBreachType: FenceBreachType | null;
}

export interface HealthEventDetails {
  pretaaHealthEventDetails: HealthEventDetails_pretaaHealthEventDetails;
}

export interface HealthEventDetailsVariables {
  eventId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientHealthData
// ====================================================

export interface PatientHealthData {
  pretaaHealthRetriveEventRawData: any;
}

export interface PatientHealthDataVariables {
  eventId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthEventPatientList
// ====================================================

export interface PretaaHealthEventPatientList_pretaaHealthEventPatientList_events {
  __typename: "EventResponse";
  autoId: string;
  createdAt: any;
  id: string;
  parentEventId: string;
}

export interface PretaaHealthEventPatientList_pretaaHealthEventPatientList {
  __typename: "EventPatientResponse";
  createdAt: any;
  email: string;
  events: PretaaHealthEventPatientList_pretaaHealthEventPatientList_events[];
  firstName: string | null;
  id: string;
  lastName: string | null;
  userType: string;
}

export interface PretaaHealthEventPatientList {
  pretaaHealthEventPatientList: PretaaHealthEventPatientList_pretaaHealthEventPatientList[];
}

export interface PretaaHealthEventPatientListVariables {
  eventId: string;
  search?: string | null;
  skip?: number | null;
  take?: number | null;
  eventFilterType: PatientEventFilterTypes;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EventReminder
// ====================================================

export interface EventReminder {
  pretaaHealthEventReminder: any;
}

export interface EventReminderVariables {
  eventId: string;
  reminderType: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ExportPatientList
// ====================================================

export interface ExportPatientList_pretaaHealthExportPatientList {
  __typename: "FileUrlResponse";
  fileURL: string | null;
}

export interface ExportPatientList {
  pretaaHealthExportPatientList: ExportPatientList_pretaaHealthExportPatientList | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthViewFacility
// ====================================================

export interface PretaaHealthViewFacility_pretaaHealthViewFacility {
  __typename: "Facility";
  name: string;
}

export interface PretaaHealthViewFacility {
  pretaaHealthViewFacility: PretaaHealthViewFacility_pretaaHealthViewFacility | null;
}

export interface PretaaHealthViewFacilityVariables {
  facilityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientListByFacilityId
// ====================================================

export interface PatientListByFacilityId_pretaaHealthFacilityPatients_patientDetails_patientLocation {
  __typename: "PatientLocation";
  locationName: string | null;
}

export interface PatientListByFacilityId_pretaaHealthFacilityPatients_patientDetails {
  __typename: "PatientDetails";
  patientLocation: PatientListByFacilityId_pretaaHealthFacilityPatients_patientDetails_patientLocation | null;
  inPatient: boolean | null;
  dischargeDate: string | null;
}

export interface PatientListByFacilityId_pretaaHealthFacilityPatients_PatientContactList_suppoters {
  __typename: "User";
  firstName: string | null;
}

export interface PatientListByFacilityId_pretaaHealthFacilityPatients_PatientContactList_patientContacts {
  __typename: "PatientContacts";
  fullName: string | null;
}

export interface PatientListByFacilityId_pretaaHealthFacilityPatients_PatientContactList {
  __typename: "PatientContactList";
  suppoters: PatientListByFacilityId_pretaaHealthFacilityPatients_PatientContactList_suppoters[] | null;
  patientContacts: PatientListByFacilityId_pretaaHealthFacilityPatients_PatientContactList_patientContacts[] | null;
}

export interface PatientListByFacilityId_pretaaHealthFacilityPatients {
  __typename: "PatientListResponse";
  patientDetails: PatientListByFacilityId_pretaaHealthFacilityPatients_patientDetails | null;
  phone: string | null;
  id: string;
  active: boolean;
  lastName: string | null;
  firstName: string | null;
  email: string;
  invitationStatus: UserInvitationOptions;
  lastLoginTime: string | null;
  PatientContactList: PatientListByFacilityId_pretaaHealthFacilityPatients_PatientContactList | null;
  createdAt: any;
}

export interface PatientListByFacilityId {
  pretaaHealthFacilityPatients: PatientListByFacilityId_pretaaHealthFacilityPatients[];
}

export interface PatientListByFacilityIdVariables {
  facilityId: string;
  userType: FacilityFilterUserTypes;
  take?: number | null;
  skip?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthAdminFacilityStatus
// ====================================================

export interface PretaaHealthAdminFacilityStatus_pretaaHealthAdminFacilityStatus {
  __typename: "Facility";
  isActive: boolean;
}

export interface PretaaHealthAdminFacilityStatus {
  pretaaHealthAdminFacilityStatus: PretaaHealthAdminFacilityStatus_pretaaHealthAdminFacilityStatus;
}

export interface PretaaHealthAdminFacilityStatusVariables {
  facilityId: string;
  facilityStatus: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FacilityUserList
// ====================================================

export interface FacilityUserList_pretaaHealthViewFacility_primaryAdmin {
  __typename: "ViewPrimaryAdminResponse";
  email: string;
  firstName: string | null;
  id: string;
  lastName: string | null;
}

export interface FacilityUserList_pretaaHealthViewFacility {
  __typename: "Facility";
  primaryAdmin: FacilityUserList_pretaaHealthViewFacility_primaryAdmin | null;
}

export interface FacilityUserList {
  pretaaHealthViewFacility: FacilityUserList_pretaaHealthViewFacility | null;
}

export interface FacilityUserListVariables {
  facilityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthListFacilities
// ====================================================

export interface PretaaHealthListFacilities_pretaaHealthListFacilities_primaryAdmin {
  __typename: "ViewPrimaryAdminResponse";
  email: string;
  id: string;
}

export interface PretaaHealthListFacilities_pretaaHealthListFacilities__count {
  __typename: "FacilityCount";
  locations: number;
}

export interface PretaaHealthListFacilities_pretaaHealthListFacilities {
  __typename: "Facility";
  id: string;
  isActive: boolean;
  name: string;
  startDate: any;
  primaryAdmin: PretaaHealthListFacilities_pretaaHealthListFacilities_primaryAdmin | null;
  _count: PretaaHealthListFacilities_pretaaHealthListFacilities__count | null;
  createdAt: any;
  timeZone: string | null;
}

export interface PretaaHealthListFacilities {
  pretaaHealthListFacilities: PretaaHealthListFacilities_pretaaHealthListFacilities[];
}

export interface PretaaHealthListFacilitiesVariables {
  searchPhrase?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FacilityUserListForSuperAndFacilityAdmin
// ====================================================

export interface FacilityUserListForSuperAndFacilityAdmin_pretaaHealthImpersonationListFacilities_primaryAdmin {
  __typename: "ViewPrimaryAdminResponse";
  id: string;
}

export interface FacilityUserListForSuperAndFacilityAdmin_pretaaHealthImpersonationListFacilities {
  __typename: "ImpersonationFacilities";
  id: string;
  name: string;
  primaryAdmin: FacilityUserListForSuperAndFacilityAdmin_pretaaHealthImpersonationListFacilities_primaryAdmin | null;
}

export interface FacilityUserListForSuperAndFacilityAdmin {
  pretaaHealthImpersonationListFacilities: FacilityUserListForSuperAndFacilityAdmin_pretaaHealthImpersonationListFacilities[];
}

export interface FacilityUserListForSuperAndFacilityAdminVariables {
  take?: number | null;
  getActiveFacility?: boolean | null;
  searchName?: string | null;
  skip?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ForgotPassword
// ====================================================

export interface ForgotPassword_pretaaHealthForgotPassword {
  __typename: "ResetPasswordResponse";
  loginToken: string | null;
  refreshToken: string | null;
  message: string;
}

export interface ForgotPassword {
  pretaaHealthForgotPassword: ForgotPassword_pretaaHealthForgotPassword;
}

export interface ForgotPasswordVariables {
  forgotPwToken: string;
  newPassword: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthForgotPasswordLink
// ====================================================

export interface PretaaHealthForgotPasswordLink {
  pretaaHealthForgotPasswordLink: string;
}

export interface PretaaHealthForgotPasswordLinkVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminForgotPasswordLink
// ====================================================

export interface AdminForgotPasswordLink {
  pretaaHealthAdminForgotPasswordLink: string;
}

export interface AdminForgotPasswordLinkVariables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGeneralPopulationPatientList
// ====================================================

export interface GetGeneralPopulationPatientList_pretaaHealthGetGeneralPopulationPatientList {
  __typename: "GeneralPopulationPatientResponse";
  columns: any[] | null;
  listData: any[] | null;
}

export interface GetGeneralPopulationPatientList {
  pretaaHealthGetGeneralPopulationPatientList: GetGeneralPopulationPatientList_pretaaHealthGetGeneralPopulationPatientList;
}

export interface GetGeneralPopulationPatientListVariables {
  skip?: number | null;
  take?: number | null;
  filterMonthNDate?: ReportingDateFilter | null;
  filterUsers?: RepotingClinicianUsers[] | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  templateCodes?: SurveyTemplateCodes[] | null;
  careTeamType?: CareTeamTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GeoFencesMapListForPatient
// ====================================================

export interface GeoFencesMapListForPatient_pretaaHealthListGeoFences {
  __typename: "GeoFencing";
  id: string;
  name: string;
  location: string;
  type: GeoFencingTypes;
  status: boolean;
  latitude: number;
  longitude: number;
  radius: number;
  patientId: string | null;
}

export interface GeoFencesMapListForPatient_pretaaHealthGetGeoFencesByPatientId_patientFences {
  __typename: "GeoFencing";
  id: string;
  name: string;
  location: string;
  type: GeoFencingTypes;
  status: boolean;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GeoFencesMapListForPatient_pretaaHealthGetGeoFencesByPatientId {
  __typename: "GeoFencesByPatientIdResponse";
  patientFences: GeoFencesMapListForPatient_pretaaHealthGetGeoFencesByPatientId_patientFences[];
}

export interface GeoFencesMapListForPatient {
  pretaaHealthListGeoFences: GeoFencesMapListForPatient_pretaaHealthListGeoFences[] | null;
  pretaaHealthGetGeoFencesByPatientId: GeoFencesMapListForPatient_pretaaHealthGetGeoFencesByPatientId | null;
}

export interface GeoFencesMapListForPatientVariables {
  take?: number | null;
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListGeoFences
// ====================================================

export interface ListGeoFences_pretaaHealthListGeoFences_facility {
  __typename: "FacilityResponse";
  id: string;
  name: string;
}

export interface ListGeoFences_pretaaHealthListGeoFences {
  __typename: "GeoFencing";
  id: string;
  name: string;
  location: string;
  type: GeoFencingTypes;
  status: boolean;
  latitude: number;
  longitude: number;
  radius: number;
  patientId: string | null;
  canEdit: boolean | null;
  facility: ListGeoFences_pretaaHealthListGeoFences_facility | null;
}

export interface ListGeoFences {
  pretaaHealthListGeoFences: ListGeoFences_pretaaHealthListGeoFences[] | null;
}

export interface ListGeoFencesVariables {
  searchPhrase?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGeoFencesByPatientId
// ====================================================

export interface GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences_facility {
  __typename: "FacilityResponse";
  name: string;
}

export interface GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences {
  __typename: "GeoFencing";
  id: string;
  name: string;
  location: string;
  type: GeoFencingTypes;
  status: boolean;
  latitude: number;
  longitude: number;
  radius: number;
  canEdit: boolean | null;
  facility: GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences_facility | null;
}

export interface GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId {
  __typename: "GeoFencesByPatientIdResponse";
  patientFences: GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences[];
}

export interface GetGeoFencesByPatientId {
  pretaaHealthGetGeoFencesByPatientId: GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId | null;
}

export interface GetGeoFencesByPatientIdVariables {
  patientId: string;
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthRemoveGeoFence
// ====================================================

export interface PretaaHealthRemoveGeoFence_pretaaHealthRemoveGeoFence {
  __typename: "GeoFencing";
  id: string;
}

export interface PretaaHealthRemoveGeoFence {
  pretaaHealthRemoveGeoFence: PretaaHealthRemoveGeoFence_pretaaHealthRemoveGeoFence;
}

export interface PretaaHealthRemoveGeoFenceVariables {
  fenceId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFacilityId
// ====================================================

export interface GetFacilityId_pretaaHealthCurrentUser_employeeMeta_facilities_sourceSystem {
  __typename: "SourceSystemMeta";
  slug: string;
}

export interface GetFacilityId_pretaaHealthCurrentUser_employeeMeta_facilities {
  __typename: "FacilitiesMeta";
  fitbitIdField: string | null;
  sourceSystem: GetFacilityId_pretaaHealthCurrentUser_employeeMeta_facilities_sourceSystem;
  name: string;
}

export interface GetFacilityId_pretaaHealthCurrentUser_employeeMeta {
  __typename: "EmployeeMetaResponse";
  facilities: GetFacilityId_pretaaHealthCurrentUser_employeeMeta_facilities[] | null;
}

export interface GetFacilityId_pretaaHealthCurrentUser {
  __typename: "User";
  employeeMeta: GetFacilityId_pretaaHealthCurrentUser_employeeMeta | null;
}

export interface GetFacilityId {
  pretaaHealthCurrentUser: GetFacilityId_pretaaHealthCurrentUser;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNote
// ====================================================

export interface GetNote_pretaaHealthGetNote {
  __typename: "Note";
  eventId: string | null;
  canModify: boolean | null;
  id: string;
  readAt: any | null;
  subject: string;
  text: string;
  updatedAt: any | null;
  createdBy: string | null;
  createdAt: any;
  creator: string | null;
  isUpdated: boolean;
  patientId: string | null;
}

export interface GetNote {
  pretaaHealthGetNote: GetNote_pretaaHealthGetNote | null;
}

export interface GetNoteVariables {
  noteId: string;
  eventId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientName
// ====================================================

export interface PatientName_pretaaHealthPatientDetails {
  __typename: "User";
  lastName: string | null;
  firstName: string | null;
  id: string;
}

export interface PatientName {
  pretaaHealthPatientDetails: PatientName_pretaaHealthPatientDetails;
}

export interface PatientNameVariables {
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSourceSystemId
// ====================================================

export interface GetSourceSystemId_pretaaHealthViewFacility {
  __typename: "Facility";
  sourceSystemId: string | null;
}

export interface GetSourceSystemId {
  pretaaHealthViewFacility: GetSourceSystemId_pretaaHealthViewFacility | null;
}

export interface GetSourceSystemIdVariables {
  facilityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAdHocSurveyForCounsellors
// ====================================================

export interface GetAdHocSurveyForCounsellors_pretaaHealthGetAdHocSurveyForCounsellors_surveyReceipientList {
  __typename: "SurveyReceipientPatientsResponse";
  patientFulltName: string | null;
  patientFirstName: string | null;
  patientId: string;
  surveyId: string;
  patientLasttName: string | null;
}

export interface GetAdHocSurveyForCounsellors_pretaaHealthGetAdHocSurveyForCounsellors {
  __typename: "AdhocSurveyResponse";
  published: boolean;
  publishedAt: any | null;
  scheduledAt: any | null;
  campaignSurveySignature: boolean;
  surveyReceipientList: GetAdHocSurveyForCounsellors_pretaaHealthGetAdHocSurveyForCounsellors_surveyReceipientList[] | null;
  surveyId: string;
}

export interface GetAdHocSurveyForCounsellors {
  pretaaHealthGetAdHocSurveyForCounsellors: GetAdHocSurveyForCounsellors_pretaaHealthGetAdHocSurveyForCounsellors | null;
}

export interface GetAdHocSurveyForCounsellorsVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminGetSourceSystemById
// ====================================================

export interface AdminGetSourceSystemById_pretaaHealthAdminGetSourceSystemById_staticFields {
  __typename: "StaticFields";
  facilityName: boolean;
  timezone: boolean;
}

export interface AdminGetSourceSystemById_pretaaHealthAdminGetSourceSystemById {
  __typename: "SourceSystemListResponse";
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  staticFields: AdminGetSourceSystemById_pretaaHealthAdminGetSourceSystemById_staticFields | null;
}

export interface AdminGetSourceSystemById {
  pretaaHealthAdminGetSourceSystemById: AdminGetSourceSystemById_pretaaHealthAdminGetSourceSystemById;
}

export interface AdminGetSourceSystemByIdVariables {
  sourceSystemId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllCareTeamType
// ====================================================

export interface GetAllCareTeamType_pretaaHealthGetAllCareTeamType {
  __typename: "CareTeamtypeResponse";
  enumType: CareTeamTypes;
  defaultValue: string;
  updatedValue: string | null;
  description: string;
}

export interface GetAllCareTeamType {
  pretaaHealthGetAllCareTeamType: GetAllCareTeamType_pretaaHealthGetAllCareTeamType[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAnomaliesPatientListReport
// ====================================================

export interface GetAnomaliesPatientListReport_pretaaHealthGetAnomaliesPatientListReport {
  __typename: "AnomaliesPatientListResponse";
  daydiff: number;
  id: string;
  scale: number;
  name: string | null;
  heartAnomaly: number | null;
  spo2Anomaly: number | null;
  sleepAnomaly: number | null;
  hrvAnomaly: number | null;
  tempAnomaly: number | null;
  primaryTherapist: string | null;
  caseManager: string | null;
  dischargeDate: string | null;
  intakeDate: string | null;
  facilityName: string | null;
}

export interface GetAnomaliesPatientListReport {
  pretaaHealthGetAnomaliesPatientListReport: GetAnomaliesPatientListReport_pretaaHealthGetAnomaliesPatientListReport[] | null;
}

export interface GetAnomaliesPatientListReportVariables {
  skip?: number | null;
  take?: number | null;
  all?: boolean | null;
  rangeEndDate?: string | null;
  rangeStartDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssessmentPatientListByDate
// ====================================================

export interface GetAssessmentPatientListByDate_pretaaHealthGetPatientListByDate {
  __typename: "PatientListByDateResponse";
  id: string;
  name: string;
}

export interface GetAssessmentPatientListByDate {
  pretaaHealthGetPatientListByDate: GetAssessmentPatientListByDate_pretaaHealthGetPatientListByDate[];
}

export interface GetAssessmentPatientListByDateVariables {
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  searchText?: string | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssessmentReportSummaryCounts
// ====================================================

export interface GetAssessmentReportSummaryCounts_pretaaHealthGetAssessmentReportSummaryCounts {
  __typename: "AssessmentReportSummaryCountsResponse";
  name: string;
  count: number;
}

export interface GetAssessmentReportSummaryCounts {
  pretaaHealthGetAssessmentReportSummaryCounts: GetAssessmentReportSummaryCounts_pretaaHealthGetAssessmentReportSummaryCounts[];
}

export interface GetAssessmentReportSummaryCountsVariables {
  all: boolean;
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssessmentsOverviewChart
// ====================================================

export interface GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_legends {
  __typename: "OverviewChartKeyValue";
  key: string;
  value: string | null;
}

export interface GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_completed {
  __typename: "OverviewChartKeyValue";
  key: string;
  value: string | null;
  count: string | null;
}

export interface GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_incomplete {
  __typename: "OverviewChartKeyValue";
  key: string;
  value: string | null;
  count: string | null;
}

export interface GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment {
  __typename: "OverviewChartAssignmentResponse";
  completed: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_completed[] | null;
  incomplete: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_incomplete[] | null;
}

export interface GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data {
  __typename: "OverviewChartCompleteIncompleteResponse";
  assignment: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment;
  label: string | null;
}

export interface GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart {
  __typename: "AssessmentPatientOverviewsChartResponse";
  legends: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_legends[] | null;
  data: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data[] | null;
}

export interface GetAssessmentsOverviewChart {
  pretaaHealthGetAssessmentsOverviewChart: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart | null;
}

export interface GetAssessmentsOverviewChartVariables {
  all: boolean;
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssessmentStatsExcelDownload
// ====================================================

export interface AssessmentStatsExcelDownload {
  pretaaHealthDownloadAssessmentReport: any | null;
}

export interface AssessmentStatsExcelDownloadVariables {
  all: boolean;
  code: string;
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
  patients?: AssessmentReportingPatientsIds[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssessmentReportingPatientStats
// ====================================================

export interface GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats_rows_data_percent {
  __typename: "AssignmentTemplatesstatsForPatientsPercentColumnResponse";
  value: string | null;
  direction: string | null;
  color: string | null;
}

export interface GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats_rows_data {
  __typename: "AssignmentTemplatesDataStatsForPatientsColumnResponse";
  description: string | null;
  percent: GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats_rows_data_percent | null;
  value: string | null;
  assessmentNumber: string | null;
}

export interface GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats_rows {
  __typename: "AssignmentTemplatesStatsForPatientsColumnResponse";
  data: GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats_rows_data[] | null;
  patientId: string | null;
  ID: string | null;
}

export interface GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats {
  __typename: "AssessmentReportTemplatePatientResponse";
  rows: GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats_rows[] | null;
  code: string | null;
  headers: string[] | null;
}

export interface GetAssessmentReportingPatientStats {
  pretaaHealthGetAssessmentReportingPatientStats: GetAssessmentReportingPatientStats_pretaaHealthGetAssessmentReportingPatientStats;
}

export interface GetAssessmentReportingPatientStatsVariables {
  all: boolean;
  code: string;
  filterMonthNDate?: ReportingDateFilter | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  rangeEndDate?: string | null;
  rangeStartDate?: string | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssessmentTemplateCharts
// ====================================================

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartTopLeftScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartTopRightScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartBotomRightScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartBotomLeftScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart {
  __typename: "TemplateChartFormatResponse";
  chartTopLeftScale: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartTopLeftScale;
  chartTopRightScale: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartTopRightScale;
  chartBotomRightScale: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartBotomRightScale;
  chartBotomLeftScale: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart_chartBotomLeftScale;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_legends {
  __typename: "TemplateLegendsFormatResponse";
  key: string;
  value: string;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_data {
  __typename: "TemplateChartDataResponse";
  label: string | null;
  assignment: any;
}

export interface GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts {
  __typename: "AssessmentReportTemplateChartsResponse";
  code: string | null;
  chart: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_chart;
  legends: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_legends[];
  data: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts_data[] | null;
  resultText: string | null;
}

export interface GetAssessmentTemplateCharts {
  pretaaHealthGetAssessmentTemplateCharts: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts;
}

export interface GetAssessmentTemplateChartsVariables {
  all: boolean;
  code: string;
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBiometricScoreSinglePatientsReport
// ====================================================

export interface GetBiometricScoreSinglePatientsReport_pretaaHealthGetBiometricScoreSinglePatientsReport {
  __typename: "BiometricScoreSinglePatientsResponse";
  patientId: string;
  scale: number;
}

export interface GetBiometricScoreSinglePatientsReport {
  pretaaHealthGetBiometricScoreSinglePatientsReport: GetBiometricScoreSinglePatientsReport_pretaaHealthGetBiometricScoreSinglePatientsReport[];
}

export interface GetBiometricScoreSinglePatientsReportVariables {
  filterUsers?: RepotingPatientUsers[] | null;
  all?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCampaignListByTemplateId
// ====================================================

export interface GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys_facility {
  __typename: "FacilityResponse";
  name: string;
}

export interface GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys {
  __typename: "Survey";
  id: string;
  createdAt: any;
  campaignSurveyFrequencyType: string | null;
  campaignSurveyEndDate: any | null;
  createdBy: string | null;
  title: string;
  pause: boolean;
  campaignSurveyFrequencyCustomData: number | null;
  publishedAt: any | null;
  published: boolean;
  campaignRecurringOccurenceType: RecurringOccurenceType | null;
  surveyCountPerParticipantType: SurveyCountPerParticipantType | null;
  triggerType: string | null;
  surveyEventType: string | null;
  startDate: any | null;
  facility: GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys_facility | null;
  scheduledHourAt: number;
  scheduledMinAt: number;
  currentStatus: SurveyStatusType;
}

export interface GetCampaignListByTemplateId {
  pretaaHealthGetAllCampaignSurveys: GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys[];
}

export interface GetCampaignListByTemplateIdVariables {
  surveyTemplateId: string;
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
  surveyCountPerParticipantType: SurveyCountPerParticipantType;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCareTeamQuery
// ====================================================

export interface GetCareTeamQuery_pretaaHealthEHRGetCareTeamMemberDetails_user_userRole {
  __typename: "UserRoleFieldResponse";
  name: string;
}

export interface GetCareTeamQuery_pretaaHealthEHRGetCareTeamMemberDetails_user {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  email: string;
  status: boolean;
  active: boolean;
  mobilePhone: string | null;
  createdAt: any;
  lastLoginTime: any | null;
  userRole: GetCareTeamQuery_pretaaHealthEHRGetCareTeamMemberDetails_user_userRole | null;
  id: string;
}

export interface GetCareTeamQuery_pretaaHealthEHRGetCareTeamMemberDetails {
  __typename: "PatientCareTeamResponse";
  id: string | null;
  user: GetCareTeamQuery_pretaaHealthEHRGetCareTeamMemberDetails_user | null;
  careTeamTypes: string[] | null;
}

export interface GetCareTeamQuery {
  pretaaHealthEHRGetCareTeamMemberDetails: GetCareTeamQuery_pretaaHealthEHRGetCareTeamMemberDetails;
}

export interface GetCareTeamQueryVariables {
  careTeamId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EHRSearchCareTeams
// ====================================================

export interface EHRSearchCareTeams_pretaaHealthEHRSearchCareTeams_sourceSystem {
  __typename: "sourceSystemResponse";
  name: string | null;
}

export interface EHRSearchCareTeams_pretaaHealthEHRSearchCareTeams {
  __typename: "CareTeamResponse";
  active: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  id: string | null;
  userId: string | null;
  invitationStatus: UserInvitationOptions;
  lastLogin: any | null;
  sourceSystem: EHRSearchCareTeams_pretaaHealthEHRSearchCareTeams_sourceSystem | null;
}

export interface EHRSearchCareTeams {
  pretaaHealthEHRSearchCareTeams: EHRSearchCareTeams_pretaaHealthEHRSearchCareTeams[];
}

export interface EHRSearchCareTeamsVariables {
  take?: number | null;
  skip?: number | null;
  searchPhrase?: string | null;
  orderBy?: string | null;
  order?: OrderType | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCareTeamListByType
// ====================================================

export interface GetCareTeamListByType_pretaaHealthGetCareTeamListByType {
  __typename: "careTeamListByTypeResponse";
  firstName: string | null;
  lastName: string | null;
  userId: string;
  email: string;
}

export interface GetCareTeamListByType {
  pretaaHealthGetCareTeamListByType: GetCareTeamListByType_pretaaHealthGetCareTeamListByType[] | null;
}

export interface GetCareTeamListByTypeVariables {
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
  careTeamType?: CareTeamTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListCareTeamsForPatient
// ====================================================

export interface ListCareTeamsForPatient_pretaaHealthListCareTeams_sourceSystem {
  __typename: "sourceSystemResponse";
  name: string | null;
}

export interface ListCareTeamsForPatient_pretaaHealthListCareTeams {
  __typename: "CareTeamResponse";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  id: string | null;
  userId: string | null;
  sourceSystem: ListCareTeamsForPatient_pretaaHealthListCareTeams_sourceSystem | null;
}

export interface ListCareTeamsForPatient {
  pretaaHealthListCareTeams: ListCareTeamsForPatient_pretaaHealthListCareTeams[];
}

export interface ListCareTeamsForPatientVariables {
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CareTeamListWithTypes
// ====================================================

export interface CareTeamListWithTypes_pretaaHealthCareTeamListWithTypes {
  __typename: "CareTeamListWithTypeResponse";
  careTeamDetailsToCareTeamTypes: string[];
  firstName: string | null;
  id: string;
  lastName: string | null;
}

export interface CareTeamListWithTypes {
  pretaaHealthCareTeamListWithTypes: CareTeamListWithTypes_pretaaHealthCareTeamListWithTypes[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCareTeamTypesList
// ====================================================

export interface GetCareTeamTypesList_pretaaHealthGetCareTeamTypesList {
  __typename: "careTeamTypeListResponse";
  name: string;
  value: string;
}

export interface GetCareTeamTypesList {
  pretaaHealthGetCareTeamTypesList: GetCareTeamTypesList_pretaaHealthGetCareTeamTypesList[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAgGridColumn
// ====================================================

export interface GetAgGridColumn_pretaaHealthGetAgGridColumn {
  __typename: "PatientListColumnManagement";
  columnList: any;
}

export interface GetAgGridColumn {
  pretaaHealthGetAgGridColumn: GetAgGridColumn_pretaaHealthGetAgGridColumn | null;
}

export interface GetAgGridColumnVariables {
  agGridListType: AgGridListTypes;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetComparisonCliniciansReport
// ====================================================

export interface GetComparisonCliniciansReport_pretaaHealthGetComparasionCliniciansReport_columns {
  __typename: "ComparasionCliniciansColumns";
  key: string;
  label: string;
}

export interface GetComparisonCliniciansReport_pretaaHealthGetComparasionCliniciansReport {
  __typename: "ComparasionCliniciansReportingResponse";
  columns: GetComparisonCliniciansReport_pretaaHealthGetComparasionCliniciansReport_columns[] | null;
  result: any[] | null;
}

export interface GetComparisonCliniciansReport {
  pretaaHealthGetComparasionCliniciansReport: GetComparisonCliniciansReport_pretaaHealthGetComparasionCliniciansReport;
}

export interface GetComparisonCliniciansReportVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  filterMonthNDate?: ReportingDateFilter | null;
  filterUsers?: RepotingClinicianUsers[] | null;
  careTeamType?: CareTeamTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDayMonthRangeFilterList
// ====================================================

export interface GetDayMonthRangeFilterList_pretaaHealthGetDayMonthRangeFilterList {
  __typename: "DayMonthRangeFilterListResponse";
  name: string;
  value: string;
}

export interface GetDayMonthRangeFilterList {
  pretaaHealthGetDayMonthRangeFilterList: GetDayMonthRangeFilterList_pretaaHealthGetDayMonthRangeFilterList[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDayWiseAnomaliesReport
// ====================================================

export interface GetDayWiseAnomaliesReport_pretaaHealthGetDayWiseAnomaliesReport {
  __typename: "DayWiseAnomaliesResponse";
  label: string;
  heart_anomaly: number;
  hrv_anomaly: number;
  sleep_anomaly: number;
  spo2_anomaly: number;
  temp_anomaly: number;
}

export interface GetDayWiseAnomaliesReport {
  pretaaHealthGetDayWiseAnomaliesReport: GetDayWiseAnomaliesReport_pretaaHealthGetDayWiseAnomaliesReport[];
}

export interface GetDayWiseAnomaliesReportVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthDownloadReportPdf
// ====================================================

export interface PretaaHealthDownloadReportPdf {
  pretaaHealthDownloadReportPdf: string;
}

export interface PretaaHealthDownloadReportPdfVariables {
  eventId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFacilityDirector
// ====================================================

export interface GetFacilityDirector_pretaaHealthGetFacilityDirector {
  __typename: "GetFacilityDirectorsResponse";
  id: string;
  first_name: string;
  last_name: string | null;
  care_team_types: string[] | null;
}

export interface GetFacilityDirector {
  pretaaHealthGetFacilityDirector: GetFacilityDirector_pretaaHealthGetFacilityDirector[];
}

export interface GetFacilityDirectorVariables {
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthGetFenceBreachPatientsReport
// ====================================================

export interface PretaaHealthGetFenceBreachPatientsReport_pretaaHealthGetFenceBreachPatientsReport {
  __typename: "FenceBreachReportPatientsResponse";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  breachCountIn: number;
  breachCountOut: number;
  dischargeDate: string | null;
  intakeDate: string | null;
  facilityName: string | null;
}

export interface PretaaHealthGetFenceBreachPatientsReport {
  pretaaHealthGetFenceBreachPatientsReport: PretaaHealthGetFenceBreachPatientsReport_pretaaHealthGetFenceBreachPatientsReport[] | null;
}

export interface PretaaHealthGetFenceBreachPatientsReportVariables {
  skip?: number | null;
  take?: number | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFenceBreachReport
// ====================================================

export interface GetFenceBreachReport_pretaaHealthGetFenceBreachReport_stats {
  __typename: "FenceBreachReportChartResponse";
  label: string;
  fenceBreachInCount: number;
  fenceBreachOutCount: number;
}

export interface GetFenceBreachReport_pretaaHealthGetFenceBreachReport {
  __typename: "FenceBreachReportResponse";
  stats: GetFenceBreachReport_pretaaHealthGetFenceBreachReport_stats[];
  avgFence: number;
}

export interface GetFenceBreachReport {
  pretaaHealthGetFenceBreachReport: GetFenceBreachReport_pretaaHealthGetFenceBreachReport | null;
}

export interface GetFenceBreachReportVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFirstRespondersList
// ====================================================

export interface GetFirstRespondersList_pretaaHealthGetPatientCareTeams_user_userRoles {
  __typename: "UserRoleFieldResponse";
  name: string;
}

export interface GetFirstRespondersList_pretaaHealthGetPatientCareTeams_user {
  __typename: "User";
  email: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  mobilePhone: string | null;
  id: string;
  userRoles: GetFirstRespondersList_pretaaHealthGetPatientCareTeams_user_userRoles[] | null;
}

export interface GetFirstRespondersList_pretaaHealthGetPatientCareTeams {
  __typename: "PatientCareTeamResponse";
  user: GetFirstRespondersList_pretaaHealthGetPatientCareTeams_user | null;
}

export interface GetFirstRespondersList {
  pretaaHealthGetPatientCareTeams: GetFirstRespondersList_pretaaHealthGetPatientCareTeams[] | null;
}

export interface GetFirstRespondersListVariables {
  patinetId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHealthFilterGeoFences
// ====================================================

export interface GetHealthFilterGeoFences_pretaaHealthFilterGeoFences {
  __typename: "GeoFencingFilterResponse";
  id: string;
  name: string;
  radius: number;
  longitude: number;
  latitude: number;
  location: string;
  facilityId: string | null;
  patientId: string | null;
  type: GeoFencingTypes;
  status: boolean;
  firstName: string | null;
  lastName: string | null;
}

export interface GetHealthFilterGeoFences {
  pretaaHealthFilterGeoFences: GetHealthFilterGeoFences_pretaaHealthFilterGeoFences[] | null;
}

export interface GetHealthFilterGeoFencesVariables {
  all: boolean;
  global: boolean;
  patients: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHealthFilterPatientCoordinates
// ====================================================

export interface GetHealthFilterPatientCoordinates_pretaaHealthFilterPatientCoordinates {
  __typename: "UserLastLocationCoordinates";
  longitude: number;
  latitude: number;
  fenceId: string | null;
  clientTime: any | null;
  deletedAt: any | null;
  createdAt: any;
  userId: string;
  updatedAt: any;
  id: string;
  lastName: string | null;
  firstName: string | null;
  lastLocationAddress: string | null;
}

export interface GetHealthFilterPatientCoordinates {
  pretaaHealthFilterPatientCoordinates: GetHealthFilterPatientCoordinates_pretaaHealthFilterPatientCoordinates[] | null;
}

export interface GetHealthFilterPatientCoordinatesVariables {
  all: boolean;
  patients: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHelplinePatientsReport
// ====================================================

export interface GetHelplinePatientsReport_pretaaHealthGetHelplinePatientsReport {
  __typename: "HelplineReportPatientsResponse";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  HelplineCountCall: number;
  HelplineCountText: number;
  caseManager: string | null;
  primaryTherapist: string | null;
  dischargeDate: string | null;
  intakeDate: string | null;
  facilityName: string | null;
}

export interface GetHelplinePatientsReport {
  pretaaHealthGetHelplinePatientsReport: GetHelplinePatientsReport_pretaaHealthGetHelplinePatientsReport[] | null;
}

export interface GetHelplinePatientsReportVariables {
  all?: boolean | null;
  skip?: number | null;
  take?: number | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHelplineReport
// ====================================================

export interface GetHelplineReport_pretaaHealthGetHelplineReport_stats {
  __typename: "HelplineReportChartResponse";
  label: string;
  helplineTextCount: number;
  helplineCallCount: number;
}

export interface GetHelplineReport_pretaaHealthGetHelplineReport {
  __typename: "HelplineReportResponse";
  stats: GetHelplineReport_pretaaHealthGetHelplineReport_stats[];
  textAvg: number;
  callAvg: number;
}

export interface GetHelplineReport {
  pretaaHealthGetHelplineReport: GetHelplineReport_pretaaHealthGetHelplineReport | null;
}

export interface GetHelplineReportVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMaxMinRangeOfStdTemplate
// ====================================================

export interface GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartTopLeftScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartTopRightScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartBotomLeftScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartBotomRightScale {
  __typename: "MaxMinRange";
  min: number | null;
  max: number | null;
}

export interface GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate {
  __typename: "MaxMinRangeOfStdTemplateResponse";
  code: string;
  chartTopLeftScale: GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartTopLeftScale;
  chartTopRightScale: GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartTopRightScale;
  chartBotomLeftScale: GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartBotomLeftScale;
  chartBotomRightScale: GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate_chartBotomRightScale;
}

export interface GetMaxMinRangeOfStdTemplate {
  pretaaHealthGetMaxMinRangeOfStdTemplate: GetMaxMinRangeOfStdTemplate_pretaaHealthGetMaxMinRangeOfStdTemplate | null;
}

export interface GetMaxMinRangeOfStdTemplateVariables {
  surveyAssignId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMultipleCampaignSurveyList
// ====================================================

export interface GetMultipleCampaignSurveyList_pretaaHealthGetMultipleCampaignSurveyList {
  __typename: "MultipleSurveyObjectResponse";
  date: string | null;
  surveyAssignmentId: string | null;
  surveyId: string | null;
  data: any[] | null;
  protectiveFactors: string | null;
  radinessScore: string | null;
  riskFactors: string | null;
  usageFactors: string | null;
}

export interface GetMultipleCampaignSurveyList_pretaaHealthGetPhqGad7StatsDescription {
  __typename: "PhqGad7StatsResponse";
  description: any | null;
}

export interface GetMultipleCampaignSurveyList {
  pretaaHealthGetMultipleCampaignSurveyList: GetMultipleCampaignSurveyList_pretaaHealthGetMultipleCampaignSurveyList[];
  pretaaHealthGetPhqGad7StatsDescription: GetMultipleCampaignSurveyList_pretaaHealthGetPhqGad7StatsDescription;
}

export interface GetMultipleCampaignSurveyListVariables {
  campaignSurveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssessmentsOverviewPatientsAssessment
// ====================================================

export interface GetAssessmentsOverviewPatientsAssessment_pretaaHealthGetAssessmentsOverviewPatientsAssessment {
  __typename: "AssessmentsOverviewForIndividualPatientsAssessmentResponse";
  anomaliesReportCount: number;
  biometricReport: number;
  geofenceBreachsReportCount: number;
  helpLineContactedReportCount: number;
}

export interface GetAssessmentsOverviewPatientsAssessment {
  pretaaHealthGetAssessmentsOverviewPatientsAssessment: GetAssessmentsOverviewPatientsAssessment_pretaaHealthGetAssessmentsOverviewPatientsAssessment[] | null;
}

export interface GetAssessmentsOverviewPatientsAssessmentVariables {
  filterMonthNDate?: ReportingDateFilter | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  rangeEndDate?: string | null;
  rangeStartDate?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientCoordinates
// ====================================================

export interface GetPatientCoordinates_pretaaHealthGetPatientCoordinates {
  __typename: "UserLastLocation";
  id: string;
  longitude: number;
  latitude: number;
  createdAt: any;
  lastLocationAddress: string | null;
}

export interface GetPatientCoordinates {
  pretaaHealthGetPatientCoordinates: GetPatientCoordinates_pretaaHealthGetPatientCoordinates[];
}

export interface GetPatientCoordinatesVariables {
  patientId: string;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientDetails
// ====================================================

export interface GetPatientDetails_pretaaHealthPatientDetails_patientDetails_patientLocation {
  __typename: "PatientLocation";
  locationName: string | null;
}

export interface GetPatientDetails_pretaaHealthPatientDetails_patientDetails {
  __typename: "PatientDetails";
  phone: string | null;
  bedName: string | null;
  dischargeDate: string | null;
  intakeDate: string | null;
  room: string | null;
  patientLocation: GetPatientDetails_pretaaHealthPatientDetails_patientDetails_patientLocation | null;
  gender: string | null;
  genderIdentity: string | null;
  dob: string | null;
}

export interface GetPatientDetails_pretaaHealthPatientDetails_patientContactList_careTeams {
  __typename: "PatientCareTeam";
  id: string;
  firstName: string | null;
  lastName: string | null;
  careTeamTypes: CareTeamTypes | null;
  isPrimary: boolean;
  fullName: string | null;
  email: string;
  phone: string | null;
}

export interface GetPatientDetails_pretaaHealthPatientDetails_patientContactList_patientContacts {
  __typename: "PatientContacts";
  phone: string | null;
  relationship: string | null;
  id: string;
  address: string | null;
  fullName: string | null;
  email: string | null;
  contactType: ContactTypes;
}

export interface GetPatientDetails_pretaaHealthPatientDetails_patientContactList_suppoters {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
}

export interface GetPatientDetails_pretaaHealthPatientDetails_patientContactList {
  __typename: "PatientContactList";
  careTeams: GetPatientDetails_pretaaHealthPatientDetails_patientContactList_careTeams[] | null;
  patientContacts: GetPatientDetails_pretaaHealthPatientDetails_patientContactList_patientContacts[] | null;
  suppoters: GetPatientDetails_pretaaHealthPatientDetails_patientContactList_suppoters[] | null;
}

export interface GetPatientDetails_pretaaHealthPatientDetails {
  __typename: "User";
  createdAt: any;
  active: boolean;
  lastName: string | null;
  firstName: string | null;
  id: string;
  email: string;
  patientDetails: GetPatientDetails_pretaaHealthPatientDetails_patientDetails | null;
  patientContactList: GetPatientDetails_pretaaHealthPatientDetails_patientContactList | null;
  lastLoginTime: any | null;
  kipuVerified: any | null;
  userInvitationStatus: InvitationStatusType | null;
}

export interface GetPatientDetails {
  pretaaHealthPatientDetails: GetPatientDetails_pretaaHealthPatientDetails;
}

export interface GetPatientDetailsVariables {
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientFieldMetaQuery
// ====================================================

export interface PatientFieldMetaQuery {
  pretaaHealthPatientFieldMeta: any;
}

export interface PatientFieldMetaQueryVariables {
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientListData
// ====================================================

export interface GetPatientListData_pretaaHealthGetPatientsForCounsellor_UserPatientMeta {
  __typename: "UserPatientMeta";
  hidden: boolean;
}

export interface GetPatientListData_pretaaHealthGetPatientsForCounsellor {
  __typename: "PatientListResponseForCounsellor";
  UserPatientMeta: GetPatientListData_pretaaHealthGetPatientsForCounsellor_UserPatientMeta[] | null;
  firstName: string | null;
  id: string;
  lastName: string | null;
  userType: string;
}

export interface GetPatientListData {
  pretaaHealthGetPatientsForCounsellor: GetPatientListData_pretaaHealthGetPatientsForCounsellor[] | null;
}

export interface GetPatientListDataVariables {
  patientFilters?: string[] | null;
  take?: number | null;
  skip?: number | null;
  search?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOnlyNamedPatients
// ====================================================

export interface GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_patientDetails {
  __typename: "PatientDetails";
  inPatient: boolean | null;
  gender: string | null;
  genderIdentity: string | null;
}

export interface GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams {
  __typename: "PatientCareTeam";
  firstName: string | null;
  fullName: string | null;
  lastName: string | null;
}

export interface GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList {
  __typename: "PatientContactList";
  careTeams: GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams[] | null;
}

export interface GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients {
  __typename: "PatientListResponse";
  email: string;
  firstName: string | null;
  id: string;
  active: boolean;
  lastName: string | null;
  userType: string;
  patientDetails: GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_patientDetails | null;
  PatientContactList: GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList | null;
}

export interface GetOnlyNamedPatients {
  pretaaHealthGetOnlyNamedPatients: GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients[] | null;
}

export interface GetOnlyNamedPatientsVariables {
  take?: number | null;
  skip?: number | null;
  search?: string | null;
  patientFilters?: string[] | null;
  inPatient?: boolean | null;
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAdHocSurveysPatientListForCounsellors
// ====================================================

export interface GetAdHocSurveysPatientListForCounsellors_pretaaHealthGetAdHocSurveysPatientListForCounsellors {
  __typename: "SurveyAssignmentPatientsResponse";
  completedAt: any | null;
  patientFulltName: string | null;
  patientId: string;
  score: string | null;
}

export interface GetAdHocSurveysPatientListForCounsellors {
  pretaaHealthGetAdHocSurveysPatientListForCounsellors: GetAdHocSurveysPatientListForCounsellors_pretaaHealthGetAdHocSurveysPatientListForCounsellors[] | null;
}

export interface GetAdHocSurveysPatientListForCounsellorsVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OverviewTemplateStats
// ====================================================

export interface OverviewTemplateStats_pretaaHealthOverviewTemplateStats_rows_data_percent {
  __typename: "AssignmentTemplatesstatsForPatientsPercentColumnResponse";
  color: string | null;
  direction: string | null;
  value: string | null;
}

export interface OverviewTemplateStats_pretaaHealthOverviewTemplateStats_rows_data {
  __typename: "AssignmentTemplatesDataStatsForPatientsColumnResponse";
  assessmentNumber: string | null;
  description: string | null;
  percent: OverviewTemplateStats_pretaaHealthOverviewTemplateStats_rows_data_percent | null;
  value: string | null;
}

export interface OverviewTemplateStats_pretaaHealthOverviewTemplateStats_rows {
  __typename: "AssignmentTemplatesStatsForPatientsColumnResponse";
  data: OverviewTemplateStats_pretaaHealthOverviewTemplateStats_rows_data[] | null;
}

export interface OverviewTemplateStats_pretaaHealthOverviewTemplateStats {
  __typename: "OverviewAssignmentTemplatesStatsColumnResponse";
  headers: string | null;
  rows: OverviewTemplateStats_pretaaHealthOverviewTemplateStats_rows[] | null;
}

export interface OverviewTemplateStats {
  pretaaHealthOverviewTemplateStats: OverviewTemplateStats_pretaaHealthOverviewTemplateStats | null;
}

export interface OverviewTemplateStatsVariables {
  all: boolean;
  filterMonthNDate?: ReportingDateFilter | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  rangeEndDate?: string | null;
  rangeStartDate?: string | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientsForLocations
// ====================================================

export interface GetPatientsForLocations_pretaaHealthGetPatientsForCounsellor {
  __typename: "PatientListResponseForCounsellor";
  firstName: string | null;
  id: string;
  lastName: string | null;
}

export interface GetPatientsForLocations {
  pretaaHealthGetPatientsForCounsellor: GetPatientsForLocations_pretaaHealthGetPatientsForCounsellor[] | null;
}

export interface GetPatientsForLocationsVariables {
  patientFilters?: string[] | null;
  take?: number | null;
  skip?: number | null;
  search?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOnlyNamedPatientsForCampaign
// ====================================================

export interface GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams {
  __typename: "PatientCareTeam";
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
}

export interface GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients_PatientContactList {
  __typename: "PatientContactList";
  careTeams: GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams[] | null;
}

export interface GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients_patientDetails {
  __typename: "PatientDetails";
  inPatient: boolean | null;
  gender: string | null;
  genderIdentity: string | null;
}

export interface GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients {
  __typename: "PatientListResponse";
  PatientContactList: GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients_PatientContactList | null;
  patientDetails: GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients_patientDetails | null;
  firstName: string | null;
  id: string;
  lastName: string | null;
  userType: string;
  email: string;
}

export interface GetOnlyNamedPatientsForCampaign {
  pretaaHealthGetOnlyNamedPatients: GetOnlyNamedPatientsForCampaign_pretaaHealthGetOnlyNamedPatients[] | null;
}

export interface GetOnlyNamedPatientsForCampaignVariables {
  facilityId?: string | null;
  inPatient?: boolean | null;
  patientFilters?: string[] | null;
  search?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientSurveysForCounsellor
// ====================================================

export interface GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor_surveyTemplate {
  __typename: "SurveyTemplateResponse";
  createdAt: any | null;
  description: string | null;
  name: string | null;
  type: string | null;
  id: string | null;
  updatedAt: any | null;
  status: boolean | null;
  title: string | null;
}

export interface GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor {
  __typename: "SurveyListForCounsellorResponse";
  surveyTemplate: GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor_surveyTemplate | null;
  submissionDate: any | null;
  title: string | null;
  scheduledAt: any | null;
  createdAt: any;
  publishedAt: any | null;
  assignmentId: string | null;
}

export interface GetPatientSurveysForCounsellor {
  pretaaHealthGetPatientSurveysForCounsellor: GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor[] | null;
}

export interface GetPatientSurveysForCounsellorVariables {
  patientId: string;
  status: SurveyStatusTypePatient;
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPoorSurveyPatientListReport
// ====================================================

export interface GetPoorSurveyPatientListReport_pretaaHealthGetPoorSurveyPatientListReport {
  __typename: "PoorSurveyPatientListResponse";
  columns: any[] | null;
  listData: any[] | null;
}

export interface GetPoorSurveyPatientListReport {
  pretaaHealthGetPoorSurveyPatientListReport: GetPoorSurveyPatientListReport_pretaaHealthGetPoorSurveyPatientListReport;
}

export interface GetPoorSurveyPatientListReportVariables {
  skip?: number | null;
  take?: number | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPoorSurveyScoresDetailsReport
// ====================================================

export interface GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport_list {
  __typename: "PoorSurveyScoresDetailsListType";
  key: string;
  label: string;
  value: number;
}

export interface GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport_summary {
  __typename: "PoorSurveyScoresDetailsSummaryType";
  templateName: string;
  total: string;
}

export interface GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport {
  __typename: "PoorSurveyScoresDetailsResponse";
  list: GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport_list[] | null;
  summary: GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport_summary | null;
}

export interface GetPoorSurveyScoresDetailsReport {
  pretaaHealthGetPoorSurveyScoresDetailsReport: GetPoorSurveyScoresDetailsReport_pretaaHealthGetPoorSurveyScoresDetailsReport | null;
}

export interface GetPoorSurveyScoresDetailsReportVariables {
  code: string;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPoorSurveyScoresReport
// ====================================================

export interface GetPoorSurveyScoresReport_pretaaHealthGetPoorSurveyScoresReport_list {
  __typename: "PoorSurveyScoresListType";
  template_name: string;
  trigger: number;
  code: string;
}

export interface GetPoorSurveyScoresReport_pretaaHealthGetPoorSurveyScoresReport_summary {
  __typename: "PoorSurveyScoresSummaryType";
  total_trigger: number;
  unique_patient: number;
}

export interface GetPoorSurveyScoresReport_pretaaHealthGetPoorSurveyScoresReport {
  __typename: "PoorSurveyScoresResponse";
  list: GetPoorSurveyScoresReport_pretaaHealthGetPoorSurveyScoresReport_list[] | null;
  summary: GetPoorSurveyScoresReport_pretaaHealthGetPoorSurveyScoresReport_summary | null;
}

export interface GetPoorSurveyScoresReport {
  pretaaHealthGetPoorSurveyScoresReport: GetPoorSurveyScoresReport_pretaaHealthGetPoorSurveyScoresReport;
}

export interface GetPoorSurveyScoresReportVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRelativeDateRangeFilter
// ====================================================

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_YEAR {
  __typename: "RelativeDateRangeFilterOfValue";
  key: string;
  label: string;
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_QUARTER {
  __typename: "RelativeDateRangeFilterOfValue";
  key: string;
  label: string;
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_MONTH {
  __typename: "RelativeDateRangeFilterOfValue";
  key: string;
  label: string;
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_WEEK {
  __typename: "RelativeDateRangeFilterOfValue";
  key: string;
  label: string;
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_DAY {
  __typename: "RelativeDateRangeFilterOfValue";
  key: string;
  label: string;
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf {
  __typename: "RelativeDateRangeFilterOf";
  YEAR: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_YEAR[];
  QUARTER: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_QUARTER[];
  MONTH: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_MONTH[];
  WEEK: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_WEEK[];
  DAY: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf_DAY[];
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterBy {
  __typename: "RelativeDateRangeFilterBy";
  key: DateRangeTypes;
  label: string;
}

export interface GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter {
  __typename: "RelativeDateRangeFilterResponse";
  filterOf: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterOf;
  filterBy: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter_filterBy[];
}

export interface GetRelativeDateRangeFilter {
  pretaaHealthGetRelativeDateRangeFilter: GetRelativeDateRangeFilter_pretaaHealthGetRelativeDateRangeFilter;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSourceSystemPatientFields
// ====================================================

export interface getSourceSystemPatientFields {
  pretaaHealthSourceSystemPatientFields: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStaff
// ====================================================

export interface GetStaff_pretaaHealthGetStaffUser_facilities {
  __typename: "FacilityResponse";
  name: string;
  id: string;
}

export interface GetStaff_pretaaHealthGetStaffUser_roles {
  __typename: "RoleResponse";
  roleSlug: string;
}

export interface GetStaff_pretaaHealthGetStaffUser {
  __typename: "StaffResponse";
  careTeamTypes: string[] | null;
  email: string;
  firstName: string | null;
  facilities: GetStaff_pretaaHealthGetStaffUser_facilities[] | null;
  fullName: string | null;
  id: string;
  lastName: string | null;
  mobilePhone: string | null;
  roles: GetStaff_pretaaHealthGetStaffUser_roles[] | null;
  active: boolean | null;
  lastLoginTime: any | null;
}

export interface GetStaff {
  pretaaHealthGetStaffUser: GetStaff_pretaaHealthGetStaffUser;
}

export interface GetStaffVariables {
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStaffOnlyName
// ====================================================

export interface GetStaffOnlyName_pretaaHealthGetStaffUser_roles {
  __typename: "RoleResponse";
  roleSlug: string;
}

export interface GetStaffOnlyName_pretaaHealthGetStaffUser {
  __typename: "StaffResponse";
  firstName: string | null;
  id: string;
  lastName: string | null;
  roles: GetStaffOnlyName_pretaaHealthGetStaffUser_roles[] | null;
}

export interface GetStaffOnlyName {
  pretaaHealthGetStaffUser: GetStaffOnlyName_pretaaHealthGetStaffUser;
}

export interface GetStaffOnlyNameVariables {
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStandardTemplate
// ====================================================

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_createdby {
  __typename: "CreatedByResponse";
  lastName: string | null;
  firstName: string | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_options {
  __typename: "OptionObject";
  id: string | null;
  label: string | null;
  value: string | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_maxLength {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_minLength {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_patternValidation {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_required {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation {
  __typename: "ValidationProperty";
  conditionalValidation: any | null;
  maxLength: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_maxLength | null;
  minLength: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_minLength | null;
  patternValidation: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_patternValidation | null;
  required: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation_required | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields {
  __typename: "SurveyTemplateFieldObjectResponse";
  id: string | null;
  questionName: string | null;
  parentQuestionName: string | null;
  inputType: string | null;
  label: string | null;
  options: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_options[] | null;
  placeholder: string | null;
  rangeValue: string | null;
  step: string | null;
  validation: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields_validation | null;
}

export interface GetStandardTemplate_pretaaHealthAdminGetTemplate {
  __typename: "AdminSurveyTemplateResponse";
  id: string | null;
  description: string | null;
  title: string | null;
  type: string | null;
  createdAt: any | null;
  updatedAt: any | null;
  createdby: GetStandardTemplate_pretaaHealthAdminGetTemplate_createdby | null;
  surveyTemplateFields: GetStandardTemplate_pretaaHealthAdminGetTemplate_surveyTemplateFields[] | null;
  code: string | null;
  name: string | null;
}

export interface GetStandardTemplate {
  pretaaHealthAdminGetTemplate: GetStandardTemplate_pretaaHealthAdminGetTemplate | null;
}

export interface GetStandardTemplateVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSummariesCountsReport
// ====================================================

export interface GetSummariesCountsReport_pretaaHealthGetSummariesCountsReport {
  __typename: "SummariesCountsResponse";
  name: string;
  value: string;
  count: number;
}

export interface GetSummariesCountsReport {
  pretaaHealthGetSummariesCountsReport: GetSummariesCountsReport_pretaaHealthGetSummariesCountsReport[];
}

export interface GetSummariesCountsReportVariables {
  filterUsers?: RepotingPatientUsers[] | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSurveyHealthReportPdf
// ====================================================

export interface GetSurveyHealthReportPdf {
  pretaaHealthGetSurveyReportPdf: any | null;
}

export interface GetSurveyHealthReportPdfVariables {
  surveyAssignId: string;
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyListForCounsellors
// ====================================================

export interface SurveyListForCounsellors_pretaaHealthSurveyListForCounsellors {
  __typename: "SurveyResponseForCounsellor";
  surveytemplatetitle: string | null;
  surveytemplatename: string | null;
  surveytemplateid: string;
  surveyid: string | null;
  createdat: any;
  issuedat: any;
  patients: number;
  createdbylastname: string | null;
  createdbyid: string;
  createdbyfullname: string | null;
  createdbyfirstname: string | null;
  completepercentage: number | null;
  openpercentage: number | null;
  editable: boolean;
  published: boolean;
  facilityName: string | null;
}

export interface SurveyListForCounsellors {
  pretaaHealthSurveyListForCounsellors: SurveyListForCounsellors_pretaaHealthSurveyListForCounsellors[] | null;
}

export interface SurveyListForCounsellorsVariables {
  surveyTemplateId: string;
  take?: number | null;
  skip?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSurveysForPatient
// ====================================================

export interface GetSurveysForPatient_pretaaHealthGetPatientSurveys_surveyTemplate {
  __typename: "SurveyTemplateResponse";
  name: string | null;
  type: string | null;
  description: string | null;
}

export interface GetSurveysForPatient_pretaaHealthGetPatientSurveys {
  __typename: "SurveyPatientResponse";
  id: string;
  isCompleted: boolean | null;
  scheduledAt: any | null;
  createdAt: any;
  submissionDate: any | null;
  publishedAt: any | null;
  title: string | null;
  surveyTemplate: GetSurveysForPatient_pretaaHealthGetPatientSurveys_surveyTemplate | null;
  surveyId: string | null;
}

export interface GetSurveysForPatient {
  pretaaHealthGetPatientSurveys: GetSurveysForPatient_pretaaHealthGetPatientSurveys[] | null;
}

export interface GetSurveysForPatientVariables {
  skip?: number | null;
  take?: number | null;
  status?: SurveyStatusTypePatient | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSurveyStats
// ====================================================

export interface GetSurveyStats_pretaaHealthGetSurveyStats {
  __typename: "SurveyStatsResponse";
  completePercentage: number;
  createdAt: string;
  openPercentage: number;
  patients: number;
  surveyId: string | null;
}

export interface GetSurveyStats {
  pretaaHealthGetSurveyStats: GetSurveyStats_pretaaHealthGetSurveyStats[] | null;
}

export interface GetSurveyStatsVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSurveyTemplate
// ====================================================

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_options {
  __typename: "OptionObject";
  id: string | null;
  label: string | null;
  value: string | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_maxLength {
  __typename: "ValidationPropertyState";
  active: boolean | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_minLength {
  __typename: "ValidationPropertyState";
  active: boolean | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_patternValidation {
  __typename: "ValidationPropertyState";
  active: boolean | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_required {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation {
  __typename: "ValidationProperty";
  conditionalValidation: any | null;
  maxLength: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_maxLength | null;
  minLength: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_minLength | null;
  patternValidation: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_patternValidation | null;
  required: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation_required | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields {
  __typename: "SurveyTemplateFieldObjectResponse";
  parentQuestionName: string | null;
  questionName: string | null;
  id: string | null;
  inputType: string | null;
  label: string | null;
  rangeValue: string | null;
  step: string | null;
  options: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_options[] | null;
  placeholder: string | null;
  validation: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields_validation | null;
}

export interface GetSurveyTemplate_pretaaHealthGetTemplate {
  __typename: "SurveyTemplateResponse";
  id: string | null;
  title: string | null;
  type: string | null;
  name: string | null;
  description: string | null;
  templateEnableStatus: boolean | null;
  surveyTemplateFields: GetSurveyTemplate_pretaaHealthGetTemplate_surveyTemplateFields[] | null;
}

export interface GetSurveyTemplate {
  pretaaHealthGetTemplate: GetSurveyTemplate_pretaaHealthGetTemplate | null;
}

export interface GetSurveyTemplateVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSurveyTemplateForPatient
// ====================================================

export interface GetSurveyTemplateForPatient_pretaaHealthGetTemplate {
  __typename: "SurveyTemplateResponse";
  title: string | null;
  name: string | null;
  type: string | null;
}

export interface GetSurveyTemplateForPatient {
  pretaaHealthGetTemplate: GetSurveyTemplateForPatient_pretaaHealthGetTemplate | null;
}

export interface GetSurveyTemplateForPatientVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTemplateForCampaign
// ====================================================

export interface GetTemplateForCampaign_pretaaHealthGetTemplate {
  __typename: "SurveyTemplateResponse";
  name: string | null;
  description: string | null;
  id: string | null;
  type: string | null;
}

export interface GetTemplateForCampaign {
  pretaaHealthGetTemplate: GetTemplateForCampaign_pretaaHealthGetTemplate | null;
}

export interface GetTemplateForCampaignVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TemplateForCounsellors
// ====================================================

export interface TemplateForCounsellors_pretaaHealthTemplatesForCounsellors {
  __typename: "SurveyTemplateResponse";
  name: string | null;
  topic: string | null;
  totalCampaignCount: number;
  title: string | null;
  id: string | null;
  description: string | null;
  facilityName: string | null;
}

export interface TemplateForCounsellors {
  pretaaHealthTemplatesForCounsellors: TemplateForCounsellors_pretaaHealthTemplatesForCounsellors[];
}

export interface TemplateForCounsellorsVariables {
  type: SurveyTemplateTypes;
  take?: number | null;
  skip?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTotalSurveySubmitBySelectedCliniciansReport
// ====================================================

export interface GetTotalSurveySubmitBySelectedCliniciansReport_pretaaHealthGetTotalSurveySubmitBySelectedCliniciansReport {
  __typename: "SurveySubmitListTypeReportingResponse";
  label: string;
  value: number;
}

export interface GetTotalSurveySubmitBySelectedCliniciansReport {
  pretaaHealthGetTotalSurveySubmitBySelectedCliniciansReport: GetTotalSurveySubmitBySelectedCliniciansReport_pretaaHealthGetTotalSurveySubmitBySelectedCliniciansReport[] | null;
}

export interface GetTotalSurveySubmitBySelectedCliniciansReportVariables {
  filterMonthNDate?: ReportingDateFilter | null;
  filterUsers?: ReportingCliniciansUsers[] | null;
  rangeEndDate?: string | null;
  rangeStartDate?: string | null;
  all?: boolean | null;
  careTeamType?: CareTeamTypes | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTypesOfAnomaliesReport
// ====================================================

export interface GetTypesOfAnomaliesReport_pretaaHealthGetTypesOfAnomaliesReport {
  __typename: "TypesOfAnomaliesResponse";
  name: string;
  key: string;
  count: number;
}

export interface GetTypesOfAnomaliesReport {
  pretaaHealthGetTypesOfAnomaliesReport: GetTypesOfAnomaliesReport_pretaaHealthGetTypesOfAnomaliesReport[];
}

export interface GetTypesOfAnomaliesReportVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TimelineFilter
// ====================================================

export interface TimelineFilter {
  pretaaHealthEventFilters: any;
}

export interface TimelineFilterVariables {
  patientId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaAdminImpersonation
// ====================================================

export interface PretaaAdminImpersonation {
  pretaaHealthAdminImpersonation: any;
}

export interface PretaaAdminImpersonationVariables {
  userId: string;
  refreshToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImpersonateFacilityUser
// ====================================================

export interface ImpersonateFacilityUser {
  pretaaHealthImpersonation: any;
}

export interface ImpersonateFacilityUserVariables {
  pretaaHealthImpersonationId: string;
  token: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StopImpersonation
// ====================================================

export interface StopImpersonation {
  pretaaHealthBackImpersonation: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Impersonation
// ====================================================

export interface Impersonation {
  pretaaHealthImpersonation: any;
}

export interface ImpersonationVariables {
  uid: string;
  refreshToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InvitePatients
// ====================================================

export interface InvitePatients {
  pretaaHealthInvitePatients: string;
}

export interface InvitePatientsVariables {
  userIds: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthSubmitSupporter
// ====================================================

export interface PretaaHealthSubmitSupporter {
  pretaaHealthSubmitSupporter: string;
}

export interface PretaaHealthSubmitSupporterVariables {
  email: string;
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListStaff
// ====================================================

export interface ListStaff_pretaaHealthListStaffUser {
  __typename: "StaffListResponse";
  mobilePhone: string | null;
  lastName: string | null;
  lastLoginTime: any | null;
  id: string;
  firstName: string | null;
  email: string | null;
  editable: boolean | null;
  active: boolean | null;
  ehrType: SourceSystemTypes | null;
  invitationStatus: UserInvitationOptions | null;
  fullName: string | null;
  facilityName: string | null;
}

export interface ListStaff {
  pretaaHealthListStaffUser: ListStaff_pretaaHealthListStaffUser[];
}

export interface ListStaffVariables {
  userType: UserStaffTypes;
  search?: string | null;
  take?: number | null;
  skip?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NoteCreate
// ====================================================

export interface NoteCreate_pretaaHealthNoteCreate {
  __typename: "Note";
  id: string;
  text: string;
  subject: string;
  createdBy: string | null;
  updatedAt: any | null;
  createdAt: any;
  eventId: string | null;
  readAt: any | null;
  canModify: boolean | null;
}

export interface NoteCreate {
  pretaaHealthNoteCreate: NoteCreate_pretaaHealthNoteCreate;
}

export interface NoteCreateVariables {
  subject: string;
  text: string;
  patientId?: string | null;
  eventId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NoteDelete
// ====================================================

export interface NoteDelete_pretaaHealthNoteDelete {
  __typename: "Note";
  deletedAt: any | null;
}

export interface NoteDelete {
  pretaaHealthNoteDelete: NoteDelete_pretaaHealthNoteDelete;
}

export interface NoteDeleteVariables {
  pretaaHealthNoteDeleteId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FilteredNotes
// ====================================================

export interface FilteredNotes_pretaaHealthGetFilteredNotes {
  __typename: "Note";
  id: string;
  createdBy: string | null;
  text: string;
  subject: string;
  eventId: string | null;
  createdAt: any;
  canModify: boolean | null;
  patientId: string | null;
  readAt: any | null;
  updatedAt: any | null;
  isUpdated: boolean;
}

export interface FilteredNotes {
  pretaaHealthGetFilteredNotes: FilteredNotes_pretaaHealthGetFilteredNotes[];
}

export interface FilteredNotesVariables {
  eventId?: string | null;
  orderBy?: OrderType | null;
  patientId?: string | null;
  searchPhrase?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NoteUpdate
// ====================================================

export interface NoteUpdate_pretaaHealthNoteUpdate {
  __typename: "Note";
  eventId: string | null;
  id: string;
  parentNoteId: string | null;
  subject: string;
  text: string;
  deletedAt: any | null;
}

export interface NoteUpdate {
  pretaaHealthNoteUpdate: NoteUpdate_pretaaHealthNoteUpdate;
}

export interface NoteUpdateVariables {
  pretaaHealthNoteUpdateId: string;
  subject: string;
  text: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PatientOnboard
// ====================================================

export interface PatientOnboard_pretaaHealthPatientOnboard {
  __typename: "LoginResponse";
  loginToken: string | null;
  message: string;
  refreshToken: string | null;
  twoFactorAuthToken: string | null;
  twoFactorAuthentication: string | null;
}

export interface PatientOnboard {
  pretaaHealthPatientOnboard: PatientOnboard_pretaaHealthPatientOnboard;
}

export interface PatientOnboardVariables {
  email: string;
  password: string;
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OwnerChangeTemplateStatus
// ====================================================

export interface OwnerChangeTemplateStatus {
  pretaaHealthAdminChangeTemplateStatus: any;
}

export interface OwnerChangeTemplateStatusVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OwnerCreate
// ====================================================

export interface OwnerCreate_pretaaHealthAdminCreateNewAccount {
  __typename: "Account";
  id: string;
  name: string;
}

export interface OwnerCreate {
  pretaaHealthAdminCreateNewAccount: OwnerCreate_pretaaHealthAdminCreateNewAccount;
}

export interface OwnerCreateVariables {
  name: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OwnerDeleteSurveyTemplate
// ====================================================

export interface OwnerDeleteSurveyTemplate {
  pretaaHealthAdminDeleteSurveyTemplate: any;
}

export interface OwnerDeleteSurveyTemplateVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnerGetTemplates
// ====================================================

export interface OwnerGetTemplates_pretaaHealthAdminGetTemplates {
  __typename: "AdminSurveyTemplateResponse";
  id: string | null;
  name: string | null;
  title: string | null;
  description: string | null;
  status: boolean | null;
}

export interface OwnerGetTemplates {
  pretaaHealthAdminGetTemplates: OwnerGetTemplates_pretaaHealthAdminGetTemplates[];
}

export interface OwnerGetTemplatesVariables {
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ClientListAccounts
// ====================================================

export interface ClientListAccounts_pretaaHealthAdminListAccounts_superAdmin {
  __typename: "ClientUserResponse";
  email: string;
  firstName: string | null;
  id: string;
  lastName: string | null;
}

export interface ClientListAccounts_pretaaHealthAdminListAccounts__count {
  __typename: "ClientCountResponse";
  facilities: number | null;
}

export interface ClientListAccounts_pretaaHealthAdminListAccounts {
  __typename: "ClientResponse";
  id: string;
  name: string | null;
  status: boolean;
  renewalDate: any | null;
  superAdmin: ClientListAccounts_pretaaHealthAdminListAccounts_superAdmin | null;
  _count: ClientListAccounts_pretaaHealthAdminListAccounts__count | null;
}

export interface ClientListAccounts {
  pretaaHealthAdminListAccounts: ClientListAccounts_pretaaHealthAdminListAccounts[];
}

export interface ClientListAccountsVariables {
  searchPhrase?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientListForOpenStats
// ====================================================

export interface PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete_rows_data_percent {
  __typename: "AssignmentTemplatesstatsForPatientsPercentColumnResponse";
  value: string | null;
  direction: string | null;
  color: string | null;
}

export interface PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete_rows_data {
  __typename: "AssignmentTemplatesDataStatsForPatientsColumnResponse";
  assessmentNumber: string | null;
  description: string | null;
  percent: PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete_rows_data_percent | null;
  value: string | null;
}

export interface PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete_rows {
  __typename: "AssignmentTemplatesStatsForPatientsColumnResponse";
  patientId: string | null;
  data: PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete_rows_data[] | null;
  ID: string | null;
}

export interface PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete {
  __typename: "PatientListForTemplatesStatsColumnResponse";
  headers: string[] | null;
  rows: PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete_rows[] | null;
}

export interface PatientListForOpenStats {
  pretaaHealthPatientListForTemplateStatsIncomplete: PatientListForOpenStats_pretaaHealthPatientListForTemplateStatsIncomplete;
}

export interface PatientListForOpenStatsVariables {
  all: boolean;
  assessmentNumber: number;
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  code: StandardTemplate;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientListForTemplateStats
// ====================================================

export interface PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats_rows_data_percent {
  __typename: "AssignmentTemplatesstatsForPatientsPercentColumnResponse";
  value: string | null;
  direction: string | null;
  color: string | null;
}

export interface PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats_rows_data {
  __typename: "AssignmentTemplatesDataStatsForPatientsColumnResponse";
  value: string | null;
  description: string | null;
  percent: PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats_rows_data_percent | null;
  assessmentNumber: string | null;
}

export interface PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats_rows {
  __typename: "AssignmentTemplatesStatsForPatientsColumnResponse";
  data: PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats_rows_data[] | null;
  ID: string | null;
  patientId: string | null;
}

export interface PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats {
  __typename: "PatientListForTemplatesStatsColumnResponse";
  headers: string[] | null;
  rows: PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats_rows[] | null;
}

export interface PatientListForTemplateStats {
  pretaaHealthPatientListForTemplateStats: PatientListForTemplateStats_pretaaHealthPatientListForTemplateStats;
}

export interface PatientListForTemplateStatsVariables {
  all: boolean;
  assessmentNumber: number;
  filterMonthNDate?: ReportingDateFilter | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  patients?: AssessmentReportingPatientsIds[] | null;
  admittanceStatus?: AssessmentPatientsDischargeFilterTypes | null;
  code: StandardTemplate;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientsForAgGrid
// ====================================================

export interface PatientsForAgGrid_pretaaHealthGetPatients_UserPatientMeta {
  __typename: "UserPatientMeta";
  hidden: boolean;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_patientDetails_building {
  __typename: "PatientBuilding";
  address: string | null;
  id: string;
  name: string | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_patientDetails_patientLocation {
  __typename: "PatientLocation";
  locationName: string | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_patientDetails {
  __typename: "PatientDetails";
  phone: string | null;
  inPatient: boolean | null;
  lastLogin: string | null;
  dischargeDate: string | null;
  dob: string | null;
  building: PatientsForAgGrid_pretaaHealthGetPatients_patientDetails_building | null;
  addressCity: string | null;
  addressCountry: string | null;
  addressStreet: string | null;
  addressStreet2: string | null;
  addressZip: string | null;
  admissionDate: string | null;
  dischargeType: string | null;
  firstContactName: string | null;
  referrerName: string | null;
  insuranceCompany: string | null;
  levelOfCare: string | null;
  maidenName: string | null;
  gender: string | null;
  genderIdentity: string | null;
  race: string | null;
  ethnicity: string | null;
  state: string | null;
  patientLocation: PatientsForAgGrid_pretaaHealthGetPatients_patientDetails_patientLocation | null;
  lastSyncTime: any | null;
  lastWeeklyReportAt: any | null;
  lastMonthlyReportAt: any | null;
  lastDailyReportAt: any | null;
  anticipatedDischargeDate: string | null;
  emrSyncTime: any | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList_suppoters {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList_patientContacts {
  __typename: "PatientContacts";
  fullName: string | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList_careTeams {
  __typename: "PatientCareTeam";
  firstName: string | null;
  lastName: string | null;
  id: string;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList {
  __typename: "PatientContactList";
  suppoters: PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList_suppoters[] | null;
  patientContacts: PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList_patientContacts[] | null;
  careTeams: PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList_careTeams[] | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_caseManager {
  __typename: "PatientRequiredCareTeams";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_primaryTherapist {
  __typename: "PatientRequiredCareTeams";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients_facility {
  __typename: "FacilityResponse";
  name: string;
}

export interface PatientsForAgGrid_pretaaHealthGetPatients {
  __typename: "PatientListResponse";
  UserPatientMeta: PatientsForAgGrid_pretaaHealthGetPatients_UserPatientMeta[] | null;
  firstName: string | null;
  id: string;
  lastName: string | null;
  userType: string;
  email: string;
  patientDetails: PatientsForAgGrid_pretaaHealthGetPatients_patientDetails | null;
  PatientContactList: PatientsForAgGrid_pretaaHealthGetPatients_PatientContactList | null;
  invitationStatus: UserInvitationOptions;
  phone: string | null;
  active: boolean;
  lastLoginTime: string | null;
  createdAt: any;
  middleName: string | null;
  trackLocation: BackgoundLocationType | null;
  kipuVerified: any | null;
  caseManager: PatientsForAgGrid_pretaaHealthGetPatients_caseManager | null;
  primaryTherapist: PatientsForAgGrid_pretaaHealthGetPatients_primaryTherapist | null;
  patientTimezone: string | null;
  facility: PatientsForAgGrid_pretaaHealthGetPatients_facility;
}

export interface PatientsForAgGrid {
  pretaaHealthGetPatients: PatientsForAgGrid_pretaaHealthGetPatients[] | null;
}

export interface PatientsForAgGridVariables {
  patientFilters?: string[] | null;
  search?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientName
// ====================================================

export interface GetPatientName_pretaaHealthPatientDetails_userFacilities {
  __typename: "UserFacilityFieldResponse";
  id: string;
  name: string;
}

export interface GetPatientName_pretaaHealthPatientDetails {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  id: string;
  userFacilities: GetPatientName_pretaaHealthPatientDetails_userFacilities[] | null;
}

export interface GetPatientName {
  pretaaHealthPatientDetails: GetPatientName_pretaaHealthPatientDetails;
}

export interface GetPatientNameVariables {
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePatientListForSurvey
// ====================================================

export interface UpdatePatientListForSurvey_pretaaHealthUpdateSurvey {
  __typename: "Survey";
  id: string;
}

export interface UpdatePatientListForSurvey {
  pretaaHealthUpdateSurvey: UpdatePatientListForSurvey_pretaaHealthUpdateSurvey;
}

export interface UpdatePatientListForSurveyVariables {
  surveyId: string;
  assignmentPatientIds?: SurveyAssignmentCreatePatientSetArgs[] | null;
  campaignSurveySignature?: boolean | null;
  sendNow?: boolean | null;
  scheduledAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientContactDetails
// ====================================================

export interface PatientContactDetails_pretaaHealthViewPatientContact {
  __typename: "PatientContacts";
  email: string | null;
  fullName: string | null;
  phone: string | null;
  relationship: string | null;
}

export interface PatientContactDetails {
  pretaaHealthViewPatientContact: PatientContactDetails_pretaaHealthViewPatientContact | null;
}

export interface PatientContactDetailsVariables {
  patientContactId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientDetails
// ====================================================

export interface PatientDetails_pretaaHealthPatientDetails_patientDetails_patientLocation {
  __typename: "PatientLocation";
  locationName: string | null;
}

export interface PatientDetails_pretaaHealthPatientDetails_patientDetails {
  __typename: "PatientDetails";
  phone: string | null;
  dob: string | null;
  bedName: string | null;
  daysSober: string | null;
  diagnosis: string | null;
  dischargeDate: string | null;
  emergencyContact: string | null;
  intakeDate: string | null;
  room: string | null;
  inPatient: boolean | null;
  paymentMethod: string | null;
  paymentMethodCategory: string | null;
  insuranceCompany: string | null;
  lastLogin: string | null;
  patientLocation: PatientDetails_pretaaHealthPatientDetails_patientDetails_patientLocation | null;
  gender: string | null;
  genderIdentity: string | null;
}

export interface PatientDetails_pretaaHealthPatientDetails_patientContactList_careTeams_sourceSystem {
  __typename: "sourceSystemResponse";
  name: string | null;
}

export interface PatientDetails_pretaaHealthPatientDetails_patientContactList_careTeams {
  __typename: "PatientCareTeam";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  sourceSystem: PatientDetails_pretaaHealthPatientDetails_patientContactList_careTeams_sourceSystem | null;
  careTeamTypes: CareTeamTypes | null;
}

export interface PatientDetails_pretaaHealthPatientDetails_patientContactList_patientContacts {
  __typename: "PatientContacts";
  phone: string | null;
  relationship: string | null;
  id: string;
  address: string | null;
  fullName: string | null;
  email: string | null;
  contactType: ContactTypes;
}

export interface PatientDetails_pretaaHealthPatientDetails_patientContactList_suppoters {
  __typename: "User";
  email: string;
  firstName: string | null;
  lastName: string | null;
  id: string;
  mobilePhone: string | null;
}

export interface PatientDetails_pretaaHealthPatientDetails_patientContactList {
  __typename: "PatientContactList";
  careTeams: PatientDetails_pretaaHealthPatientDetails_patientContactList_careTeams[] | null;
  patientContacts: PatientDetails_pretaaHealthPatientDetails_patientContactList_patientContacts[] | null;
  suppoters: PatientDetails_pretaaHealthPatientDetails_patientContactList_suppoters[] | null;
}

export interface PatientDetails_pretaaHealthPatientDetails_userFacilities {
  __typename: "UserFacilityFieldResponse";
  name: string;
}

export interface PatientDetails_pretaaHealthPatientDetails {
  __typename: "User";
  createdAt: any;
  active: boolean;
  lastName: string | null;
  firstName: string | null;
  id: string;
  title: string | null;
  userType: UserTypes;
  workPhone: string | null;
  /**
   * @deprecated
   */
  department: string | null;
  email: string;
  noteCount: number | null;
  timelineCount: number | null;
  patientDetails: PatientDetails_pretaaHealthPatientDetails_patientDetails | null;
  patientContactList: PatientDetails_pretaaHealthPatientDetails_patientContactList | null;
  lastLoginTime: any | null;
  userFacilities: PatientDetails_pretaaHealthPatientDetails_userFacilities[] | null;
}

export interface PatientDetails {
  pretaaHealthPatientDetails: PatientDetails_pretaaHealthPatientDetails;
}

export interface PatientDetailsVariables {
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientDischargeStatusTypes
// ====================================================

export interface PatientDischargeStatusTypes {
  pretaaHealthsPatientDischargeStatusTypes: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: pretaaHealthPatientFilters
// ====================================================

export interface pretaaHealthPatientFilters {
  pretaaHealthPatientFilters: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SubmitSupporterByPatient
// ====================================================

export interface SubmitSupporterByPatient {
  pretaaHealthSubmitSupporterByPatient: string;
}

export interface SubmitSupporterByPatientVariables {
  email: string;
  invitationType: InvitationTypes;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientListForReport
// ====================================================

export interface PatientListForReport_pretaaHealthGetPatientsForCounsellor {
  __typename: "PatientListResponseForCounsellor";
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface PatientListForReport {
  pretaaHealthGetPatientsForCounsellor: PatientListForReport_pretaaHealthGetPatientsForCounsellor[] | null;
}

export interface PatientListForReportVariables {
  patientFilters?: string[] | null;
  search?: string | null;
  skip?: number | null;
  take?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientListForSurvey
// ====================================================

export interface PatientListForSurvey_pretaaHealthGetSurvey_surveyAssignments_patient {
  __typename: "CreatedByResponse";
  email: string;
  id: string;
  lastName: string | null;
  firstName: string | null;
}

export interface PatientListForSurvey_pretaaHealthGetSurvey_surveyAssignments {
  __typename: "SurveyAssignmentOutputs";
  patient: PatientListForSurvey_pretaaHealthGetSurvey_surveyAssignments_patient;
}

export interface PatientListForSurvey_pretaaHealthGetSurvey {
  __typename: "SurveyResponse";
  surveyAssignments: PatientListForSurvey_pretaaHealthGetSurvey_surveyAssignments[] | null;
}

export interface PatientListForSurvey {
  pretaaHealthGetSurvey: PatientListForSurvey_pretaaHealthGetSurvey;
}

export interface PatientListForSurveyVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PatientActiveToggle
// ====================================================

export interface PatientActiveToggle {
  pretaaHealthPatientActiveToggle: any;
}

export interface PatientActiveToggleVariables {
  patinetId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PatientSupporterDelete
// ====================================================

export interface PatientSupporterDelete {
  pretaaHealthPatientSupporterDelete: string;
}

export interface PatientSupporterDeleteVariables {
  supporterId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TogglePatientsVisibility
// ====================================================

export interface TogglePatientsVisibility {
  pretaaHealthTogglePatientsVisibility: string;
}

export interface TogglePatientsVisibilityVariables {
  selectAll: boolean;
  patientsId: string[];
  hidden: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PauseCampaign
// ====================================================

export interface PauseCampaign_pretaaHealthPauseCampaign {
  __typename: "Survey";
  id: string;
  pause: boolean;
}

export interface PauseCampaign {
  pretaaHealthPauseCampaign: PauseCampaign_pretaaHealthPauseCampaign;
}

export interface PauseCampaignVariables {
  surveyId: string;
  campaignStatus: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoorSurveyBarChart
// ====================================================

export interface PoorSurveyBarChart_pretaaHealthGetDayWisePoorSurveyReport_legends {
  __typename: "TemplateLegendsFormat";
  key: string;
  value: string;
}

export interface PoorSurveyBarChart_pretaaHealthGetDayWisePoorSurveyReport {
  __typename: "PoorSurveyDayWiseResponse";
  data: any[] | null;
  legends: PoorSurveyBarChart_pretaaHealthGetDayWisePoorSurveyReport_legends[] | null;
}

export interface PoorSurveyBarChart {
  pretaaHealthGetDayWisePoorSurveyReport: PoorSurveyBarChart_pretaaHealthGetDayWisePoorSurveyReport;
}

export interface PoorSurveyBarChartVariables {
  skip?: number | null;
  take?: number | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaAdminLogin
// ====================================================

export interface PretaaAdminLogin_pretaaHealthAdminLogin {
  __typename: "LoginResponse";
  loginToken: string | null;
  message: string;
  refreshToken: string | null;
  twoFactorAuthToken: string | null;
  twoFactorAuthentication: string | null;
}

export interface PretaaAdminLogin {
  pretaaHealthAdminLogin: PretaaAdminLogin_pretaaHealthAdminLogin;
}

export interface PretaaAdminLoginVariables {
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPretaaAdminUser
// ====================================================

export interface GetPretaaAdminUser_pretaaHealthAdminCurrentUser {
  __typename: "AdminUser";
  createdAt: any;
  email: string;
  id: string;
  forgetPassword: string | null;
  mobilePhone: string | null;
  title: string | null;
}

export interface GetPretaaAdminUser {
  pretaaHealthAdminCurrentUser: GetPretaaAdminUser_pretaaHealthAdminCurrentUser;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegenerateToken
// ====================================================

export interface RegenerateToken {
  pretaaHealthRegenerateRefreshTokens: any;
}

export interface RegenerateTokenVariables {
  refreshToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegenerateOwnerToken
// ====================================================

export interface RegenerateOwnerToken {
  pretaaHealthAdminRegenerateTokens: any;
}

export interface RegenerateOwnerTokenVariables {
  refreshToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RemoveExistingFitbit
// ====================================================

export interface RemoveExistingFitbit_pretaaHealthSetupDuplicateFitbit {
  __typename: "SetupFitbitResponse";
  accessToken: string;
  patinetId: string;
}

export interface RemoveExistingFitbit {
  pretaaHealthSetupDuplicateFitbit: RemoveExistingFitbit_pretaaHealthSetupDuplicateFitbit;
}

export interface RemoveExistingFitbitVariables {
  refreshToken: string;
  accessToken: string;
  fitbitUserId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveFacility
// ====================================================

export interface RemoveFacility_pretaaHealthRemoveFacility {
  __typename: "Facility";
  id: string;
}

export interface RemoveFacility {
  pretaaHealthRemoveFacility: RemoveFacility_pretaaHealthRemoveFacility;
}

export interface RemoveFacilityVariables {
  facilityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReportingEventSearch
// ====================================================

export interface ReportingEventSearch_pretaaHealthReportingEventSearch_userevent {
  __typename: "UserEvents";
  createdAt: any;
  eventId: string;
  flaggedAt: number | null;
  id: number;
  hideAt: any | null;
  readAt: any | null;
  userId: string;
}

export interface ReportingEventSearch_pretaaHealthReportingEventSearch_surveyAssignmentDetails {
  __typename: "SurveyAssignments";
  createdAt: any;
  id: string;
  isCompleted: boolean;
}

export interface ReportingEventSearch_pretaaHealthReportingEventSearch {
  __typename: "Event";
  id: string;
  text: string | null;
  textDetail: string | null;
  createdAt: any;
  type: EventTypes;
  eventAt: any | null;
  consolidated: boolean;
  patientSupporterEventAction: PatientEventActionTypes | null;
  frequency: ReportFrequency;
  patientId: string | null;
  userevent: ReportingEventSearch_pretaaHealthReportingEventSearch_userevent | null;
  surveyAssignmentDetails: ReportingEventSearch_pretaaHealthReportingEventSearch_surveyAssignmentDetails | null;
  surveyAssignmentId: string | null;
}

export interface ReportingEventSearch {
  pretaaHealthReportingEventSearch: ReportingEventSearch_pretaaHealthReportingEventSearch[];
}

export interface ReportingEventSearchVariables {
  searchPhrase?: string | null;
  take?: number | null;
  skip?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  eventType?: EventFilterTypes[] | null;
  rangeEndDate?: string | null;
  rangeStartDate?: string | null;
  lastNumber?: number | null;
  all?: boolean | null;
  selfHarm?: boolean | null;
  patientId?: string | null;
  trigger?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_pretaaHealthResetPassword {
  __typename: "ResetPasswordResponse";
  loginToken: string | null;
  refreshToken: string | null;
}

export interface ResetPassword {
  pretaaHealthResetPassword: ResetPassword_pretaaHealthResetPassword;
}

export interface ResetPasswordVariables {
  newPassword: string;
  oldPassword: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetScheduledSurveys
// ====================================================

export interface GetScheduledSurveys_pretaaHealthGetSurveys_surveyTemplate {
  __typename: "SurveyTemplateResponse";
  id: string | null;
  title: string | null;
  name: string | null;
  type: string | null;
  description: string | null;
}

export interface GetScheduledSurveys_pretaaHealthGetSurveys {
  __typename: "SurveyResponse";
  id: string;
  createdAt: any;
  surveyTemplate: GetScheduledSurveys_pretaaHealthGetSurveys_surveyTemplate | null;
  title: string | null;
  scheduledAt: any | null;
  stats: number | null;
}

export interface GetScheduledSurveys {
  pretaaHealthGetSurveys: GetScheduledSurveys_pretaaHealthGetSurveys[];
}

export interface GetScheduledSurveysVariables {
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
  status?: SurveyStatusTypeFacility | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SelfHarmBarChart
// ====================================================

export interface SelfHarmBarChart_pretaaHealthGetDayWiseSuicidalIdeationReport_list {
  __typename: "DayWiseSuicidalIdeationListType";
  label: string;
  severalDays: string;
  moreThanHalfDays: string;
  nearlyEveryDay: string;
}

export interface SelfHarmBarChart_pretaaHealthGetDayWiseSuicidalIdeationReport {
  __typename: "DayWiseSuicidalIdeationResponse";
  list: SelfHarmBarChart_pretaaHealthGetDayWiseSuicidalIdeationReport_list[] | null;
  avgSeveralDays: number | null;
}

export interface SelfHarmBarChart {
  pretaaHealthGetDayWiseSuicidalIdeationReport: SelfHarmBarChart_pretaaHealthGetDayWiseSuicidalIdeationReport;
}

export interface SelfHarmBarChartVariables {
  filterUsers?: RepotingPatientUsers[] | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  lastNumber?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: selfHarmDoughnutChart
// ====================================================

export interface selfHarmDoughnutChart_pretaaHealthGetTypesOfSuicidalIdeationReport_list {
  __typename: "SuicidalIdeationListType";
  name: string;
  key: string;
  count: number;
}

export interface selfHarmDoughnutChart_pretaaHealthGetTypesOfSuicidalIdeationReport {
  __typename: "TypesOfSuicidalIdeationResponse";
  list: selfHarmDoughnutChart_pretaaHealthGetTypesOfSuicidalIdeationReport_list[] | null;
  total: number | null;
  avgSeveralDays: number | null;
}

export interface selfHarmDoughnutChart {
  pretaaHealthGetTypesOfSuicidalIdeationReport: selfHarmDoughnutChart_pretaaHealthGetTypesOfSuicidalIdeationReport;
}

export interface selfHarmDoughnutChartVariables {
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSurvey
// ====================================================

export interface CreateSurvey_pretaaHealthCreateSurvey__count {
  __typename: "SurveyCount";
  surveyAssignments: number;
  events: number;
  surveyFields: number;
  campaignSurveyGroup: number;
  surveyReminderLog: number;
  SurveyReceipient: number;
}

export interface CreateSurvey_pretaaHealthCreateSurvey {
  __typename: "Survey";
  _count: CreateSurvey_pretaaHealthCreateSurvey__count | null;
  id: string;
}

export interface CreateSurvey {
  pretaaHealthCreateSurvey: CreateSurvey_pretaaHealthCreateSurvey;
}

export interface CreateSurveyVariables {
  surveyTemplateId: string;
  assignmentPatientIds: SurveyAssignmentCreatePatientSetArgs[];
  scheduledAt?: any | null;
  campaignSurveySignature?: boolean | null;
  sendNow?: boolean | null;
  facilityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendOtpStepOne
// ====================================================

export interface SendOtpStepOne {
  pretaaHealthTwoFactorAuthenticationotp: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendOtpStepTwo
// ====================================================

export interface SendOtpStepTwo_pretaaHealthTwoFactorAuthentication {
  __typename: "User";
  twoFactorAuthentication: boolean;
}

export interface SendOtpStepTwo {
  pretaaHealthTwoFactorAuthentication: SendOtpStepTwo_pretaaHealthTwoFactorAuthentication;
}

export interface SendOtpStepTwoVariables {
  otp: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetSupporterStatus
// ====================================================

export interface SetSupporterStatus_pretaaHealthEventTypeResponse {
  __typename: "Event";
  id: string;
  patientSupporterEventAction: PatientEventActionTypes | null;
}

export interface SetSupporterStatus {
  pretaaHealthEventTypeResponse: SetSupporterStatus_pretaaHealthEventTypeResponse;
}

export interface SetSupporterStatusVariables {
  eventAction: PatientEventActionTypes;
  eventId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SetupFitbit
// ====================================================

export interface SetupFitbit_pretaaHealthSetupFitbit_FitbitAccountExistsResponse {
  __typename: "FitbitAccountExistsResponse";
  fitbitUserId: string;
  accountExists: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface SetupFitbit_pretaaHealthSetupFitbit_SetupFitbitResponse {
  __typename: "SetupFitbitResponse";
  accessToken: string;
  patinetId: string;
}

export type SetupFitbit_pretaaHealthSetupFitbit = SetupFitbit_pretaaHealthSetupFitbit_FitbitAccountExistsResponse | SetupFitbit_pretaaHealthSetupFitbit_SetupFitbitResponse;

export interface SetupFitbit {
  pretaaHealthSetupFitbit: SetupFitbit_pretaaHealthSetupFitbit;
}

export interface SetupFitbitVariables {
  authorizationCode: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SingleCampaignSurvey
// ====================================================

export interface SingleCampaignSurvey_pretaaHealthGetCampaignSurvey_surveyGroup {
  __typename: "CampaignSurveyGroup";
  groupName: string;
}

export interface SingleCampaignSurvey_pretaaHealthGetCampaignSurvey_surveyRecipients {
  __typename: "SurveyRecipientResponse";
  userId: string | null;
  id: string | null;
  recipientsFirstName: string | null;
  recipientsLastName: string | null;
}

export interface SingleCampaignSurvey_pretaaHealthGetCampaignSurvey {
  __typename: "Survey";
  campaignSurveyCompletionDay: string | null;
  campaignSurveyEndDate: any | null;
  campaignSurveyFrequencyCustomData: number | null;
  campaignSurveyFrequencyType: string | null;
  campaignSurveySignature: boolean;
  delayOfDays: number | null;
  delay: boolean;
  deletedAt: any | null;
  facilityId: string;
  id: string;
  scheduledAt: any | null;
  publishedAt: any | null;
  published: boolean;
  stats: number;
  surveyGroup: SingleCampaignSurvey_pretaaHealthGetCampaignSurvey_surveyGroup[] | null;
  surveyTemplateId: string;
  surveyType: SurveyType;
  title: string;
  startDate: any | null;
  surveyCountPerParticipantType: SurveyCountPerParticipantType | null;
  triggerType: string | null;
  surveyRecipients: SingleCampaignSurvey_pretaaHealthGetCampaignSurvey_surveyRecipients[] | null;
  surveyAssignmentType: string | null;
  editable: boolean;
}

export interface SingleCampaignSurvey {
  pretaaHealthGetCampaignSurvey: SingleCampaignSurvey_pretaaHealthGetCampaignSurvey | null;
}

export interface SingleCampaignSurveyVariables {
  campaignSurveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthSourceSystemFields
// ====================================================

export interface PretaaHealthSourceSystemFields_pretaaHealthSourceSystemFields {
  __typename: "SourceSystemFieldsResponse";
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  order: number;
  placeholder: string;
  sourceSystemId: string;
}

export interface PretaaHealthSourceSystemFields {
  pretaaHealthSourceSystemFields: PretaaHealthSourceSystemFields_pretaaHealthSourceSystemFields[];
}

export interface PretaaHealthSourceSystemFieldsVariables {
  sourceSystemId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthSourceSystems
// ====================================================

export interface PretaaHealthSourceSystems_pretaaHealthSourceSystems {
  __typename: "SourceSystemListResponse";
  createdAt: string;
  id: string;
  name: string;
  slug: string;
}

export interface PretaaHealthSourceSystems {
  pretaaHealthSourceSystems: PretaaHealthSourceSystems_pretaaHealthSourceSystems[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SubmitSurvey
// ====================================================

export interface SubmitSurvey {
  pretaaHealthSubmitSurvey: any;
}

export interface SubmitSurveyVariables {
  isCompleted?: boolean | null;
  surveyFields: SurveyAttemptCreateArgsFieldSet[];
  surveyId: string;
  browser?: string | null;
  device?: string | null;
  os?: string | null;
  surveyStartedAt?: any | null;
  surveyFinishedAt?: any | null;
  signature?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SubmitDaysSober
// ====================================================

export interface SubmitDaysSober {
  pretaaHealthSubmitDaysSober: string;
}

export interface SubmitDaysSoberVariables {
  daysSober: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SubmitSurveySignature
// ====================================================

export interface SubmitSurveySignature {
  pretaaHealthSubmitSurveySignature: any | null;
}

export interface SubmitSurveySignatureVariables {
  surveyId: string;
  surveySignatureData: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSuicidalIdeationPatientListReport
// ====================================================

export interface GetSuicidalIdeationPatientListReport_pretaaHealthGetSuicidalIdeationPatientListReport {
  __typename: "SuicidalIdeationPatientListResponse";
  id: string;
  name: string | null;
  primaryTherapist: string | null;
  caseManager: string | null;
  selfHarmCount: number;
  dischargeDate: string | null;
  intakeDate: string | null;
  facilityName: string | null;
}

export interface GetSuicidalIdeationPatientListReport {
  pretaaHealthGetSuicidalIdeationPatientListReport: GetSuicidalIdeationPatientListReport_pretaaHealthGetSuicidalIdeationPatientListReport[];
}

export interface GetSuicidalIdeationPatientListReportVariables {
  skip?: number | null;
  take?: number | null;
  all?: boolean | null;
  rangeStartDate?: string | null;
  rangeEndDate?: string | null;
  lastNumber?: number | null;
  filterMonthNDate?: EventReportingDateFilterTypes | null;
  filterUsers?: RepotingPatientUsers[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SupporterAcceptInvitation
// ====================================================

export interface SupporterAcceptInvitation_pretaaHealthSupporterAcceptInvitation {
  __typename: "User";
  id: string;
}

export interface SupporterAcceptInvitation {
  pretaaHealthSupporterAcceptInvitation: SupporterAcceptInvitation_pretaaHealthSupporterAcceptInvitation;
}

export interface SupporterAcceptInvitationVariables {
  invitationToken: string;
  supporterFirstName: string;
  supporterLastName: string;
  supporterPassword: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SupporterContactDetails
// ====================================================

export interface SupporterContactDetails_pretaaHealthSupporterDetails {
  __typename: "User";
  email: string;
  firstName: string | null;
  lastName: string | null;
  mobilePhone: string | null;
}

export interface SupporterContactDetails {
  pretaaHealthSupporterDetails: SupporterContactDetails_pretaaHealthSupporterDetails;
}

export interface SupporterContactDetailsVariables {
  supporterId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SupporterPaymentAcceptace
// ====================================================

export interface SupporterPaymentAcceptace_pretaaHealthSupporterPaymentAcceptace {
  __typename: "User";
  paidPaymentBy: string | null;
}

export interface SupporterPaymentAcceptace {
  pretaaHealthSupporterPaymentAcceptace: SupporterPaymentAcceptace_pretaaHealthSupporterPaymentAcceptace;
}

export interface SupporterPaymentAcceptaceVariables {
  stripeSessionId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FacilitySurveyWithAnswer
// ====================================================

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_createdby {
  __typename: "CreatedByResponse";
  lastName: string | null;
  firstName: string | null;
}

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_patientDetails {
  __typename: "PatientDetailsResponse";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields_validation {
  __typename: "ValidationProperty";
  conditionalValidation: any | null;
}

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields_options {
  __typename: "OptionObject";
  id: string | null;
  label: string | null;
  value: string | null;
}

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields {
  __typename: "SurveyTemplateFieldObjectPatientResponse";
  id: string | null;
  label: string | null;
  inputType: string | null;
  questionName: string | null;
  parentQuestionName: string | null;
  placeholder: string | null;
  rangeValue: string | null;
  step: string | null;
  value: string | null;
  skip: boolean | null;
  validation: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields_validation | null;
  options: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields_options[] | null;
}

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyTemplate {
  __typename: "SurveyTemplateResponse";
  description: string | null;
  name: string | null;
  type: string | null;
  title: string | null;
}

export interface FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer {
  __typename: "SurveyPatientResponse";
  assessment: any | null;
  browser: string | null;
  createdAt: any;
  createdby: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_createdby | null;
  patientDetails: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_patientDetails | null;
  surveyFields: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields[] | null;
  device: string | null;
  id: string;
  ipAddress: string | null;
  os: string | null;
  submissionDate: any | null;
  surveyStartedAt: any | null;
  surveyFinishedAt: any | null;
  surveyTemplate: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyTemplate | null;
  timezone: string | null;
  templateText: string | null;
  signature: string | null;
  scoreTable: any | null;
  surveyId: string | null;
  patientMRNumber: string | null;
}

export interface FacilitySurveyWithAnswer {
  pretaaHealthGetSurveyWithAnswer: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer;
}

export interface FacilitySurveyWithAnswerVariables {
  userId: string;
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPatientSurvey
// ====================================================

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyTemplate {
  __typename: "SurveyTemplateResponse";
  title: string | null;
  type: string | null;
  name: string | null;
  description: string | null;
  templateInfo: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_options {
  __typename: "OptionObject";
  id: string | null;
  label: string | null;
  value: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_maxLength {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_minLength {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_patternValidation {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_required {
  __typename: "ValidationPropertyState";
  active: boolean | null;
  message: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation {
  __typename: "ValidationProperty";
  conditionalValidation: any | null;
  maxLength: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_maxLength | null;
  minLength: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_minLength | null;
  patternValidation: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_patternValidation | null;
  required: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation_required | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields {
  __typename: "SurveyTemplateFieldObjectPatientResponse";
  parentQuestionName: string | null;
  questionName: string | null;
  id: string | null;
  inputType: string | null;
  label: string | null;
  options: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_options[] | null;
  placeholder: string | null;
  skip: boolean | null;
  rangeValue: string | null;
  validation: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields_validation | null;
  value: string | null;
  step: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_createdby {
  __typename: "CreatedByResponse";
  firstName: string | null;
  lastName: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey_patientDetails {
  __typename: "PatientDetailsResponse";
  firstName: string | null;
  lastName: string | null;
}

export interface GetPatientSurvey_pretaaHealthGetPatientSurvey {
  __typename: "SurveyPatientResponse";
  id: string;
  submissionDate: any | null;
  createdAt: any;
  surveyTemplate: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyTemplate | null;
  surveyFields: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields[] | null;
  assessment: any | null;
  createdby: GetPatientSurvey_pretaaHealthGetPatientSurvey_createdby | null;
  patientDetails: GetPatientSurvey_pretaaHealthGetPatientSurvey_patientDetails | null;
  browser: string | null;
  device: string | null;
  ipAddress: string | null;
  os: string | null;
  surveyStartedAt: any | null;
  timezone: string | null;
  isSignatureRequired: boolean | null;
  signature: string | null;
  patientMRNumber: string | null;
  surveyType: SurveyType;
  isCompleted: boolean | null;
}

export interface GetPatientSurvey {
  pretaaHealthGetPatientSurvey: GetPatientSurvey_pretaaHealthGetPatientSurvey;
}

export interface GetPatientSurveyVariables {
  surveyId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSurveyPatientStats
// ====================================================

export interface GetSurveyPatientStats_pretaaHealthGetSurveyPatientStats {
  __typename: "SurveyPatientStatsResponse";
  finishDate: string | null;
  finishTime: string | null;
  isCompleted: boolean;
  overAllPatientScore: number | null;
  surveyFinishedAt: string | null;
  surveyId: string;
  lastName: string | null;
  firstName: string | null;
  bamScore: any | null;
  timeZone: string | null;
}

export interface GetSurveyPatientStats {
  pretaaHealthGetSurveyPatientStats: GetSurveyPatientStats_pretaaHealthGetSurveyPatientStats[] | null;
}

export interface GetSurveyPatientStatsVariables {
  surveyId: string;
  dateOfAssignment: string;
  take?: number | null;
  skip?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SurveyReminder
// ====================================================

export interface SurveyReminder {
  pretaaHealthSurveyReminder: any | null;
}

export interface SurveyReminderVariables {
  reminderDate: any;
  surveyAssignId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthDuplicateSurvey
// ====================================================

export interface PretaaHealthDuplicateSurvey {
  pretaaHealthDuplicateSurvey: any;
}

export interface PretaaHealthDuplicateSurveyVariables {
  surveyId: string;
  title?: string | null;
  scheduledAt?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthGetTemplates
// ====================================================

export interface PretaaHealthGetTemplates_pretaaHealthGetTemplates {
  __typename: "SurveyTemplateResponse";
  id: string | null;
  title: string | null;
  name: string | null;
  type: string | null;
  description: string | null;
  totalCampaignCount: number;
  topic: string | null;
  templateEnableStatus: boolean | null;
  facilityName: string | null;
}

export interface PretaaHealthGetTemplates {
  pretaaHealthGetTemplates: PretaaHealthGetTemplates_pretaaHealthGetTemplates[];
}

export interface PretaaHealthGetTemplatesVariables {
  type?: SurveyTemplateTypes | null;
  skip?: number | null;
  take?: number | null;
  searchPhrase?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthToggleGeoFenceStatus
// ====================================================

export interface PretaaHealthToggleGeoFenceStatus_pretaaHealthToggleGeoFenceStatus {
  __typename: "GeoFencing";
  status: boolean;
}

export interface PretaaHealthToggleGeoFenceStatus {
  pretaaHealthToggleGeoFenceStatus: PretaaHealthToggleGeoFenceStatus_pretaaHealthToggleGeoFenceStatus;
}

export interface PretaaHealthToggleGeoFenceStatusVariables {
  fenceId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ToggleReadUnread
// ====================================================

export interface ToggleReadUnread {
  pretaaHealthEventReadToggle: any;
}

export interface ToggleReadUnreadVariables {
  eventId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleTemplateStatus
// ====================================================

export interface ToggleTemplateStatus {
  pretaaHealthToggleTemplateStatus: string;
}

export interface ToggleTemplateStatusVariables {
  templateId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCampaignSurvey
// ====================================================

export interface UpdateCampaignSurvey_pretaaHealthUpdateCampaignSurvey {
  __typename: "Survey";
  id: string;
}

export interface UpdateCampaignSurvey {
  pretaaHealthUpdateCampaignSurvey: UpdateCampaignSurvey_pretaaHealthUpdateCampaignSurvey | null;
}

export interface UpdateCampaignSurveyVariables {
  surveyCountPerParticipantType: SurveyCountPerParticipantType;
  name: string;
  campaignSurveyEndDate: any;
  campaignSurveyStartDate: any;
  surveyAssignmentType: CampaignSurveyAssignmentTypes;
  campaignSurveyReminderCompletionDay: CampaignSurveyReminderCompletion;
  triggerType?: CampaignSurveyTriggerTypes | null;
  campaignSurveyGroup?: CampaignSurveyGroupType[] | null;
  recipientsId?: string[] | null;
  campaignSurveyFrequencyType?: CampaignSurveyFrequency | null;
  campaignSurveyFrequencyCustomData?: number | null;
  campaignSurveySignature?: boolean | null;
  delay?: boolean | null;
  delayOfDays?: number | null;
  surveyEventType?: CampaignSurveyEventTypes | null;
  campaignSurveyId: string;
  saveAsDraft?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateFacility
// ====================================================

export interface UpdateFacility_pretaaHealthUpdateFacility {
  __typename: "User";
  id: string;
}

export interface UpdateFacility {
  pretaaHealthUpdateFacility: UpdateFacility_pretaaHealthUpdateFacility;
}

export interface UpdateFacilityVariables {
  facilityId: string;
  email: string;
  firstName: string;
  lastName: string;
  sourceSystemFields: UpdateSourceSystemFieldInput[];
  facilityName?: string | null;
  timeZone: string;
  offset: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCareTeamType
// ====================================================

export interface UpdateCareTeamType {
  pretaaHealthUpdateCareTeamType: string;
}

export interface UpdateCareTeamTypeVariables {
  PRIMARY_CASE_MANAGER?: string | null;
  PRIMARY_NURSE?: string | null;
  PRIMARY_PHYSICIAN?: string | null;
  PRIMARY_THERAPIST?: string | null;
  CLINICAL_DIRECTOR?: string | null;
  ALUMNI_DIRECTOR?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminUpdateClient
// ====================================================

export interface AdminUpdateClient_pretaaHealthAdminUpdateClient {
  __typename: "Account";
  id: string;
}

export interface AdminUpdateClient {
  pretaaHealthAdminUpdateClient: AdminUpdateClient_pretaaHealthAdminUpdateClient;
}

export interface AdminUpdateClientVariables {
  name: string;
  accountId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AgGridColumnManagement
// ====================================================

export interface AgGridColumnManagement_pretaaHealthAgGridColumnManagement {
  __typename: "PatientListColumnManagement";
  id: string;
  columnList: any;
}

export interface AgGridColumnManagement {
  pretaaHealthAgGridColumnManagement: AgGridColumnManagement_pretaaHealthAgGridColumnManagement;
}

export interface AgGridColumnManagementVariables {
  agGridListType: AgGridListTypes;
  columns: ColumnObjectArgs[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EmployeeActiveToggle
// ====================================================

export interface EmployeeActiveToggle {
  pretaaHealthEmployeeActiveToggle: any;
}

export interface EmployeeActiveToggleVariables {
  empDetailId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AdminUpdateSourceSystemValuesByFacilityId
// ====================================================

export interface AdminUpdateSourceSystemValuesByFacilityId {
  pretaaHealthAdminUpdateSourceSystemValuesByFacilityId: string;
}

export interface AdminUpdateSourceSystemValuesByFacilityIdVariables {
  facilityId: string;
  dynamicFields: SourceSystemFieldInput[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateGeoFenceForCounselors
// ====================================================

export interface UpdateGeoFenceForCounselors_pretaaHealthUpdateCounselorsGeoFence {
  __typename: "GeoFencing";
  id: string;
}

export interface UpdateGeoFenceForCounselors {
  pretaaHealthUpdateCounselorsGeoFence: UpdateGeoFenceForCounselors_pretaaHealthUpdateCounselorsGeoFence;
}

export interface UpdateGeoFenceForCounselorsVariables {
  latitude: number;
  longitude: number;
  fenceId: string;
  name?: string | null;
  type?: GeoFencingTypes | null;
  status?: boolean | null;
  radius?: number | null;
  location?: string | null;
  patientId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateGeoFence
// ====================================================

export interface UpdateGeoFence_pretaaHealthUpdatetGeoFence {
  __typename: "GeoFencing";
  id: string;
}

export interface UpdateGeoFence {
  pretaaHealthUpdatetGeoFence: UpdateGeoFence_pretaaHealthUpdatetGeoFence;
}

export interface UpdateGeoFenceVariables {
  fenceId: string;
  name?: string | null;
  type?: GeoFencingTypes | null;
  status?: boolean | null;
  latitude: number;
  location?: string | null;
  longitude: number;
  radius?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updatePatientCareTeamMutation
// ====================================================

export interface updatePatientCareTeamMutation {
  pretaaHealthPatientCareTeamUpdateFromPatientManagement: string;
}

export interface updatePatientCareTeamMutationVariables {
  selectedId: string;
  patientId: string;
  selectedType: CareTeamTypes;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EHRUpdatePatientContact
// ====================================================

export interface EHRUpdatePatientContact {
  pretaaHealthEHRUpdatePatientContact: string;
}

export interface EHRUpdatePatientContactVariables {
  patientContactId: string;
  name: string;
  phone: string;
  patientEhrContactType?: PatientEHRContactType | null;
  relationship?: RelationshipTypes | null;
  notes?: string | null;
  address?: string | null;
  alternativePhone?: string | null;
  company?: string | null;
  dob?: string | null;
  url?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateStaff
// ====================================================

export interface UpdateStaff {
  pretaaHealthUpdateStaffUser: string;
}

export interface UpdateStaffVariables {
  staffId: string;
  email: string;
  phone: string;
  userType: UserStaffTypes[];
  firstName?: string | null;
  lastName?: string | null;
  facilityIds?: string[] | null;
  careTeamTypes?: CareTeamTypes[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateStandardTemplate
// ====================================================

export interface UpdateStandardTemplate {
  pretaaHealthAdminUpdateSurveyTemplate: any;
}

export interface UpdateStandardTemplateVariables {
  fields: SurveyTemplateFieldCreateAdminArgs[];
  title: string;
  description?: string | null;
  templateId: string;
  name?: string | null;
  code?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSurveyTemplate
// ====================================================

export interface UpdateSurveyTemplate {
  pretaaHealthUpdateSurveyTemplate: any;
}

export interface UpdateSurveyTemplateVariables {
  surveyTemplateFields: SurveyTemplateFieldCreateArgs[];
  templateId: string;
  title: string;
  description?: string | null;
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_pretaaHealthCurrentUser_patientDetails {
  __typename: "PatientDetails";
  platformType: string | null;
  appleTokenInvalid: boolean | null;
}

export interface GetUser_pretaaHealthCurrentUser_userRoles {
  __typename: "UserRoleFieldResponse";
  name: string;
  roleSlug: UserTypeRole;
}

export interface GetUser_pretaaHealthCurrentUser_userFacilities {
  __typename: "UserFacilityFieldResponse";
  id: string;
  name: string;
}

export interface GetUser_pretaaHealthCurrentUser {
  __typename: "User";
  email: string;
  id: string;
  kipuVerified: any | null;
  lastLoginTime: any | null;
  lockTime: any | null;
  timezone: string | null;
  stripeCustomerId: string | null;
  receiveEmails: boolean;
  patientId: string | null;
  sentInvite: boolean;
  firstName: string | null;
  lastName: string | null;
  isClinicalDirector: boolean | null;
  twoFactorAuthentication: boolean;
  paidPaymentBy: string | null;
  stripePublishableKey: string | null;
  stripePriceId: string | null;
  fitbitTokenInvalid: boolean;
  patientDetails: GetUser_pretaaHealthCurrentUser_patientDetails | null;
  patientPermissionToSupporter: PatientEventActionTypes | null;
  userRoles: GetUser_pretaaHealthCurrentUser_userRoles[] | null;
  userFacilities: GetUser_pretaaHealthCurrentUser_userFacilities[] | null;
}

export interface GetUser_pretaaHealthGetCurrentUserPermissions_capabilities {
  __typename: "UserPermissionCapabilities";
  CREATE: number | null;
  DELETE: number | null;
  EDIT: number | null;
  EXECUTE: number | null;
  VIEW: number | null;
}

export interface GetUser_pretaaHealthGetCurrentUserPermissions {
  __typename: "UserPermission";
  capabilities: GetUser_pretaaHealthGetCurrentUserPermissions_capabilities;
  label: string;
  name: UserPermissionNames;
}

export interface GetUser {
  pretaaHealthCurrentUser: GetUser_pretaaHealthCurrentUser;
  pretaaHealthGetCurrentUserPermissions: GetUser_pretaaHealthGetCurrentUserPermissions[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthGetUserNotificationSettings
// ====================================================

export interface PretaaHealthGetUserNotificationSettings_pretaaHealthGetUserNotificationSettings {
  __typename: "NotificationSettingsResponse";
  email: boolean;
  notification: boolean | null;
  notificationTypesSetting: any[];
  pauseAll: boolean;
}

export interface PretaaHealthGetUserNotificationSettings {
  pretaaHealthGetUserNotificationSettings: PretaaHealthGetUserNotificationSettings_pretaaHealthGetUserNotificationSettings | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PretaaHealthCreateUpdateUserNotificationSettings
// ====================================================

export interface PretaaHealthCreateUpdateUserNotificationSettings_pretaaHealthCreateUpdateUserNotificationSettings {
  __typename: "NotificationSettingsResponse";
  email: boolean;
  notification: boolean | null;
  notificationTypesSetting: any[];
  pauseAll: boolean;
}

export interface PretaaHealthCreateUpdateUserNotificationSettings {
  pretaaHealthCreateUpdateUserNotificationSettings: PretaaHealthCreateUpdateUserNotificationSettings_pretaaHealthCreateUpdateUserNotificationSettings;
}

export interface PretaaHealthCreateUpdateUserNotificationSettingsVariables {
  email: boolean;
  notification?: boolean | null;
  notificationTypesSetting: any[];
  pauseAll: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyOtp
// ====================================================

export interface VerifyOtp_pretaaHealthVerifyTwoFactorAuthentication {
  __typename: "VerifyTwoFactorAuthenticationResponse";
  loginToken: string;
  refreshToken: string;
}

export interface VerifyOtp {
  pretaaHealthVerifyTwoFactorAuthentication: VerifyOtp_pretaaHealthVerifyTwoFactorAuthentication;
}

export interface VerifyOtpVariables {
  otp: number;
  twoFactorAuthToken: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ViewFacility
// ====================================================

export interface ViewFacility_pretaaHealthViewFacility_facilitySourceFields {
  __typename: "ViewFacilityResponse";
  value: string | null;
  name: string;
  id: string;
}

export interface ViewFacility_pretaaHealthViewFacility_primaryAdmin {
  __typename: "ViewPrimaryAdminResponse";
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface ViewFacility_pretaaHealthViewFacility {
  __typename: "Facility";
  facilitySourceFields: ViewFacility_pretaaHealthViewFacility_facilitySourceFields[] | null;
  id: string;
  name: string;
  sourceSystemId: string | null;
  primaryAdmin: ViewFacility_pretaaHealthViewFacility_primaryAdmin | null;
  offset: string | null;
  timeZone: string | null;
}

export interface ViewFacility {
  pretaaHealthViewFacility: ViewFacility_pretaaHealthViewFacility | null;
}

export interface ViewFacilityVariables {
  facilityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminViewClient
// ====================================================

export interface AdminViewClient_pretaaHealthAdminViewClient_superAdmin {
  __typename: "AccountSuperAdmin";
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

export interface AdminViewClient_pretaaHealthAdminViewClient {
  __typename: "ClientAccountResponse";
  id: string;
  name: string | null;
  renewalDate: any | null;
  status: boolean;
  superAdmin: AdminViewClient_pretaaHealthAdminViewClient_superAdmin | null;
}

export interface AdminViewClient {
  pretaaHealthAdminViewClient: AdminViewClient_pretaaHealthAdminViewClient;
}

export interface AdminViewClientVariables {
  accountId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PatientListByEmployee
// ====================================================

export interface PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta_patients_patientDetails {
  __typename: "EmployeePatientDetails";
  intakeDate: string | null;
}

export interface PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta_patients_patientContacts {
  __typename: "EmployeePatientContacts";
  fullName: string | null;
}

export interface PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta_patients {
  __typename: "PatientsMeta";
  mobilePhone: string | null;
  active: boolean | null;
  firstName: string | null;
  email: string | null;
  id: string;
  lastLoginTime: any | null;
  lastName: string | null;
  patientDetails: PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta_patients_patientDetails | null;
  patientContacts: PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta_patients_patientContacts[] | null;
  createdAt: any;
}

export interface PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta {
  __typename: "EmployeeMetaResponse";
  patients: PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta_patients[] | null;
}

export interface PatientListByEmployee_pretaaHealthViewEmployee {
  __typename: "User";
  employeeMeta: PatientListByEmployee_pretaaHealthViewEmployee_employeeMeta | null;
}

export interface PatientListByEmployee {
  pretaaHealthViewEmployee: PatientListByEmployee_pretaaHealthViewEmployee;
}

export interface PatientListByEmployeeVariables {
  employeeId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminGetSourceSystemValuesByFacilityId
// ====================================================

export interface AdminGetSourceSystemValuesByFacilityId_pretaaHealthAdminGetSourceSystemValuesByFacilityId {
  __typename: "SourceSystemValues";
  value: string;
  sourceSystemFieldId: string;
  placeholder: string;
  order: number;
  name: string;
  locationId: string | null;
  id: string;
  facilityId: string;
  deletedAt: any | null;
  createdAt: any;
}

export interface AdminGetSourceSystemValuesByFacilityId {
  pretaaHealthAdminGetSourceSystemValuesByFacilityId: AdminGetSourceSystemValuesByFacilityId_pretaaHealthAdminGetSourceSystemValuesByFacilityId[];
}

export interface AdminGetSourceSystemValuesByFacilityIdVariables {
  facilityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PretaaHealthViewGeoFence
// ====================================================

export interface PretaaHealthViewGeoFence_pretaaHealthViewGeoFence {
  __typename: "GeoFencing";
  id: string;
  name: string;
  location: string;
  type: GeoFencingTypes;
  status: boolean;
  latitude: number;
  longitude: number;
  radius: number;
  patientId: string | null;
}

export interface PretaaHealthViewGeoFence {
  pretaaHealthViewGeoFence: PretaaHealthViewGeoFence_pretaaHealthViewGeoFence | null;
}

export interface PretaaHealthViewGeoFenceVariables {
  fenceId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ViewPatientContact
// ====================================================

export interface ViewPatientContact_pretaaHealthViewPatientContact {
  __typename: "PatientContacts";
  address: string | null;
  alternativePhone: string | null;
  company: string | null;
  contactType: ContactTypes;
  createdAt: any | null;
  dob: string | null;
  email: string | null;
  id: string;
  notes: string | null;
  patientId: string;
  phone: string | null;
  relationship: string | null;
  url: string | null;
  fullName: string | null;
}

export interface ViewPatientContact {
  pretaaHealthViewPatientContact: ViewPatientContact_pretaaHealthViewPatientContact | null;
}

export interface ViewPatientContactVariables {
  patientContactId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * ag grid list types .
 */
export enum AgGridListTypes {
  ANOMALIES_REPORT = "ANOMALIES_REPORT",
  ASSESSMENT_NEEDING_ATTENTION_REPORT = "ASSESSMENT_NEEDING_ATTENTION_REPORT",
  CAMPAIGN_LIST = "CAMPAIGN_LIST",
  FACILITY_MANAGEMENT = "FACILITY_MANAGEMENT",
  FACILITY_MANAGEMENT_ADMIN_EMPLOYEE = "FACILITY_MANAGEMENT_ADMIN_EMPLOYEE",
  FACILITY_MANAGEMENT_DETAIL_LIST = "FACILITY_MANAGEMENT_DETAIL_LIST",
  GEOFENCES_COMPROMISED_REPORT = "GEOFENCES_COMPROMISED_REPORT",
  HELP_LINE_CONTACTED_REPORT = "HELP_LINE_CONTACTED_REPORT",
  PATIENT_MANAGEMENT = "PATIENT_MANAGEMENT",
  PATIENT_MANAGEMENT_CARETEAM_LIST = "PATIENT_MANAGEMENT_CARETEAM_LIST",
  STAFF_MANAGEMENT = "STAFF_MANAGEMENT",
  STAFF_MANAGEMENT_PATIENT_LIST = "STAFF_MANAGEMENT_PATIENT_LIST",
  SUICIDAL_IDEATION_REPORT = "SUICIDAL_IDEATION_REPORT",
}

/**
 * Patient Discharge Status
 */
export enum AssessmentPatientsDischargeFilterTypes {
  ALL = "ALL",
  DISCHARGED = "DISCHARGED",
  IN_CENSUS = "IN_CENSUS",
}

export enum BackgoundLocationType {
  ALWAYS = "ALWAYS",
  DENIED = "DENIED",
  NOT_DETERMINE = "NOT_DETERMINE",
  RESTRICTED = "RESTRICTED",
  WHEN_IN_USE = "WHEN_IN_USE",
}

/**
 * campaign survey assignment types .
 */
export enum CampaignSurveyAssignmentTypes {
  GROUP = "GROUP",
  RECIPIENT = "RECIPIENT",
}

/**
 * campaign survey event types.
 */
export enum CampaignSurveyEventTypes {
  SURVEY_BY_PATIENT = "SURVEY_BY_PATIENT",
}

/**
 * Campaign frequency type survey .
 */
export enum CampaignSurveyFrequency {
  CUSTOM = "CUSTOM",
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
}

/**
 * Campaign type survey group.
 */
export enum CampaignSurveyGroupType {
  ALL = "ALL",
  FEMALE = "FEMALE",
  IN_PATIENT = "IN_PATIENT",
  MALE = "MALE",
  OUT_PATIENT = "OUT_PATIENT",
}

/**
 * Campaign survey completion type survey
 */
export enum CampaignSurveyReminderCompletion {
  DAILY_1 = "DAILY_1",
  DAILY_2 = "DAILY_2",
  DAILY_3 = "DAILY_3",
  EVERY_OTHER_DAY = "EVERY_OTHER_DAY",
  NONE = "NONE",
}

/**
 * campaign survey trigger types .
 */
export enum CampaignSurveyTriggerTypes {
  EVENT_BASED = "EVENT_BASED",
  TIME_BASED = "TIME_BASED",
}

export enum CareTeamTypes {
  ALUMNI_DIRECTOR = "ALUMNI_DIRECTOR",
  CLINICAL_DIRECTOR = "CLINICAL_DIRECTOR",
  OTHERS = "OTHERS",
  PRIMARY_ALUMNI_COORDINATOR = "PRIMARY_ALUMNI_COORDINATOR",
  PRIMARY_CASE_MANAGER = "PRIMARY_CASE_MANAGER",
  PRIMARY_NURSE = "PRIMARY_NURSE",
  PRIMARY_PHYSICIAN = "PRIMARY_PHYSICIAN",
  PRIMARY_THERAPIST = "PRIMARY_THERAPIST",
}

export enum ContactTypes {
  EMERGENCY = "EMERGENCY",
  FAMILY = "FAMILY",
  LEGAL = "LEGAL",
  MEDICAL = "MEDICAL",
  OTHER = "OTHER",
  PERSONAL = "PERSONAL",
}

/**
 * Event Reporting Date Range Types
 */
export enum DateRangeTypes {
  DAY = "DAY",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  WEEK = "WEEK",
  YEAR = "YEAR",
}

/**
 * Event filter types
 */
export enum EventFilterTypes {
  ALERT = "ALERT",
  ARCHIVED = "ARCHIVED",
  ASSESSMENT = "ASSESSMENT",
  COMPLETED_ASSESSMENT = "COMPLETED_ASSESSMENT",
  CONTACTED_HELPLINE = "CONTACTED_HELPLINE",
  DISCHARGED = "DISCHARGED",
  FENCE = "FENCE",
  IN_CENSUS = "IN_CENSUS",
  REPORT = "REPORT",
  REQUESTS = "REQUESTS",
}

/**
 * Event Reporting Date Filter
 */
export enum EventReportingDateFilterTypes {
  CUSTOM_RANGE = "CUSTOM_RANGE",
  DAY_LASTN = "DAY_LASTN",
  DAY_PREVIOUS = "DAY_PREVIOUS",
  DAY_TO_DATE = "DAY_TO_DATE",
  MONTH_LASTN = "MONTH_LASTN",
  MONTH_PREVIOUS = "MONTH_PREVIOUS",
  MONTH_TO_DATE = "MONTH_TO_DATE",
  QUARTER_LASTN = "QUARTER_LASTN",
  QUARTER_PREVIOUS = "QUARTER_PREVIOUS",
  QUARTER_TO_DATE = "QUARTER_TO_DATE",
  WEEK_LASTN = "WEEK_LASTN",
  WEEK_PREVIOUS = "WEEK_PREVIOUS",
  WEEK_TO_DATE = "WEEK_TO_DATE",
  YEAR_LASTN = "YEAR_LASTN",
  YEAR_PREVIOUS = "YEAR_PREVIOUS",
  YEAR_TO_DATE = "YEAR_TO_DATE",
}

export enum EventTypes {
  ALERT = "ALERT",
  ASSESSMENT = "ASSESSMENT",
  COMPLETED_ASSESSMENT = "COMPLETED_ASSESSMENT",
  CONTACTED_HELPLINE = "CONTACTED_HELPLINE",
  FENCE = "FENCE",
  REPORT = "REPORT",
  REQUESTS = "REQUESTS",
}

/**
 * facility filter user types
 */
export enum FacilityFilterUserTypes {
  PATIENT = "PATIENT",
  SUPPORTER = "SUPPORTER",
}

/**
 * facility filter user types
 */
export enum FacilityUserDeletionRoles {
  COUNSELLOR = "COUNSELLOR",
  FACILITY_ADMIN = "FACILITY_ADMIN",
  PATIENT = "PATIENT",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum FenceBreachType {
  IN = "IN",
  OUT = "OUT",
}

export enum GeoFencingTypes {
  IN = "IN",
  IN_AND_OUT = "IN_AND_OUT",
  OUT = "OUT",
}

export enum InvitationStatusType {
  REGISTERED = "REGISTERED",
  RESEND = "RESEND",
}

/**
 * The invitation types
 */
export enum InvitationTypes {
  FRIEND_FAMILY = "FRIEND_FAMILY",
  MEDICAL_FACILITY = "MEDICAL_FACILITY",
}

/**
 * The basic order types
 */
export enum OrderType {
  ASC = "ASC",
  DESC = "DESC",
}

export enum PatientEHRContactType {
  EMERGENCY = "EMERGENCY",
  FAMILY = "FAMILY",
  LEGAL = "LEGAL",
  MEDICAL = "MEDICAL",
  OTHER = "OTHER",
}

export enum PatientEventActionTypes {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

/**
 * Patient event filter types
 */
export enum PatientEventFilterTypes {
  ASSESSMENT = "ASSESSMENT",
  NO_REPORT = "NO_REPORT",
  REPORT = "REPORT",
}

export enum PlatformTypes {
  APPLEWATCH = "APPLEWATCH",
  FITBIT = "FITBIT",
}

export enum RecurringOccurenceType {
  ONE_TIME_EVENT = "ONE_TIME_EVENT",
  REPETITION = "REPETITION",
  SURVEY_BY_PATIENT = "SURVEY_BY_PATIENT",
}

export enum RelationshipTypes {
  BROTHER_SISTER = "BROTHER_SISTER",
  CHILD = "CHILD",
  FRIEND = "FRIEND",
  GRANDPARENT = "GRANDPARENT",
  GUARANTOR = "GUARANTOR",
  GUARDIAN = "GUARDIAN",
  OTHER = "OTHER",
  PARENT = "PARENT",
  PROBATION_OFFICER = "PROBATION_OFFICER",
  SPONSOR = "SPONSOR",
  SPOUSE = "SPOUSE",
  SPOUSE_PARTNER = "SPOUSE_PARTNER",
}

export enum ReportFrequency {
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
}

/**
 * Filter by date
 */
export enum ReportingDateFilter {
  CUSTOM = "CUSTOM",
  MONTH_TO_DATE = "MONTH_TO_DATE",
  ONE_MONTH = "ONE_MONTH",
  QUARTER_TO_DATE = "QUARTER_TO_DATE",
  SEVEN_DAYS = "SEVEN_DAYS",
  THREE_MONTHS = "THREE_MONTHS",
  TODAY = "TODAY",
  WEEK_TO_DATE = "WEEK_TO_DATE",
  YESTERDAY = "YESTERDAY",
}

export enum SourceSystemTypes {
  alleva = "alleva",
  ehr = "ehr",
  kipu = "kipu",
  lightning_step = "lightning_step",
  ritten = "ritten",
  sunwave = "sunwave",
}

/**
 * Standard templates
 */
export enum StandardTemplate {
  BAM_IOP = "BAM_IOP",
  BAM_R = "BAM_R",
  GAD_7 = "GAD_7",
  PHQ_15 = "PHQ_15",
  PHQ_9 = "PHQ_9",
  URICA = "URICA",
}

export enum SurveyCountPerParticipantType {
  MULTIPLE = "MULTIPLE",
  SINGLE = "SINGLE",
}

/**
 * Survey status type.
 */
export enum SurveyStatusType {
  DRAFT = "DRAFT",
  ENDED = "ENDED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  SCHEDULED = "SCHEDULED",
}

/**
 * Status types for facility users
 */
export enum SurveyStatusTypeFacility {
  COMPLETED = "COMPLETED",
  INCOMPLETED = "INCOMPLETED",
  SCHEDULED = "SCHEDULED",
}

/**
 * Status types for patient users
 */
export enum SurveyStatusTypePatient {
  COMPLETED = "COMPLETED",
  OPEN = "OPEN",
}

/**
 * The basic survey template types
 */
export enum SurveyTemplateTypes {
  CUSTOM = "CUSTOM",
  STANDARD = "STANDARD",
}

export enum SurveyType {
  CAMPAIGN = "CAMPAIGN",
  NORMAL = "NORMAL",
}

/**
 * User invitation options.
 */
export enum UserInvitationOptions {
  INVITE = "INVITE",
  REGISTERED = "REGISTERED",
  RESEND = "RESEND",
}

/**
 * User Permission Names
 */
export enum UserPermissionNames {
  CAMPAIGN_SCHEDULER = "CAMPAIGN_SCHEDULER",
  CARETEAM_TYPE_MANAGEMENT = "CARETEAM_TYPE_MANAGEMENT",
  CONTACTS = "CONTACTS",
  COUNSELLOR_GEOFENCES = "COUNSELLOR_GEOFENCES",
  COUNSELLOR_REPORTS = "COUNSELLOR_REPORTS",
  EHR = "EHR",
  EMPLOYEE_MANAGEMENT = "EMPLOYEE_MANAGEMENT",
  EVENTS = "EVENTS",
  FACILITY_ADMIN_REPORTS = "FACILITY_ADMIN_REPORTS",
  FACILITY_IMPERSONATION = "FACILITY_IMPERSONATION",
  FACILITY_LIST = "FACILITY_LIST",
  FACILITY_MANAGEMENT = "FACILITY_MANAGEMENT",
  FEEDBACK = "FEEDBACK",
  GEOFENCES = "GEOFENCES",
  INTEGRATIONS = "INTEGRATIONS",
  NOTES = "NOTES",
  NOTIFICATION_SETTINGS = "NOTIFICATION_SETTINGS",
  PATIENTS = "PATIENTS",
  PATIENT_DETAILS = "PATIENT_DETAILS",
  PATIENT_MANAGEMENT = "PATIENT_MANAGEMENT",
  ROLE_MANAGEMENT = "ROLE_MANAGEMENT",
  SUPPORTER_MANAGEMENT = "SUPPORTER_MANAGEMENT",
  SURVEYS = "SURVEYS",
  SURVEY_TEMPLATES = "SURVEY_TEMPLATES",
  TIMELINE = "TIMELINE",
  USER = "USER",
}

/**
 * Staff types
 */
export enum UserStaffTypes {
  COUNSELLOR = "COUNSELLOR",
  FACILITY_ADMIN = "FACILITY_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserTypeRole {
  COUNSELLOR = "COUNSELLOR",
  FACILITY_ADMIN = "FACILITY_ADMIN",
  PATIENT = "PATIENT",
  SUPER_ADMIN = "SUPER_ADMIN",
  SUPPORTER = "SUPPORTER",
}

export enum UserTypes {
  FACILITY_USER = "FACILITY_USER",
  PATIENT = "PATIENT",
  SUPPORTER = "SUPPORTER",
}

export interface AdminFacilityKipuLocationArgs {
  locationId: string;
  locationName: string;
  timeZone: string;
  offset: string;
}

export interface AssessmentReportingPatientsIds {
  patientId: string;
}

export interface ColumnObjectArgs {
  name: string;
  enable: boolean;
}

export interface Contacts {
  id?: string | null;
  contactType: ContactTypes;
  name: string;
  email: string;
  phone: string;
  relationship: RelationshipTypes;
  patientEHRContactType?: PatientEHRContactType | null;
}

export interface DateRangArgs {
  startDate: string;
  endDate: string;
}

export interface EHRCareTeamMatrices {
  careTeamId: string;
  careTeamType?: CareTeamTypes | null;
  isPrimary?: boolean | null;
}

export interface EHRPatientDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  genderIdentity?: string | null;
  intakeDate: string;
  dischargeDate?: string | null;
  dob: string;
}

export interface EHRPatientDetailsUpdate {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  location?: string | null;
  dischargeDate?: string | null;
  age?: string | null;
  bedName?: string | null;
  room?: string | null;
  paymentMethod?: string | null;
  insuranceCompany?: string | null;
  paymentMethodCategory?: string | null;
  diagnosis?: string | null;
  dob?: string | null;
  locationCode?: string | null;
  gender?: string | null;
  genderIdentity?: string | null;
  intakeDate?: string | null;
}

export interface FacilityUsersObjectArgs {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

export interface ReportingCliniciansUsers {
  clinicianId: string;
}

export interface RepotingClinicianUsers {
  clinicianId: string;
}

export interface RepotingPatientUsers {
  patientId: string;
}

export interface SourceSystemFieldInput {
  id: string;
  value: string;
}

export interface SurveyAssignmentCreatePatientSetArgs {
  patientId: string;
}

export interface SurveyAttemptCreateArgsFieldSet {
  id?: string | null;
  label: string;
  placeholder?: string | null;
  inputType: string;
  validation?: any | null;
  options?: any[] | null;
  rangeValue?: string | null;
  step?: string | null;
  value?: string | null;
  skip?: boolean | null;
}

export interface SurveyTemplateCodes {
  code: string;
}

export interface SurveyTemplateFieldCreateAdminArgs {
  id?: string | null;
  label: string;
  placeholder?: string | null;
  inputType: string;
  validation?: any | null;
  options?: any[] | null;
  rangeValue?: string | null;
  step?: string | null;
  questionName: string;
  parentQuestionName?: string | null;
}

export interface SurveyTemplateFieldCreateArgs {
  id?: string | null;
  label: string;
  placeholder?: string | null;
  inputType: string;
  validation?: any | null;
  options?: any[] | null;
  rangeValue?: string | null;
  step?: string | null;
}

export interface UpdateSourceSystemFieldInput {
  id: string;
  value: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
