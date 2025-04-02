import AppPermissionGuard from 'guards/AppPermissionGuard';
import { UserPermissionNames } from 'health-generatedTypes';
import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';
import { routes } from 'routes';
import PatientCareTeamForm from './PatientCareTeamForm';

const PatientCareTeam = lazyWithPreload(() => import('./PatientCareTeamForm'));
const PatientContactDetailsForm =  lazyWithPreload(() => import('./PatientContactDetailsForm'));
const PatientDetailsForm = lazyWithPreload(() => import('./PatientDetailsForm'));
const PatientFormView = lazyWithPreload(() => import('screens/Settings/Admin/PatientForm/PatientFormView'));

export const patientRoutesPreload = [
  PatientCareTeam,
  PatientContactDetailsForm,
  PatientDetailsForm,
  PatientFormView
];

export interface PatientAddRouteQuery { patientId: string }
export interface PatientAddStep2RouteQuery { 
  patientId?: string;
  patientDetails?: string;
 }
 export interface PatientAddStep3RouteQuery { 
  patientId?: string;
  patientDetails?: string;
  contactDetails?: string;
 }


export const PatientAddRoutes = [
  <Route element={<AppPermissionGuard privileges={UserPermissionNames.PATIENT_MANAGEMENT} />} key={'PatientAddRoutesKey'}>
  <Route  path={routes.admin.addPatient.view.match} element={<PatientFormView />}>
    <Route path={routes.admin.addPatient.patientDetails.match} element={<PatientDetailsForm />} />
    <Route path={routes.admin.addPatient.patientContactDetails.match} element={<PatientContactDetailsForm />} />
    <Route path={routes.admin.addPatient.patientCareTeam.match} element={<PatientCareTeamForm />} />
  </Route>
  </Route>,
];
