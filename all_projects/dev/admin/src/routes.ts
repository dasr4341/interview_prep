import { NoteRoutesInterface } from 'interface/note-routes.interface';
import { CompanyGroupRouteInterface } from 'interface/company-group-route.interface';
import { GroupDetailsRoutesInterface } from 'interface/group-details-routes.interface';
import { GroupEditRouteQueryParams } from 'interface/group-edit.interface';
import { UserGroupRouteInterface } from 'interface/user-group-route.interface';
import queryString from 'query-string';
import { CompanyQuery } from 'interface/company-query.interface';
import { UserPermissionsQueryParams } from 'interface/userPermission.interface';

export type Route = {
  build: (id: string, query?: unknown) => string;
  label?: string;
  match: string;
  name: string;
};
export type MakeRouteOptions = {
  label?: string;
  build?: (id: string) => string;
  name: string;
};

export interface BreadCrumb {
  label: string;
  route?: string;
}

function makeRoute(match: string, option: MakeRouteOptions): Route {
  return {
    match,
    label: option?.label ?? match.split('/').pop() ?? '-',
    build: option?.build ?? (() => match),
    name: option.name,
  };
}

function buildUrl(route: string, query?: any) {
  if (query) {
    route = `${route}?${queryString.stringify(query)}`;
  }
  return route;
}

// Note: these need to be sorted in the order they should appear in
// a navigation breadcrumb.
export const routes = {
  home: makeRoute('/', { label: 'home', name: 'HOME' }),

  // Auth
  twoStepAuth: makeRoute('/settings/preferences/two-step-auth', { name: 'TWO_STEP_AUTH' }),
  login: makeRoute('/login', { name: 'LOGIN' }),
  unauthorized: makeRoute('/unauthorized', { name: 'UNAUTHORIZED' }),
  oktaLogin: makeRoute('/okta', { name: 'OKTA' }),
  oktaCallBack: makeRoute('/okta/callback', { name: 'OKTA_CALLBACK' }),
  logout: makeRoute('/logout', { name: 'LOGOUT' }),
  forgetPassword: makeRoute('/forgot_password', { name: 'ForgotPassword' }),
  passwordReset: makeRoute('/forgot_password/:token', {
    build: (tokenId: string) => `/forgot_password/${tokenId}`,
    name: 'ResetPassword'
  }),
  setPassword: makeRoute('/welcome/:welcomeToken', {
    build: (token: string) => `/welcome/${token}`,
    name: 'SetAccountPassword'
  }),

  // Companies
  companies: {
    match: '/companies/list',
    label: 'Companies',
    build: (query: CompanyQuery) => buildUrl('/companies/list', query),
    name: 'CompanyList'
  },
  companyDetail: makeRoute('/companies/:id', {
    build: (id: string) => `/companies/${id}`,
    label: 'company detail',
    name: 'CompanyDetails'
  }),
  companyTickets: makeRoute('/companies/:id/tickets', {
    name: 'CompanyTicketList',
    build: (id: string) => `/companies/${id}/tickets`,
  }),
  companyContacts: {
    name: 'ContactList',
    match: '/companies/:id/contacts',
    build: (id: string, query?: { opportunityId?: string }) => buildUrl(`/companies/${id}/contacts`, query),
    label: 'Contact',
  },
  companyEventDetail: {
    name: 'EventDetails',
    label: 'Details',
    match: '/companies/event/:companyId/:id',
    build: ({ companyId, eventId }: { companyId: string; eventId: string }) =>
      buildUrl(`/companies/event/${companyId}/${eventId}`),
  },
  companyRatings: {
    name: 'RATINGS',
    match: '/ratings',
    build: (query: { companyId?: string; ratingId?: string }) => buildUrl('/ratings', query),
    label: 'Rating',
  },
  companyRating: {
    name: 'RATING',
    match: '/rating',
    build: (query: { companyId?: string; eventId?: string }) => buildUrl('/rating', query),
    label: 'Add Rating',
  },
  companyDetailRating: {
    name: 'RatingDetails',
    match: '/ratingdetails',
    build: (query: { companyId?: string }) => buildUrl('/ratingdetails', query),
    label: 'Rating Details',
  },
  companyContact: {
    name: 'ContactList',
    match: '/companies/contact/:id',
    build: (id: string, query?: { opportunityId?: string }) => buildUrl(`/companies/contact/${id}`, query),
    label: 'contact detail',
  },
  companyDataSource: makeRoute('/companies/:id/data-source', {
    name: 'COMPANY_DATA_SOURCE',
    build: (id: string) => `/companies/${id}/data-source`,
  }),
  companyFeedback: makeRoute('/companies/:id/feedback', {
    name: 'COMPANY_FEEDBACK',
    label: 'feedback',
    build: (id: string) => `/companies/${id}/feedback`,
  }),
  competitors: {
    name: 'CompetitorsList',
    match: '/companies/:id/competitors',
    build: (id: string, query?: { opportunityId?: string }) => buildUrl(`/companies/${id}/competitors`, query),
    label: 'competitors',
  },
  companyTimeline: {
    name: 'CompanyTimeline',
    match: '/companies/timeline',
    label: 'Companies Timeline',
    build: (query: any) => buildUrl('/companies/timeline', query),
  },

  // Products
  products: {
    name: 'ProductList',
    match: '/companies/:id/products',
    build: (id: string, query?: { opportunityId?: string }) => buildUrl(`/companies/${id}/products`, query),
    label: 'product list',
  },

  productDetail: {
    name: 'ProductDetails',
    build: (
      id: string,
      query?: {
        companyId?: string;
        opportunityId?: string;
      }
    ) => buildUrl(`/products/${id}`, query),
    label: 'Product detail',
    match: '/products/:id',
  },

  companyProductDetail: {
    name: 'ProductDetails',
    build: (
      id: string,
      query?: {
        companyId?: string;
        opportunityId?: string;
      }
    ) => buildUrl(`/companies/products/${id}`, query),
    label: 'Product detail',
    match: '/companies/products/:id',
  },

  // Event
  events: {
    name: 'EventList',
    match: '/events',
    label: 'Events',
    build: (route: string, query: any) => buildUrl(route, query),
  },
  eventDetail: {
    name: 'EventDetails',
    build: (id: string) => `/events/${id}`,
    label: 'detail',
    match: '/events/:id',
  },

  // Notes
  notes: {
    name: 'NotesScreen',
    match: '/settings/preferences/notes',
    label: 'Notes',
    build: (route: string, query: any) => buildUrl(route, query),
  },
  eventNotes: {
    name: 'NotesScreen',
    match: '/events/:id/notes',
    label: 'Notes',
    build: (id: string, query: any) => buildUrl(`/events/${id}/notes`, query),
  },
  companyNotes: {
    name: 'CompanyNoteList',
    match: '/companies/:id/notes',
    label: 'Notes',
    build: (id: string, query: any) => buildUrl(`/companies/${id}/notes`, query),
  },
  notesCreate: {
    name: 'NOTE_CREATE',
    match: '/settings/preferences/notes/create',
    label: 'Note Create',
    build: (query: NoteRoutesInterface) => buildUrl('/settings/preferences/notes/create', query),
  },
  noteDetail: {
    name: 'NoteDetailsScreen',
    match: '/settings/preferences/notes/:id',
    label: 'Note Details',
    build: (id: string) => `/settings/preferences/notes/${id}`,
  },
  editNote: makeRoute('/settings/preferences/notes/edit/:id', {
    name: 'EDIT_NOTE',
    build: (id: string) => `/settings/preferences/notes/edit/${id}`,
    label: 'Note Edit',
  }),

  // message
  message: {
    name: 'Notes',
    match: '/message',
    label: 'Messages',
    build: (route: string, query: any) => buildUrl('/message', query),
  },
  messageCreate: {
    name: 'CreateNote',
    match: '/message-create',
    label: 'Messages Create',
    build: (query: NoteRoutesInterface) => buildUrl('/message-create', query),
  },
  editMessage: makeRoute('/message/edit/:id', {
    name: 'EditNote',
    build: (id: string) => `/message/edit/${id}`,
    label: 'message edit',
  }),
  messageDetail: makeRoute('/message/:id', {
    name: 'NoteDetailsScreen',
    build: (id: string) => `/message/${id}`,
    label: 'message detail',
  }),
  messageThread: {
    name: 'NoteDetailsScreen',
    match: '/message-thread/:id',
    label: 'Messages Thread',
    build: (id: string, query?: { eventId: string }) => buildUrl(`/message-thread/${id}`, query),
  },
  // Data Objects
  dataObjectCreate: {
    name: 'DataObjectCreate',
    match: '/settings/admin/data-objects/create',
    label: 'Object Create',
    build: (options: { name?: string; id: string }) => buildUrl('/settings/admin/data-objects/create', options),
  },
  // dataObjects: makeRoute('/settings/admin/data-objects'),
  dataObjects: {
    name: 'DataObjects',
    label: 'Data Object',
    match: '/settings/admin/data-objects',
    build: (query?: CompanyGroupRouteInterface) => buildUrl('/settings/admin/data-objects', query),
  },
  dataObjectsDetails: {
    name: 'DataObjectDetails',
    match: '/settings/admin/data-objects/details',
    label: 'Data Object',
    build: (options?: { name?: string; id: string; search?: string }) =>
      buildUrl('/settings/admin/data-objects/details', options),
  },

  // Threshold Screen
  thresholdScreen: makeRoute('/settings/admin/threshold', { name: 'THRESHOLD', }),

  //reference
  companyReferences: {
    name: 'ReferencesList',
    label: "Company's References",
    match: '/companies/:id/references',
    build: (id: string, query?: { count?: number; added?: boolean; type?: string }) => buildUrl(`/companies/${id}/references`, query),
  },
  addCustomerReference: makeRoute('/companies/:id/reference/add', {
    name: 'CustomerReference',
    build: (id: string) => `/companies/${id}/reference/add`,
    label: 'add reference',
  }),
  addOpportunityReference: makeRoute('/customer/:id/reference/add', {
    name: 'OpportunityReference',
    build: (id: string) => `/customer/${id}/reference/add`,
    label: 'add customer reference',
  }),

  // Launch
  launchedList: {
    name: 'LaunchList',
    match: '/events/launched-list',
    build: (query: { eventId?: string; companyId?: string; count?: string }) =>
      buildUrl('/events/launched-list', query),
    label: 'Launched List',
  },
  launchedCompanyList: {
    name: 'LaunchList',
    match: '/companies/launched-list',
    build: (query: { companyId?: string; count?: string; opportunityId?: string }) =>
      buildUrl('/companies/launched-list', query),
    label: 'Launched List',
  },
  launchedDetail: makeRoute('/companies/launch/:launchId', {
    name: 'LaunchDetails',
    build: (launchId: string) => `/companies/launch/${launchId}`,
    label: 'detail',
  }),
  companyOpportunities: {
    name: 'OpportunityList',
    label: "Company's Opportunity",
    match: '/companies/:companyId/opportunities',
    build: (companyId: string, query?: { name?: string, count?: number }) => buildUrl(`/companies/${companyId}/opportunities`, query),
  },
  companyOpportunityDetail: {
    name: 'OpportunityDetails',
    match: '/companies/:companyId/opportunities/:opportunityId',
    build: (companyId: string, opportunityId: string) => `/companies/${companyId}/opportunities/${opportunityId}`,
    label: 'Opportunities',
  },
  launchedEventDetail: makeRoute('/events/launch/:launchId', {
    name: 'LaunchDetails',
    build: (launchId: string) => `/events/launch/${launchId}`,
    label: 'detail',
  }),
  selectTemplate: {
    match: '/companies/launch/select-template',
    name: 'SelectTemplate',
    label: 'Select Template',
    build: (query: { companyId: string; opportunityId?: string }) =>
      buildUrl('/companies/launch/select-template', query),
  },
  selectEventTemplate: {
    name: 'SelectEventTemplate',
    match: '/events/launch/select-template',
    label: 'Select Template',
    build: (query: { eventId?: string; companyId: string; defaultTemplateId?: string }) =>
      buildUrl('/events/launch/select-template', query),
  },
  launchEmail: {
    name: 'LaunchCreate',
    match: '/events/launch/create',
    label: 'Launch template',
    build: (query: any) => buildUrl('/events/launch/create', query),
  },

  admin: {
    name: 'Admin',
    match: '/settings/admin',
    build: (query?: { groupId?: string }) => buildUrl('/settings/admin', query),
    label: 'Admin',
  },
  // User
  userListGrid: {
    name: 'UserListAdmin',
    match: '/settings/admin/user-list',
    build: (query?: { groupId?: string, groupCount?: number }) => buildUrl('/settings/admin/user-list', query),
    label: 'User List',
  },
  selectedUserListGrid: {
    name: 'SelectedUserList',
    match: '/settings/admin/selected-user-list',
    build: (query?: { groupId?: string, selectedGroup?: boolean }) => buildUrl('/settings/admin/selected-user-list', query),
    label: 'Selected User List',
  },
  userListGridForGroup: {
    name: 'UpdateGroup',
    match: '/settings/admin/user-list-for-group',
    build: (query?: { groupId?: string }) => buildUrl('/settings/admin/user-list-for-group', query),
    label: 'Update Group',
  },
  // createUser: makeRoute('/settings/admin/user/create'),
  updateUser: {
    name: 'UpdateUser',
    match: '/settings/admin/user/update-user/:id',
    build: (id: string) => `/settings/admin/user/update-user/${id}`,
    label: 'update user',
  },
  UserDetailScreen: {
    name: 'UpdateUserDetails',
    match: '/settings/admin/user-list/details/:id',
    build: (id: string) => `/settings/admin/user-list/details/${id}`,
    label: 'User Details',
  },
  UserDetails: {
    name: 'UpdateUserDetails',
    match: '/settings/admin/user-list/details/:id/details',
    build: (id: string) => `/settings/admin/user-list/details/${id}/details`,
    label: 'User Details',
  },
  UserDetailsUpdate: {
    name: 'UpdateUserDetails',
    match: '/settings/admin/user/details/:id/update',
    build: (id: string) => `/settings/admin/user/details/${id}/update`,
    label: 'User Details',
  },
  userCompanyAccess: {
    name: 'UserCompanyAccess',
    match: '/settings/admin/user-list/details/:id/company-access',
    build: (id: string) => `/settings/admin/user-list/details/${id}/company-access`,
    label: 'User company access',
  },
  userInheritedPermission: {
    name: 'UserPermission',
    label: 'User Details',
    match: '/settings/admin/user-list/permission',
    build: (query: UserPermissionsQueryParams) => buildUrl('/settings/admin/user-list/permission', query),
  },

  settingsUserUploadCSVFile: makeRoute('/settings/admin/user-list/upload-csv-file', { name: 'UploadCsv' }),

  // User Groups
  createUserGroup: {
    name: 'CreateUserGroup',
    label: 'New user group',
    match: '/settings/admin/user-groups/create',
    build: (query?: { groupId?: string, groupCount?: number }) => buildUrl('/settings/admin/user-groups/create', query),
  },
  editUserGroup: {
    name: 'EditUserGroup',
    label: 'Edit User Group',
    match: '/settings/admin/user-groups/create',
    build: (query: GroupEditRouteQueryParams) => buildUrl('/settings/admin/user-groups/create', query),
  },
  userGroupAction: {
    name: 'UserGroupAction',
    label: 'Create User Action',
    match: '/settings/admin/user-group-action',
    build: (query: GroupDetailsRoutesInterface) => buildUrl('/settings/admin/user-group-action', query),
  },
  settingsGroups: makeRoute('/settings/admin/groups', { name: 'USER_GROUPS_LIST', }),
  groupDetails: {
    name: 'UserGroupDetails',
    label: 'group details',
    match: '/settings/admin/user-groups/details/:id',
    build: (
      id: string,
      query?: {
        action: 'group-update';
      }
    ) => buildUrl(`/settings/admin/user-groups/details/${id}`, query),
  },
  groupList: {
    name: 'UserGroupList',
    label: 'Group List',
    match: '/settings/admin/user-groups',
    build: (query?: UserGroupRouteInterface) => buildUrl('/settings/admin/user-groups', query),
  },

  // Templates
  templateList: {
    name: 'TemplateList',
    build: (query: any) => buildUrl('/settings/templates/list', query),
    match: '/settings/templates/list',
    label: 'Template List',
  },
  templateAdd: makeRoute('/settings/templates/add', { name: 'TemplateAdd' }),
  templateEdit: makeRoute('/settings/templates/list/edit/:id', {
    name: 'TemplateEdit',
    build: (id: string) => `/settings/templates/list/edit/${id}`,
    label: 'Email template',
  }),
  templateDetails: makeRoute('/settings/templates/list/detail/:id', {
    name: 'TemplateDetails',
    build: (id: string) => `/settings/templates/list/detail/${id}`,
    label: 'Email template',
  }),

  // Role Management
  roleList: makeRoute('/settings/admin/roles', { name: 'RoleList', }),
  roleDetails: makeRoute('/settings/admin/roles/details', { name: 'RoleDetails' }),
  roleCreate: makeRoute('/settings/admin/roles/create', { name: 'RoleCreate' }),
  roleEdit: makeRoute('/settings/admin/roles/details/:id', {
    name: 'RoleEdit',
    build: (id: string) => `/settings/admin/roles/details/${id}`,
    label: 'Role Management',
  }),

  //use cases
  // useCaseList: makeRoute('/settings/admin/use-cases')
  useCaseList: {
    name: 'UseCases',
    label: 'Use Cases',
    match: '/settings/admin/use-cases',
    build: (query?: CompanyGroupRouteInterface) => buildUrl('/settings/admin/use-cases', query),
  },
  useCaseDetails: {
    name: 'UseCasesDetails',
    match: '/settings/admin/use-cases/detail',
    label: 'Use Case Management',
    build: (query: { id: string; name?: string }) => buildUrl('/settings/admin/use-cases/detail', query),
  },
  useCaseCreate: makeRoute('/settings/admin/use-cases/create', {
    name: 'UseCaseCreate',
    build: () => '/settings/admin/use-cases/create',
    label: 'Create Use Case',
  }),

  // integrations
  integrationLists: makeRoute('/settings/admin/integrations', {
    name: 'integrationList',
  }),
  integrationDetails: makeRoute('/settings/admin/integrations/:id', {
    name: 'IntegrationDetails',
    build: (integrationId: string) => `/settings/admin/integrations/${integrationId}`,
    label: 'Integrations',
  }),
  integrationOkta: {
    name: 'IntegrationOkta',
    match: '/settings/admin/integrations/okta',
    label: 'Okta Settings',
    build: () => buildUrl('/settings/admin/integrations/okta'),
  },

  // company management
  // companyMgmt: makeRoute('/settings/admin/company-management'),
  companyGroupCreate: {
    name: 'CompanyGroupCrate',
    label: 'Company Group Create',
    match: '/settings/admin/company-management-list/create',
    build: (query?: { name?: string }) => buildUrl('/settings/admin/company-management-list/create', query),
  },
  // companyGroupCreate: makeRoute('/settings/admin/company-management-create'),
  companyGroupEdit: makeRoute('/settings/admin/company-management-list/edit/:id', {
    name: 'CompanyGroupEdit',
    build: (id: string) => `/settings/admin/company-management-list/edit/${id}`,
    label: 'Company Group edit',
  }),
  companyMgmtDetail: {
    name: 'CompanyGroupDetail',
    match: '/settings/admin/company-management-list/:id',
    build: (id: string) => `/settings/admin/company-management-list/${id}`,
    label: 'Company Detail',
  },
  companyGroupList: {
    name: 'CompanyGroupList',
    label: 'Company Group List',
    match: '/settings/admin/company-management-list/group',
    build: (query?: CompanyGroupRouteInterface) => buildUrl('/settings/admin/company-management-list/group', query),
  },
  companyList: {
    name: 'CompanyListAdmin',
    match: '/settings/admin/company-management-list',
    build: (query?: { companyId?: string }) => buildUrl('/settings/admin/company-management-list', query),
    label: 'Company List',
  },
  selectedCompanyList: {
    name: 'SelectedCompanyListAdmin',
    match: '/settings/admin/company-management-list/selected',
    build: (query?: { companyId?: string; selectedCompany?: boolean; }) => buildUrl('/settings/admin/company-management-list/selected', query),
    label: 'Selected Company List',
  },

  // Prototypes
  settingsEmail: makeRoute('/settings/messages/email', { name: 'CompanyListAdmin', }),

  // Source System
  sourceSystem: makeRoute('/admin/source-system', { name: 'SourceSystem', }),

  // Others

  dashboardPipelineScreen: makeRoute('/dashboard/pipeline', { name: 'Pipeline', }),
  dashboardPipelineDetailScreen: makeRoute('/dashboard/pipeline/:id', {
    name: 'PipelineDetails',
    build: (pipelineId: string) => `/dashboard/pipeline/${pipelineId}`,
    label: 'Pipeline Detail',
  }),
  dashboardTeamScreen: makeRoute('/dashboard/team', {
    name: 'DashboardTeamScreen',
  }),
  // dashboardTeamDetailScreen: makeRoute('/dashboard/team/details', {
  //   build: (teamId: string) => `/dashboard/team/${teamId}`,
  //   label: 'Team Detail',
  // }),
  dashboardTeamDetailScreen: {
    name: 'DashboardTeamDetails',
    match: '/dashboard/team/:id',
    build: (id: string, query?: { name?: string }) => buildUrl(`/dashboard/team/${id}`, query),
    label: 'Team Detail',
  },
  dashboardEvent: makeRoute('/dashboard/company', { name: 'DashboardEvent' }),
  dashboardMe: makeRoute('/dashboard/me', { name: 'DashboardMe' }),
  settings: makeRoute('/settings', { name: 'Settings' }),
  settingsAdmin: makeRoute('/settings/admin/main', { name: 'AdminMain' }),
  settingsNotifications: makeRoute('/settings/preferences/notifications', { name: 'Notifications' }),
  settingsProfile: makeRoute('/settings/preferences/profile', { name: 'Profile' }),
  settingsResetPassword: makeRoute('/settings/preferences/reset-password', { name: 'ResetPassword' }),
  feedback: makeRoute('/feedback', { name: 'Feedback' }),

  // Super admin
  superUserLogin: makeRoute('/super-admin/login', { name: 'SuperAdminLogin' }),
  superUserForgetPassword: makeRoute('/super-admin/forgot_password', { name: 'super_admin_forget_password_step_1' }),
  superUserPasswordReset: makeRoute('/super-admin/forgot_password/:token', {
    name: 'super_admin_forget_password_step_2',
    build: (tokenId: string) => `/super-admin/forgot_password/${tokenId}`,
  }),
  superUserChangePassword: makeRoute('/super-admin/settings/reset-password', { name: 'super_admin_change_password' }),
  controlPanelScreen: makeRoute('/super-admin/settings/control-panel', { name: 'super_admin_control_panel' }),
  reportScreen: {
    name: 'super_admin_report',
    match: '/super-admin/report/:id',
    build: (id: string) => buildUrl(`/super-admin/report/${id}`),
    label: 'Report',
  },
};

if (process.env.NODE_ENV === 'development') {
  console.log('routes', routes);
}
