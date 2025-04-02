import ConfirmationDialog from 'components/ConfirmationDialog';
import Edit from 'components/icons/Edit';
import Button from 'components/ui/button/Button';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from 'components/icons/DeleteIcon';
import CreateNoteModal from './components/modal/CreateNoteModal';
import NoteDetailRow from './components/NoteDetailRow';
import { getNoteQuery } from 'graphql/get-note.query';
import { noteDelete } from 'graphql/note-delete.mutation';
import { client } from 'apiClient';
import {
  GetNote,
  GetNoteVariables,
  GetNote_pretaaHealthGetNote,
  NoteDelete,
  NoteDeleteVariables,
  UserPermissionNames,
} from 'health-generatedTypes';
import DateFormat from 'components/DateFormat';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import EventRowSkeletonLoading from 'screens/EventsScreen/skeletonLoading/EventRowSkeletonLoading';
import SafeHtml from 'components/SafeHtml';
import messages from 'lib/messages';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { ContentHeader } from 'components/ContentHeader';
import { useElementSize } from '@mantine/hooks';

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [noteDetailsError, setNoteDetailsError] = useState<boolean>(false);
  const [confirmationModalState, setConfirmationModalState] = useState(false);
  const [noteDetails, setNoteDetails] = useState<GetNote_pretaaHealthGetNote | null>(null);

  const noteEditPrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.EDIT);
  const noteDeletePrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.DELETE);

  const getNoteDetails = async ({ noteId }: { noteId: string }) => {
    try {
      setLoading(true);
      const { data, errors: getNoteDetailErrors } = await client.query<GetNote, GetNoteVariables>({
        query: getNoteQuery,
        variables: {
          noteId
        }
      });
      if (data) {
        setNoteDetails(data.pretaaHealthGetNote);
      }
      setNoteDetailsError(getNoteDetailErrors ? true : false);
    } catch (e) {
      catchError(e, true);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteNote = async ({ noteId }: { noteId: string }) => {
    try {
      setLoading(true);
      await client.mutate<NoteDelete, NoteDeleteVariables>({
        mutation: noteDelete,
        variables: { 
          pretaaHealthNoteDeleteId: noteId
        }
      });
      toast.success(messages.successList.noteDelete);
      navigate(-1);
      
    } catch (error: any) {
      catchError(error, true);
    } finally {
      setConfirmationModalState(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getNoteDetails({ noteId: id });
    }
  }, [id]);

  const { ref, height } = useElementSize();
  const samllDevice = height + 156;
  const webDevice = height + 112;
  const wrapperHeight = { height: window.innerHeight - webDevice };
  const smallHeight = { height: window.innerHeight - samllDevice };

  return (
    <section>
      <div ref={ref}>
      <ContentHeader title="Note Detail" />
      </div>

      {loading && (
        <div className=" bg-white rounded-xl mt-12 mb-16 w-11/12 mx-auto">
          <EventRowSkeletonLoading />
        </div>
      )}

      {!loading && noteDetails && (
        <div className='overflow-auto' style={ window.innerWidth < 1024 ?  smallHeight : wrapperHeight }>
          <div className="w-11/12 mx-auto my-5 lg:my-10">
            <NoteDetailRow
              title={noteDetails?.subject ? noteDetails.subject : ''}
              content={noteDetails?.text ? <SafeHtml rawHtml={noteDetails.text} /> : ''}
              createdBy={
                <>
                  Note {noteDetails?.isUpdated ? ' updated' : ' created'} as of { ' '}
                  <DateFormat date={String(noteDetails?.isUpdated  ? noteDetails?.updatedAt : noteDetails?.createdAt)} /> by {noteDetails?.creator}
                </>
              }
              eventId={noteDetails?.eventId ? noteDetails.eventId : null}
              patientId={noteDetails?.patientId ? noteDetails.patientId : null}
            />
            
            
          </div>

          {noteDetails?.canModify && (
              <div className="bottom-0 fixed w-full bg-white px-5 py-5 lg:px-16 lg:py-8 border-2
              sm:px-15">
                <div className='flex flex-row'>
                {noteEditPrivilege ? (
                  <Button text="Edit" type="submit" classes={['w-fit', 'mr-6 ']} onClick={() => setShowModal(true)}>
                    <Edit className="w-7 h-7 mr-1" />
                  </Button>
                ) : (
                  ''
                )}
                {noteDeletePrivilege ? (
                  <Button
                    text="Delete"
                    type="submit"
                    buttonStyle="danger"
                    classes={['w-fit', 'text-red']}
                    onClick={() => setConfirmationModalState(true)}>
                    <DeleteIcon className="w-5 h-5 mr-1" />
                  </Button>
                ) : (
                  ''
                )}
                </div>
              </div>
            )}
        </div>
      )}

      {noteDetailsError && <ErrorMessageFixed message={messages.errorList.noteDetails} />}

      {showModal && id && (
        <CreateNoteModal
          onUpdate={(subject: string, text: string) =>
            setNoteDetails((n) => {
              return {
                ...n,
                text,
                subject,
                updatedAt: new Date().getTime(),
              } as GetNote_pretaaHealthGetNote;
            })
          }
          noteSubject={noteDetails?.subject}
          noteBody={noteDetails?.text}
          modalTitle="Edit Note"
          onClick={() => setShowModal(false)}
          noteId={id}
          eventId={noteDetails?.eventId as string}
          patientId={noteDetails?.patientId as string}
        />
      )}

      <ConfirmationDialog
        modalState={confirmationModalState}
        onConfirm={() => onDeleteNote({ noteId: String(id) })}
        disabledBtn={false}
        onCancel={() => setConfirmationModalState(false)}
        className="max-w-sm rounded-xl"
        loading={loading}>
        Are you sure you want to delete this note?
      </ConfirmationDialog>
    </section>
  );
}
