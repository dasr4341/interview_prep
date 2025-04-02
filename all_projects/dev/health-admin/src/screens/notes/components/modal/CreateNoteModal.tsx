import React from 'react';
import CreateNoteForm from '../Form/CreateNoteForm';
import NoteBackgroundOverlay from '../NoteBackgroundOverlay';

interface CreateNoteModalInterface {
  modalTitle: string; 
  onClick: () => void; 
  noteId?: string;
  eventId?: string;
  patientId?: string;
  noteBody?: string;
  noteSubject?: string;
  onUpdate?: (subject: string, text: string, editedNoteId?: string, canModify?: boolean, errorExist?: boolean) => void;
}
export default function CreateNoteModal({ modalTitle, onClick, noteId, eventId, patientId, noteBody, noteSubject, onUpdate }: CreateNoteModalInterface) {
  return (
    <NoteBackgroundOverlay onClick={() => onClick()}>
      <CreateNoteForm
        title={modalTitle}
        noteId={noteId} 
        onClick={() => onClick()} 
        eventId={eventId} 
        patientId={patientId} 
        noteBody={noteBody} 
        noteSubject={noteSubject} 
        onUpdate={onUpdate}
       />
    </NoteBackgroundOverlay>
  );
}
