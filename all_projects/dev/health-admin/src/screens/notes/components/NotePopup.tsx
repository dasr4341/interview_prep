import React, { useState } from 'react';
import ThreeDotIcon from 'components/icons/ThreeDotIcon';
import CreateNoteModal from './modal/CreateNoteModal';
import ConfirmationDialog from 'components/ConfirmationDialog';
import messages from 'lib/messages';
import { toast } from 'react-toastify';
import { NoteDelete, NoteDeleteVariables, FilteredNotes_pretaaHealthGetFilteredNotes, UserPermissionNames } from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { client } from 'apiClient';
import { noteDelete } from 'graphql/note-delete.mutation';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import Popover, { PopOverItem } from 'components/Popover';

interface NotePopupInterface {
  noteId: string;
  setNoteLists: React.Dispatch<React.SetStateAction<FilteredNotes_pretaaHealthGetFilteredNotes[]>>;
  noteBody: string;
  noteSubject: string;
  canModify: boolean;
  eventId?: string;
  patientId?: string;
  searchEmpty?: () => void;
}

export default function NotePopup({ noteId, setNoteLists, noteBody, noteSubject, canModify, eventId, patientId, searchEmpty }: NotePopupInterface) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [confirmationModalState, setConfirmationModalState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const noteEditPrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.EDIT);
  const noteDeletePrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.DELETE);

  const onDeleteNote = async () => {
    try {
      setLoading(true);
      const { errors: responseErrors } = await client.mutate<NoteDelete, NoteDeleteVariables>({
        mutation: noteDelete,
        variables: {
          pretaaHealthNoteDeleteId: noteId,
        },
      });

      if (responseErrors) {
        setConfirmationModalState(false);
        toast.error(getGraphError(responseErrors).join(','));
      } else {
        setNoteLists((n) => n.filter((e: any) => e.id !== noteId));
        setConfirmationModalState(false);
        toast.success(messages.successList.noteDelete);
      }
    } catch (error) {
      setConfirmationModalState(false);
      toast.warning(messages.errorList.noNoteWarning);
    } finally {
      setLoading(false);
    }
  };

  function onUpdateOfNote(subject: string, text: string, editedNoteId?: string) {
    // updating the note list array programmatically
    setNoteLists((n) =>
      n.map((e) => {
        if (e.id === editedNoteId) {
          return {
            ...e,
            text,
            subject,
            updatedAt: new Date().getTime(),
          };
        }
        return e;
      })
    );

    if (searchEmpty){
      searchEmpty();
    }
  }

  return (
    <>
      {canModify &&
        <Popover 
          trigger = {
            <button>
              <ThreeDotIcon className="w-4 h-1 m-2 cursor-pointer text-gray-600 hover:text-gray-800" />
            </button>
          }
        >
          {noteEditPrivilege ? <PopOverItem onClick={() => setShowModal(true)}>Edit</PopOverItem> : ''}
          {noteDeletePrivilege ? <PopOverItem onClick={() => setConfirmationModalState(true)}>Delete</PopOverItem> : ''}

        </Popover>
      }

      <ConfirmationDialog
        modalState={confirmationModalState}
        onConfirm={onDeleteNote}
        disabledBtn={false}
        onCancel={() => setConfirmationModalState(false)}
        className="max-w-sm rounded-xl"
        loading={loading}>
        Are you sure you want to delete this note?
      </ConfirmationDialog>

      {showModal && (
        <CreateNoteModal
          onUpdate={onUpdateOfNote}
          noteBody={noteBody}
          noteSubject={noteSubject}
          modalTitle="Edit Note"
          onClick={() => setShowModal(false)}
          noteId={String(noteId)}
          eventId={eventId}
          patientId={patientId}
        />
      )}
    </>
  );
}