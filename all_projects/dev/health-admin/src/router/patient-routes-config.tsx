import AppPermissionGuard from 'guards/AppPermissionGuard';
import { UserPermissionNames } from 'health-generatedTypes';
import { Route } from 'react-router-dom';
import PatientContactList from 'screens/Patient/PatientContactList';
import PatientDetails from 'screens/Patient/PatientDetails';
import PatientList from 'screens/Patient/PatientList';
import PatientTimeline from 'screens/Patient/PatientTimeline';
import PretaaContactsDetails from 'screens/PretaaContacts/PretaaContactsDetails';
import { patientRoutes } from './patient-routes';
import SurveysList from 'screens/surveys/Patient/SurveysList';
import ListOpenOrCompleted from 'screens/surveys/Patient/components/ListOpenOrCompleted';
import SurveyFormSubmitted from 'screens/surveys/Patient/SurveyFormSubmitted';
import SurveyFormPreview from 'screens/surveys/SurveyFormPreview';
import NotesDetails from 'screens/notes/NotesDetails';
import Notes from 'screens/notes/Notes';
import EventDetailsPage from 'screens/EventDetailsScreen/EventDetailsPage';
import { routes } from 'routes';

export const PatientRoutesConfig = [
  <Route
    element={<AppPermissionGuard privileges={UserPermissionNames.PATIENTS} />}
    key="patientRoutes">
    <Route
      element={<PatientList />}
      path={patientRoutes.patientList.match}
    />
    <Route
      element={<PatientDetails />}
      path={patientRoutes.patientDetails.match}
    />
    <Route
      path={patientRoutes.patientContact.list.match}
      element={<PatientContactList />}
    />
    <Route
      path={patientRoutes.patientContact.details.match}
      element={<PretaaContactsDetails />}
    />
    <Route
      element={<PatientTimeline />}
      path={patientRoutes.patientTimeline.match}
    />
    <Route
      path={patientRoutes.patientSurveyDetailsPage.match}
      element={<SurveyFormSubmitted />}
    />
  </Route>,
  <Route
    element={<AppPermissionGuard privileges={UserPermissionNames.SURVEYS} />}
    key="patientRoutesSurvey">
    <Route
      path={patientRoutes.patientSurveyList.list.match}
      element={<SurveysList />}>
      <Route
        path={patientRoutes.patientSurveyList.open.match}
        element={<ListOpenOrCompleted />}
      />
      <Route
        path={patientRoutes.patientSurveyList.completed.match}
        element={<ListOpenOrCompleted />}
      />
    </Route>

    <Route
      path={patientRoutes.patientSurveyList.submitted.match}
      element={<SurveyFormSubmitted />}
    />
    <Route
      path={patientRoutes.patientSurveyList.submit.match}
      element={<SurveyFormPreview />}
    />
  </Route>,
  <Route
    element={<AppPermissionGuard privileges={UserPermissionNames.NOTES} />}
    key="patient-notes">
    <Route
      element={<NotesDetails />}
      path={patientRoutes.patientNotesDetails.match}
    />
    <Route
      path={patientRoutes.patientNotes.match}
      element={<Notes />}
    />
  </Route>,
  <Route
    element={<AppPermissionGuard privileges={UserPermissionNames.EVENTS} />}
    key="patient-event">
    <Route
      path={patientRoutes.timelineEventDetails.match}
      element={<EventDetailsPage />}
    />
    <Route
      element={<AppPermissionGuard privileges={UserPermissionNames.CONTACTS} />}
      key="contacts">
      <Route
        path={routes.eventContactsPage.match}
        element={<PatientContactList />}
      />
      <Route
        path={routes.eventContactDetails.match}
        element={<PretaaContactsDetails />}
      />
    </Route>
  </Route>,
];
