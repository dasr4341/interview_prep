/*  */
import React, { useContext, useEffect, useRef, useState } from 'react';
import Note from './components/Note';
import CreateNoteOverlay from './components/CreateNoteOverlay';
import { allNotes } from 'graphql/note-list.query';
import { Virtuoso } from 'react-virtuoso';
import {
  FilteredNotes,
  FilteredNotesVariables,
  FilteredNotes_pretaaHealthGetFilteredNotes,
  PatientDetails,
  PatientDetailsVariables,
  PatientDetails_pretaaHealthPatientDetails,
  UserPermissionNames,
} from 'health-generatedTypes';
import { ContentHeader } from 'components/ContentHeader';
import { useParams, useLocation, } from 'react-router-dom';
import NotFoundIcon from 'components/icons/NotFoundIcon';
import CreateNoteModal from './components/modal/CreateNoteModal';
import EventRowSkeletonLoading from 'screens/EventsScreen/skeletonLoading/EventRowSkeletonLoading';
import NoDataFound from 'components/NoDataFound';
import { useViewportSize } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { config } from 'config';
import { useLazyQuery } from '@apollo/client';
import catchError from 'lib/catch-error';
import Button from 'components/ui/button/Button';
import CustomSearchField from 'components/CustomSearchField';
import { getSearchedPhaseQuery } from 'components/lib/CustomSearchFieldLib';
import { patientDetailsQuery } from 'graphql/patientDetails.query';
import { HeaderContext } from 'components/ContentHeaderContext';

export default function Notes() {
  const { id }: { id: string } = useParams() as any; // EVENT ID or patient id
  const { pathname } = useLocation();

  const [searchFieldData, setSearchFieldData] = useState('');
  const [eventId, setEventId] = useState<string | undefined>();
  const [patientId, setPatientId] = useState<string | undefined>();
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [noteLists, setNoteLists] = useState<FilteredNotes_pretaaHealthGetFilteredNotes[]>([]);
  const [listHasMoreData, setListHasMoreData] = useState(true);
  const [clearSearchPhase, setClearSearchPhase] = useState(false);
  const [showBackButton, setShowBackButton] = useState<boolean>(true);
  const noOfRerender = useRef<number>(0);
  const [noteHeading, setNoteHeading] = useState<string>('My Notes');
  const [patientDetailsState, setPatientDetailsState] = useState<PatientDetails_pretaaHealthPatientDetails | null>(null);

  const noteCreatePrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.CREATE);

  const { setValue } = useForm();

  useEffect(() => {
    
    if (pathname.includes('dashboard/notes')) {
      setNoteLists([]);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes('/events')) {
      setShowBackButton(false);
    } else if (pathname.includes('/patient')) {
      setShowBackButton(false);
    } else {
     setShowBackButton(true);
    }
  }, [pathname]);
  
  function getParams() {
    const params: any = {
      eventId: null,
      patientId: null,
    };
    if (pathname.includes('events')) {
      params.eventId = String(id);
    } else if (pathname.includes('patient')) {
      params.patientId = String(id);
    }
    return params;
  }

  const [getListData, { loading }] = useLazyQuery<FilteredNotes, FilteredNotesVariables>(allNotes, {
    fetchPolicy: 'no-cache',
    onCompleted: (d) => {
      if (d.pretaaHealthGetFilteredNotes) {
        const prevData = searchFieldData ? [] : noteLists;
        setListHasMoreData(d.pretaaHealthGetFilteredNotes.length === config.pagination.defaultTake);
        setNoteLists(prevData.concat(d.pretaaHealthGetFilteredNotes));
      }
    },
    onError: (e) => catchError(e, true),
  });

  function searchEmptyOnNodeUpdate() {
    setSearchFieldData('');
  }

  const [patientNameApi, {loading: patientNameLoading}] = useLazyQuery<PatientDetails, PatientDetailsVariables>(patientDetailsQuery, {
    onCompleted: (d) => {
      setPatientDetailsState(d.pretaaHealthPatientDetails);
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    if (patientId) {
      patientNameApi({
        variables: {
          patientId: patientId,
        },
      });
    }
  }, [patientId]);

  useEffect(() => {
    if (location.pathname.includes('events')) {
      setNoteHeading("Event's Notes");
    } else if (location.pathname.includes('patient')) {
      setNoteHeading(`${patientDetailsState?.firstName}'s Notes`);
    }
  }, [location.pathname, patientDetailsState]);

  function rowRendererNote(i: number, item: any) {
    return <Note note={item} eventId={item.eventId ? item.eventId : eventId} patientId={!item.eventId ? patientId : ''} key={item.id} setNoteLists={setNoteLists} searchEmpty={searchEmptyOnNodeUpdate} />;
  }

  function footerComponent() {
    if (loading) {
      return <EventRowSkeletonLoading />;
    }
    return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
  }

  function updateListOnCreateNode(subject: string, text: string, noteId?: string, canModify?: boolean) {
    if (searchFieldData === ''){
      setNoteLists((n) => {
        return [
          {
            id: String(noteId),
            createdBy: '',
            text,
            subject,
            eventId: '',
            createdAt: new Date(),
            canModify,
            patientId: '',
            readAt: null,
            updatedAt: null,
          },
          ...n,
        ] as FilteredNotes_pretaaHealthGetFilteredNotes[];
      });
    } else {
      setSearchFieldData('');
    }
    
  }

  useEffect(() => {
    if (searchFieldData.length === 0 ) {
      setNoteLists([]);
    }
    getListData({
      variables: {
        ...getParams(),
        searchPhrase: searchFieldData,
        take: config.pagination.defaultTake,
        skip: 0,
      },
    });
  }, [searchFieldData, id]);

  useEffect(() => {
    setSearchFieldData('');
    setValue('search', '');
    if (location.pathname && location.href.includes('patient') && id) {
      setPatientId(id);
      setEventId(undefined);
    }
    if (location.pathname && location.href.includes('events') && id) {
      setEventId(id);
      setPatientId(undefined);
    }
  }, [location.pathname, id]);

  function clearAll() {
    setClearSearchPhase(!clearSearchPhase);
  }

  const { height, width } = useViewportSize();

  const { headerHeight } = useContext(HeaderContext);
  const [resHeight, setResHeight] = useState('100vh');

  useEffect(() => {
    if (width > 1024) {
      const pureHeaderHeight = headerHeight + 250;
      setResHeight(`${height - pureHeaderHeight}px`);
    } else {
      const pureHeaderHeight = headerHeight + 320;
      setResHeight(`${height - pureHeaderHeight}px`);
    }
  // 
  }, [width, headerHeight]);

  useEffect(() => {
    setSearchFieldData(getSearchedPhaseQuery(location.search) || '');
    noOfRerender.current = noOfRerender.current + 1;
  }, [location.search]);

  return (
    <section className="bg-gray-50 relative overflow-auto flex flex-col h-full">
      <ContentHeader disableGoBack={showBackButton} title={noteHeading} titleLoading={patientNameLoading} className="lg:sticky">
        <div className="flex items-center space-x-4 my-5 ">
           <CustomSearchField
             defaultValue={searchFieldData}
             onChange={setSearchFieldData}
             clear={clearSearchPhase}
            />
        </div>
      </ContentHeader>

      {!!searchFieldData.length && (
        <div className="flex flex-row justify-end items-center px-5 pt-4 lg:px-16 sm:px-15">
          <div className="text-sm font-medium underline text-gray-150 cursor-pointer" onClick={clearAll}>
            Clear all
          </div>
        </div>
      )}
      <div className='mt-12'>
        {loading &&
          !noteLists.length &&
          new Array(7).fill(
            <div className=" bg-white rounded-xl w-11/12 mx-auto">
              <EventRowSkeletonLoading />
            </div>
          )}
      </div>

      {!!noteLists.length && (
          <div className="rounded-xl w-11/12 mx-auto note-list-border">
            <Virtuoso
              style={{ height: resHeight, width: '100%' }}
              data={noteLists}
              endReached={() =>
                listHasMoreData &&
                getListData({
                  variables: {
                    ...getParams(),
                    searchPhrase: searchFieldData,
                    take: config.pagination.defaultTake,
                    skip: noteLists.length,
                  },
                })
              }
              overscan={200}
              itemContent={rowRendererNote}
              components={{ Footer: footerComponent }}
            />
          </div>
      )}

      {!loading && (
        <React.Fragment>
          {!noteLists.length && !!searchFieldData && (
            <div className="flex flex-col flex-1 justify-center">
              <NoDataFound type="SEARCH" heading="No results" content="Refine your search and try again" />
            </div>
          )}
          {!noteLists.length && !searchFieldData && (
            <div className="flex flex-col flex-1 justify-center items-center notes-not-found">
              <NotFoundIcon type="NODATA" className=" w-24 my-2" />
              <div className="flex flex-col justify-center items-center">
                <h3 className="md:text-lg text-xsmd font-bold mt-2">No notes yet</h3>
              </div>
              <Button onClick={() => setShowNotesModal(true)} className="mt-6">
                Add a note
              </Button>
            </div>
          )}
        </React.Fragment>
      )}

      {showNotesModal && (
        <CreateNoteModal
          patientId={patientId}
          onUpdate={updateListOnCreateNode}
          eventId={eventId}
          modalTitle="New Note"
          onClick={() => setShowNotesModal(false)}
        />
      )}
      {noteCreatePrivilege && <CreateNoteOverlay onUpdate={updateListOnCreateNode} />}
    </section>
  );
}
