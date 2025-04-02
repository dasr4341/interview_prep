import { UserStaffTypes } from "health-generatedTypes";
import { buildUrl, makeRoute } from "./lib-router";
import { PatientAddRouteQuery, PatientAddStep2RouteQuery } from "screens/Settings/Admin/PatientForm/PatientRoutes";

export const employeeManagementRoutes = {
  // admin
  admin: {
    careTeam: {
      create: makeRoute('/dashboard/settings/admin/care-team/create', {
        name: 'CareTeamCreate',
      }),
      edit: {
        match: '/dashboard/settings/admin/care-team/edit/:userId',
        name: 'EditCareTeam',
        build: (userId: string) =>
          buildUrl(`/dashboard/settings/admin/care-team/edit/${userId}`),
      },

    },
    patientList: makeRoute('/dashboard/settings/admin/patient/list', {
      name: 'PatientList',
    }),

    addPatient: {
      view: {
        match: '/dashboard/settings/admin/patient/create/',
        name: 'Add Patient Base Layout',
      },
      patientDetails: {
        match: '/dashboard/settings/admin/patient/create/details',
        name: 'Add Patient Step 1',
        build: (query?: PatientAddRouteQuery) =>
          buildUrl('/dashboard/settings/admin/patient/create/details', query),
      },
      patientContactDetails: {
        match: '/dashboard/settings/admin/patient/create/contact',
        name: 'Add Patient Step 2',
        build: (query?: PatientAddStep2RouteQuery) =>
          buildUrl('/dashboard/settings/admin/patient/create/contact', query),
      },
      patientCareTeam: {
        match: '/dashboard/settings/admin/patient/create/care',
        name: 'Add Patient Step 3',
      },
    },
    employeeUpload: makeRoute('/dashboard/settings/admin/care-team/upload', {
      name: 'EmployeeManagement upload records',
    }),
    employee: {
      list: {
        match: '/dashboard/settings/admin/care-team/list/:staffType',
        name: 'EmployeeManagement',
        build: (staffType: UserStaffTypes) =>
          buildUrl(`/dashboard/settings/admin/care-team/list/${staffType}`),
      },
    },

    employeeDetails: makeRoute('/dashboard/settings/admin/care-team/:id', {
      name: 'EmployeeDetails',
      build: (id: string) => `/dashboard/settings/admin/care-team/${id}`,
    }),
    employeeDetailsScreen: makeRoute(
      '/dashboard/settings/admin/care-team/:id/details',
      {
        name: 'EmployeeDetailsScreen',
        build: (id: string, query?: { employeeName?: string }) =>
          buildUrl(`/dashboard/settings/admin/care-team/${id}/details`, query),
      }
    ),
    employeePatientsScreen: makeRoute(
      '/dashboard/settings/admin/care-team/:id/patient-list',
      {
        name: 'EmployeePatientsScreen',
        build: (id: string, query?: { employeeName?: string }) =>
          buildUrl(
            `/dashboard/settings/admin/care-team/${id}/patient-list`,
            query
          ),
      }
    ),
    patientDetails: {
      match: '/dashboard/settings/admin/patient/:id',
      userDetails: makeRoute(
        '/dashboard/settings/admin/patient/:id/user-details',
        {
          name: 'PatientUserDetails',
          build: (id: string) =>
            `/dashboard/settings/admin/patient/${id}/user-details`,
        }
      ),
      responder: makeRoute('/dashboard/settings/admin/patient/:id/responder', {
        name: 'Responders',
        build: (id: string) =>
          `/dashboard/settings/admin/patient/${id}/responder`,
      }),
    },
  },
}