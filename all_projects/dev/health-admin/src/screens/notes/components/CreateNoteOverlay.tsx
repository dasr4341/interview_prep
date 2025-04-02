/*  */
import React, { useEffect, useState } from 'react';
import CloseIcon from 'components/icons/CloseIcon';
import Note from 'components/icons/Note';
import PlusIcon from 'components/icons/PlusIcon';
import CreateNoteModal from './modal/CreateNoteModal';
import NoteBackgroundOverlay from './NoteBackgroundOverlay';
import './_notes-list.scoped.scss';
import { useParams } from 'react-router';

interface CreateNoteStateInterface {
  showPopUp?: boolean;
  showModal?: boolean;
}

export default function CreateNoteOverlay({ onUpdate }: { onUpdate?: (subject: string, text: string, editedNoteId?: string, canModify?: boolean, errorExist?: boolean) => void }) {
  const { id }: { id: string } = useParams() as any; // EVENT ID or patient id
  const [patientId, setPatientId] = useState<string | undefined>();
  const [eventId, setEventId] = useState<string | undefined>();

  useEffect(() => {
    if ((location.pathname.includes('patient/event') || location.pathname.includes('events')) && id) {
      setEventId(id);
      setPatientId(undefined);
    } else if (location.pathname.includes('patient') && id) {
      setPatientId(id);
      setEventId(undefined);
    }
  }, [location.pathname, id]);

  // when user click on create note button (lower right hand corner) -
  // we will  show a popup ***
  const [createNoteState, setCreateNoteState] = useState<CreateNoteStateInterface>({ showPopUp: false });

  return (
    <React.Fragment>
      {createNoteState?.showPopUp && <NoteBackgroundOverlay onClick={() => setCreateNoteState({ showPopUp: false })} />}
      {createNoteState?.showModal && (
        <CreateNoteModal
          patientId={patientId}
          eventId={eventId}
          modalTitle="New Note"
          onClick={() => setCreateNoteState({ showModal: false })}
          onUpdate={onUpdate}
        />
      )}

      {!createNoteState?.showModal && (
        <div className="fixed bottom-10 right-10  flex items-center modal-overlay">
          {/* ------------------------------ */}
          {/* popup *** */}
          {createNoteState?.showPopUp && (
            <React.Fragment>
              <div className="absolute bg-white items-center rounded block bottom-10 right-12 lg:right-16 min-w-240 overflow-hidden">
                <div
                  className="cursor-pointer flex py-4 px-5 hover:bg-gray-100 items-center"
                  onClick={() => setCreateNoteState({ ...createNoteState, showModal: true })}>
                  <Note className="text-primary-light" />{' '}
                  <span className=" text-sm font-medium pl-2" data-testid="note_option">
                    Note
                  </span>
                </div>
              </div>
            </React.Fragment>
          )}
          {/* ------------------------------ */}

          {/* create note button (lower right hand corner) */}
          <div
            className={`${createNoteState?.showPopUp ? 'bg-yellow-500' : 'bg-black'} rounded-full cursor-pointer`}
            onClick={() =>
              setCreateNoteState({
                showPopUp: !createNoteState?.showPopUp,
              })
            }>
            {createNoteState?.showPopUp ? (
              <CloseIcon className="text-white w-8 h-8 p-2 lg:w-14 lg:h-14 lg:p-4" />
            ) : (
                <PlusIcon className="text-white w-8 h-8 p-2 lg:w-14 lg:h-14 lg:p-4" />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
