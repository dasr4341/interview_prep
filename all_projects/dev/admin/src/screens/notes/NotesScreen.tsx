/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation } from '@apollo/client';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { SearchField } from 'components/SearchField';
import {
  DeleteNote,
  DeleteNoteVariables,
  GetNotesVariables,
  GetNotes_pretaaGetUserNotes,
  PretaaGetOpprtunityNotes_pretaaGetOpprtunityNotes,
  UserPermissionNames,
  GetCompany,
  GetCompanyVariables,
  CreateNote_pretaaNoteCreate,
  NoteDetails_pretaaGetNote,
} from 'generatedTypes';
import catchError from 'lib/catch-error';
import { deleteNote as deleteNoteMutation } from 'lib/mutation/notes/delete-note';
import { range } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'routes';
import queryString from 'query-string';
import usePermission from 'lib/use-permission';
import EmptyNote from './components/EmptyNote';
import { successList } from '../../lib/message.json';
import NoteCreateModal from './NoteCreateModal';
import EmptyFilter from 'components/EmptyFilter';
import { GetCompanyQuery } from 'lib/query/company/get-company';
import { TrackingApi } from 'components/Analytics';
import NoteView from './NoteView';
import { Virtuoso } from 'react-virtuoso';
import FooterVirtualScroll from 'components/FooterVirtualScroll';
import notesApi from 'lib/api/notes';
import _ from 'lodash';

const Loading = () => (
  <>
    {range(0, 5).map((i) => (
      <div className="ph-item" key={i}>
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-4 empty"></div>
            <div className="ph-col-2"></div>
          </div>
        </div>
      </div>
    ))}
  </>
);



export default function NotesScreen() {
  const location = useLocation();
  const { id }: { id?: string } = useParams();
  const notesPermission = usePermission(UserPermissionNames.NOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryP: { count?: string; opportunityId?: string } = queryString.parse(location.search) as any;
  const [notes, setNotes] = useState<GetNotes_pretaaGetUserNotes[] | PretaaGetOpprtunityNotes_pretaaGetOpprtunityNotes[]>([]);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [notesQueryVar, setNotesQueryVar] = useState<GetNotesVariables>({
    ...(location.pathname.includes('companies') ? { companyId: id } : location.pathname.includes('events') && { eventId: id }),
  });
  const list = useRef<any>();
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');

  const [deleteNote, { loading: deleteNoteLoading }] = useMutation<DeleteNote, DeleteNoteVariables>(deleteNoteMutation);
  const [getCompany, { data: company }] = useLazyQuery<GetCompany, GetCompanyVariables>(GetCompanyQuery);

  function setAllDataLoaded(count: number) {
    if (count === 0) {
      setNoMoreData(true);
    }
  }
  const getAllNotes = async (queryVariables: GetNotesVariables) => {
    const data = await notesApi.getNotesScreenData(queryP, queryVariables);
    setNotes(data);
    setAllDataLoaded(data.length);
    setLoadingData(false);
  };

  const onDeleteNote = async () => {
    try {
      if (noteToDelete) {
        const { data: deletedNote } = await deleteNote({
          variables: { id: noteToDelete },
        });
        if (deletedNote) {
          setNoteToDelete(null);
          toast.success(successList.noteDelete);
          await getAllNotes(notesQueryVar);
        }
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  async function loadMore() {
    const queryVariables = {
      ...notesQueryVar,
      skip: notes.length
    };
    const data = await notesApi.getNotesScreenData(queryP, queryVariables);
    setNotes(notes.concat(data as any));
    setAllDataLoaded(data.length);
    setLoadingData(false);
  }

 
  function filterNotes({ phrase }: { phrase: string }) {
    setNotesQueryVar({ ...notesQueryVar, phrase });
  }

  function handleOnEdit(noteId: string) {
    setIsModalOpen(true);
    setSelectedNote(noteId);
  }

  function handleOnNoteCreated(data: CreateNote_pretaaNoteCreate | NoteDetails_pretaaGetNote) {
    const listData = _.cloneDeep(notes);
    listData.unshift(data as any);
    setNotes(listData);
  }

  function handleOnNoteEdited(data: CreateNote_pretaaNoteCreate | NoteDetails_pretaaGetNote) {
    const index = notes.findIndex(i => i.id === data.id);
    const listData = _.cloneDeep(notes);
    listData[index] = {
      ...notes[index],
      text: data.text,
      subject: data.subject,
    };
    setNotes(listData);
  }
  
  // Use effects

  useEffect(() => {
    if (notesQueryVar.companyId) {
      getCompany({
        variables: {
          companyId: notesQueryVar.companyId,
        },
      });
    }
  }, [notesQueryVar]);

  useEffect(() => {
    if (notesQueryVar) {
      getAllNotes(notesQueryVar);
    }
  }, [notesQueryVar]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.notes.name,
    });
  }, []);

  function handleEndReach() {
    if (!noMoreData) {
      loadMore();
    }
  }

  function rowRendererVirtue(
    index: number,
    n: any,
  ) {
    return (
      <>
      <NoteView key={n.id} note={n} onEdit={handleOnEdit} setNoteToDelete={setNoteToDelete} index={index} />
      </>
    );
  }

  const footerComponent = () => {
    return (
      <FooterVirtualScroll noMoreData={noMoreData} list={notes} />
    );
  };

  return (
    <>
      <ContentHeader disableGoBack={id ? false : true} title="My Notes" count={queryP.count ? Number(queryP.count) : 0}>
        <div>
          <SearchField
            defaultValue={''}
            onSearch={(phrase) => {
              filterNotes({ phrase });
            }}
          />
        </div>
      </ContentHeader>
      <ContentFrame className="flex flex-col flex-1">
        {!notes.length && loadingData && <Loading />}
        {!notesQueryVar.phrase && !notes.length && !loadingData && <EmptyNote />}
        {notesQueryVar.phrase && !notes.length && !loadingData && <EmptyFilter />}
        <Virtuoso
          ref={list}
          data={notes}
          endReached={handleEndReach}
          overscan={200}
          itemContent={rowRendererVirtue}
          components={{ Footer: footerComponent }}
        />

        {/* Edit Time */}
        {isModalOpen && <NoteCreateModal open={isModalOpen} setOpen={setIsModalOpen} id={selectedNote} onSubmitted={handleOnNoteEdited} />}
      </ContentFrame>

      <ConfirmationDialog
        modalState={!!noteToDelete}
        onConfirm={onDeleteNote}
        disabledBtn={deleteNoteLoading}
        onCancel={() => setNoteToDelete(null)}
        className="max-w-sm rounded-xl">
        Are you sure you want to delete this note?
      </ConfirmationDialog>

      {notesPermission?.capabilities.CREATE && (
        <button
          data-test-id="floating-btn"
          className="text-gray-600 w-14 h-14 flex
          items-center justify-center floating-btn
          fixed right-12 bottom-12 bg-primary-light rounded-full"
          onClick={() => setIsOpen(true)}>
          <BsPlus className="text-white text-lg" />
        </button>
      )}

      {/* Create time */}
      {isOpen && (
        <>
          {id === notesQueryVar.eventId && <NoteCreateModal open={isOpen} setOpen={setIsOpen} eventId={id} onSubmitted={handleOnNoteCreated} />}

          {id === notesQueryVar.companyId && company?.pretaaGetCompany && (
            <NoteCreateModal
              open={isOpen}
              setOpen={setIsOpen}
              company={{
                id: company.pretaaGetCompany.id,
                name: company.pretaaGetCompany.name,
                isStarred: Boolean(company.pretaaGetCompany.starredByUser),
              }}
              onSubmitted={handleOnNoteCreated}
            />
          )}
          {queryP?.opportunityId && <NoteCreateModal open={isOpen} setOpen={setIsOpen} opportunityId={String(queryP?.opportunityId)} onSubmitted={handleOnNoteCreated} />}
        </>
      )}
    </>
  );
}

