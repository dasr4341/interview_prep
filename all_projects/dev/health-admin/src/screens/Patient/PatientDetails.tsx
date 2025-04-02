import React, { useState } from 'react';
import { ContentHeader } from 'components/ContentHeader';
import PageLinks from '../../components/PageLink';
import { routes } from 'routes';
import { useParams } from 'react-router-dom';
import CreateNoteOverlay from 'screens/notes/components/CreateNoteOverlay';
import InviteSupporterPopup from './components/InviteSupporterPopup/InviteSupporterPopup';
import {
  SurveyStatusTypePatient,
  UserPermissionNames,
} from 'health-generatedTypes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import PatientDetailsCard from 'components/PatientDetailsCard';
import { Skeleton } from '@mantine/core';
import useGetPatientDetails from 'customHooks/useGetPatientDetails';

export default function PatientDetails() {
  const { id } = useParams();
  const noteCreatePrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.CREATE);
  const [noteCount, setNoteCount] = useState<number>(0);
  const { patientDetailsState, loading } = useGetPatientDetails();
  const hasNotesPrivilages = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.VIEW);
  const hasGeoFencePrivilages = useGetPrivilege(UserPermissionNames.GEOFENCES, CapabilitiesType.VIEW);

  function updateListOnCreateNode(
    subject: string,
    text: string,
    noteId?: string,
    canModify?: boolean,
    errorExist?: boolean,
  ) {
    if (errorExist === false) {
      setNoteCount(noteCount + 1);
    }
  }

  return (
    <>
      <ContentHeader>
        <div className="block sm:flex sm:justify-between sm:items-center heading-area">
          <div className="header-left sm:w-2/4">
            {loading && (
              <Skeleton
                width={window.innerWidth < 640 ? '90%' : 400}
                height={24}
                mt={4}
              />
            )}
            {patientDetailsState?.data && (
              <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5 md:mb-0">
                Patient Details
              </h1>
            )}
          </div>
          <div className="header-right min-w-fit mt-3 sm:mt-0 sm:w-2/4 px-0 sm:px-3 hidden">
            <InviteSupporterPopup />
          </div>
        </div>
      </ContentHeader>

      <div className="my-12 w-11/12 mx-auto ">
        {patientDetailsState?.data && (
          <>
            {/* profile block 1 */}
            <PatientDetailsCard patientId={String(id)} />

            {/* profile block 2 */}
            <div className="rounded-xl border border-border bg-white mt-6">
              {hasNotesPrivilages && (
                <PageLinks
                  tabIndex={2}
                  text="Notes"
                  count={patientDetailsState.data.noteCount || 0}
                  linkTo={routes.patientNotes.build(String(id))}
                  testId="note-link"
                />
              )}
              <PageLinks
                tabIndex={3}
                text="Contacts"
                linkTo={routes.patientContact.list.build(String(id))}
              />
              <PageLinks
                tabIndex={4}
                text="Timeline"
                linkTo={routes.patientTimeline.build(String(id))}
                count={patientDetailsState.data.timelineCount || 0}
              />
              <PageLinks
                tabIndex={5}
                linkTo={routes.patientSurvey.openOrCompletedSurvey.build(String(id), SurveyStatusTypePatient.COMPLETED)}
                text="Assessments"
              />

              {hasGeoFencePrivilages && (
                <>
                  <PageLinks
                    tabIndex={6}
                    linkTo={routes.listView.build(String(patientDetailsState.data.id))}
                    text="Geofences"
                  />
                  <PageLinks
                    tabIndex={7}
                    text="Last Known Location"
                    linkTo={routes.lastLocations.build(String(id))}
                  />
                </>
              )}
            </div>

            {noteCreatePrivilege && <CreateNoteOverlay onUpdate={updateListOnCreateNode} />}
          </>
        )}
      </div>
    </>
  );
}
