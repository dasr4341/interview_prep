import DateFormat from 'components/DateFormat';
import Popover, { PopOverItem } from 'components/Popover';
import SafeHtml from 'components/SafeHtml';
import { GetNotes_pretaaGetUserNotes, PretaaGetOpprtunityNotes_pretaaGetOpprtunityNotes, UserPermissionNames } from 'generatedTypes';
import usePermission from 'lib/use-permission';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function NoteView({
  note,
  onEdit,
  setNoteToDelete,
  index,
}: {
  note: GetNotes_pretaaGetUserNotes | PretaaGetOpprtunityNotes_pretaaGetOpprtunityNotes;
  onEdit: any;
  setNoteToDelete: any;
  index: number,
}) {
  const notesPermission = usePermission(UserPermissionNames.NOTES);

  return (
    <div
      data-testid="note-item"
      className={`flex flex-row bg-white w-full px-4 py-6 text-base items-center space-x-4
        border-b  border-gray-100 ${index === 0 ? 'rounded-t-xl' : ''}`}
      key={note.id}
      data-test-id="notes" data-item-index={index}>
      <Link to={routes.noteDetail.build(note.id.toString())} className="flex-1">
        <span
          className="text-gray-600 text-sm font-semibold line-clamp-2
              md:line-clamp-none" data-test-id="note-headline">
          {note.company?.name.toUpperCase()}
        </span>
        <span className="text-pt-primary font-bold line-clamp-1" data-test-id="note-subject">{note.subject}</span>
        <SafeHtml rawHtml={note.text} id="note-description" className="text-pt-primary max-h-24 overflow-hidden break-all" />
      </Link>
      <span className="text-sm space-x-4 text-gray-600">
        <DateFormat date={note.createdAt} />
      </span>
      {(notesPermission?.capabilities.EDIT || notesPermission?.capabilities.DELETE) && note?.canModify && (
        <>
          <div className="w-px bg-gray-400 h-4" />
          <Popover>
            {notesPermission.capabilities.EDIT && <PopOverItem onClick={() => onEdit(note.id)}>Edit</PopOverItem>}

            {notesPermission.capabilities.DELETE && <PopOverItem onClick={() => setNoteToDelete(note.id)}>Delete</PopOverItem>}
          </Popover>
        </>
      )}
    </div>
  );
}
