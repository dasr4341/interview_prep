import { useMutation, useQuery } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { DeleteNote, DeleteNoteVariables, NoteDetails, NoteDetailsVariables, UserPermissionNames } from 'generatedTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import Button from 'components/ui/button/Button';
import SafeHtml from 'components/SafeHtml';
import { noteDetailsQuery } from 'lib/query/notes/note-details';
import CompanyName from 'screens/companies/components/CompanyName';
import EventCard, { Loading } from 'screens/events/components/EventCard';
import Edit from 'components/icons/Edit';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import { useEffect, useState } from 'react';
import ConfirmationDialog from 'components/ConfirmationDialog';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { deleteNote as deleteNoteMutation } from 'lib/mutation/notes/delete-note';
import { RiDeleteBinLine } from 'react-icons/ri';
import usePermission from 'lib/use-permission';
import { successList } from '../../lib/message.json';
import NoteCreateModal from './NoteCreateModal';
import { TrackingApi } from 'components/Analytics';

export default function NoteDetailScreen(): JSX.Element {
  const { id }: { id?: string } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: noteDetail,
    error,
    loading,
  } = useQuery<NoteDetails, NoteDetailsVariables>(noteDetailsQuery, {
    variables: {
      noteId: String(id),
    },
  });

  const [deleteNote, { loading: deleteNoteLoading }] = useMutation<DeleteNote, DeleteNoteVariables>(deleteNoteMutation);

  const notesPermission = usePermission(UserPermissionNames.NOTES);

  const onDeleteNote = async () => {
    try {
      if (open) {
        const { data: deletedNote } = await deleteNote({
          variables: { id: String(id) },
        });
        if (deletedNote) {
          toast.success(successList.noteDelete);
          navigate(-1);
        }
      }
    } catch (e) {
      catchError(e, true);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.noteDetail.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Note Detail" />
      <ContentFrame type="with-footer">
        {error && <ErrorMessage message={error.message} />}
        {loading && <Loading />}
        {noteDetail?.pretaaGetNote?.opportunity && (
          <div className="rounded-xl border border-gray-200 px-5 py-6 flex flex-col space-y-1 bg-white">
            <div className="flex flex-row justify-between items-center">
              <div className="uppercase text-xs font-semibold">Opportunity</div>
              <div></div>
            </div>
            <div className="text-base font-bold text-primary">
              <Link to={routes.companyDetail.build(String(noteDetail.pretaaGetNote.company?.id))} className="text-primary-light">
                {noteDetail.pretaaGetNote.company?.name}
              </Link>{' '}
              <span>{noteDetail.pretaaGetNote.opportunity.name}</span>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line max-len */}
        {noteDetail?.pretaaGetNote && !noteDetail?.pretaaGetNote?.eventId && !noteDetail.pretaaGetNote.opportunity && noteDetail.pretaaGetNote.company && (
          <CompanyName
            name={noteDetail?.pretaaGetNote?.company?.name || ''}
            starred={Boolean(noteDetail?.pretaaGetNote?.company?.starredByUser)}
            id={noteDetail?.pretaaGetNote?.company?.id}
            className={`px-6 py-5 h-20 mb-6 rounded-xl shadow-sm 
          bg-white border border-gray-200 text-md`}
            isLinked={true}
            isOnClickStar={true}
          />
        )}

        {noteDetail?.pretaaGetNote?.eventId && <EventCard id={noteDetail.pretaaGetNote.eventId} />}
        <div className="mt-10">
          <h2 data-test-id="note-title" className="text-md font-bold whitespace-pre-wrap">{noteDetail?.pretaaGetNote?.subject}</h2>
          <div className="w-full xl:w-2/3" data-test-id="note-content">
            <SafeHtml className="text-gray-150 my-5 whitespace-pre-wrap" rawHtml={noteDetail?.pretaaGetNote?.text as unknown as string} />
          </div>
        </div>
      </ContentFrame>

      {(notesPermission?.capabilities.EDIT || notesPermission?.capabilities.DELETE) && noteDetail?.pretaaGetNote?.canModify && (
        <ContentFooter>
          <div className="flex flex-row space-x-2">
            {notesPermission.capabilities.EDIT && (
              <span onClick={() => setIsModalOpen(true)}>
                <Button text="Edit" style="primary" classes="w-52 h-11">
                  <Edit className="h-5 w-5 mr-2 " />
                </Button>
              </span>
            )}
            {notesPermission.capabilities.DELETE && (
              <Button text="Delete" style="danger" type="button" classes="w-52 h-11 group" onClick={() => setOpen(true)}>
                <RiDeleteBinLine className="h-5 w-5 mr-2 text-red-500 group-hover:text-white" />
              </Button>
            )}
          </div>
        </ContentFooter>
      )}

      <ConfirmationDialog modalState={open} onConfirm={onDeleteNote} disabledBtn={deleteNoteLoading} onCancel={() => setOpen(false)} className="max-w-sm rounded-xl">
        Are you sure you want to delete this note?
      </ConfirmationDialog>
      {isModalOpen && <NoteCreateModal open={isModalOpen} setOpen={setIsModalOpen} id={id} />}
    </>
  );
}
