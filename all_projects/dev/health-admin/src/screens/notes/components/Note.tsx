import {
  FilteredNotes_pretaaHealthGetFilteredNotes,
  UserPermissionNames,
} from 'health-generatedTypes';
import React, { useEffect, useState } from 'react';
import DateFormat from 'components/DateFormat';
import { Link, useLocation, useParams } from 'react-router-dom';
import { routes } from 'routes';
import NotePopup from './NotePopup';
import './_notes-list.scoped.scss';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import DOMPurify from 'dompurify';

export default function Notes({
  note,
  setNoteLists,
  eventId,
  patientId,
  searchEmpty,
}: {
  note: FilteredNotes_pretaaHealthGetFilteredNotes;
  setNoteLists: React.Dispatch<
    React.SetStateAction<FilteredNotes_pretaaHealthGetFilteredNotes[]>
  >;
  eventId?: string;
  patientId?: string;
  searchEmpty?: () => void;
}) {
  const noteEditPrivilege = useGetPrivilege(
    UserPermissionNames.NOTES,
    CapabilitiesType.EDIT
  );
  const noteDeletePrivilege = useGetPrivilege(
    UserPermissionNames.NOTES,
    CapabilitiesType.DELETE
  );
  const [noteDetailsPath, setNoteDetailsPate] = useState<string>('');
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes(routes.eventNotesPage.build(String(params.id)))
    ) {
      setNoteDetailsPate(routes.eventNotesDetails.build(String(note.id)));
    } else if (
      location.pathname.includes(routes.patientNotes.build(String(params.id)))
    ) {
      setNoteDetailsPate(routes.patientNotesDetails.build(String(note.id)));
    } else {
      setNoteDetailsPate(routes.notesDetails.build(String(note.id)));
    }
  }, [location.pathname, note.id, params.id]);

  return (
    <div
      className="grid grid-cols-5 justify-between noteList-border bg-white"
      data-testid="notes-row">
      <Link
        to={noteDetailsPath}
        className="flex flex-col col-span-3 md:col-span-4">
        <div
          className="font-bold text-base text-primary"
          data-testid="note-headline">
          {note.subject}
        </div>
        <div
          className="text-sm font-normal mt-0.5 text-primary text-justify flex"
          data-testid="note-details"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(note.text),
          }}
        />
      </Link>
      <div className="flex items-center justify-end time col-span-2 md:col-span-1">
        <div
          className={`p-2 ${
            noteEditPrivilege && noteDeletePrivilege && 'border-r-2'
          } text-gray-600 font-medium text-sm text-right`}>
          <DateFormat
            date={String(note.isUpdated ? note.updatedAt : note.createdAt)}
          />
        </div>
        {noteEditPrivilege && noteDeletePrivilege && (
          <NotePopup
            noteBody={note.text}
            noteSubject={note.subject}
            noteId={note.id}
            eventId={eventId ?? note?.eventId as string}
            patientId={patientId ?? note.patientId as string}
            setNoteLists={setNoteLists}
            canModify={Boolean(note.canModify)}
            searchEmpty={searchEmpty}
          />
        )}
      </div>
    </div>
  );
}
