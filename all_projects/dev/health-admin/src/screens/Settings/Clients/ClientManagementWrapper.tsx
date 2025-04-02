import React from 'react';
import lazyWithPreload from 'react-lazy-with-preload';
import { Route } from 'react-router-dom';

import { routes } from 'routes';
import FacilityFormContext from 'screens/Owner/SourceSystem/FacilityFormContext';
import FacilityManagementContext from 'screens/Owner/component/FacilityManagementContext';

const ClientManagement = lazyWithPreload(() => import('screens/Settings/Clients/ClientManagement'));
const ClientDetails = lazyWithPreload(() => import('screens/Settings/Clients/ClientDetails'));
const AddOrEditClient = lazyWithPreload(() => import('screens/Settings/Clients/AddOrEditClient'));
const FacilityManagement = lazyWithPreload(() => import('screens/Owner/FacilityList/FacilityManagement'));
const SourceSystemList = lazyWithPreload(() => import('screens/Owner/SourceSystem/SourceSystemList'));
const FacilityForm = lazyWithPreload(() => import('screens/Owner/SourceSystem/FacilityForm'));
const FacilityChooseLocation = lazyWithPreload(
  () => import('screens/Owner/SourceSystem/FacilityChooseLocation')
);
const ActiveUserList = lazyWithPreload(() => import('screens/Owner/FacilityList/ActiveUserList'));

export const clientManagementRoutesPreload = [
  ClientManagement,
  ClientDetails,
  AddOrEditClient,
  FacilityManagement,
  SourceSystemList,
  FacilityForm,
  FacilityChooseLocation,
  ActiveUserList
];

export const ClientManagementRoutes = [
  <Route key="clientManagement">
    <Route
      path={routes.owner.clientManagement.match}
      element={<ClientManagement />}
    />
    <Route
      path={routes.owner.clientDetails.match}
      element={<ClientDetails />}
    />
    <Route
      path={routes.owner.addNewClient.match}
      element={<AddOrEditClient />}
    />
    <Route
      path={routes.owner.editClient.match}
      element={<AddOrEditClient />}
    />

    <Route
      path={routes.owner.sendInvitation.match}
      element={<AddOrEditClient />}
    />

    <Route
      path={routes.owner.FacilityManagement.match}
      element={<FacilityManagementContext><FacilityManagement /></FacilityManagementContext>}
    />
    <Route
      path={routes.owner.sourceSystem.match}
      element={<SourceSystemList />}
    />
    <Route
      path={routes.owner.addFacility.match}
      element={
        <FacilityFormContext>
          <FacilityForm />
        </FacilityFormContext>
      }
    />
    <Route
      path={routes.owner.updateFacility.match}
      element={
        <FacilityFormContext>
          <FacilityForm />
        </FacilityFormContext>
      }
    />
    <Route
      path={routes.owner.facilityChooseLocation.match}
      element={
        <FacilityFormContext>
          <FacilityChooseLocation />
        </FacilityFormContext>
      }
    />
    <Route
      path={routes.owner.activeUserForFacility.match}
      element={<ActiveUserList />}
    />
  </Route>,
];
