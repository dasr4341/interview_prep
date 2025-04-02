/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import {
  CreateNote,
  CreateNoteVariables,
  CreateNote_pretaaNoteCreate,
  NoteDetails,
  NoteDetailsVariables,
  NoteDetails_pretaaGetNote,
  PretaaGetCompanyOpportunity_pretaaGetCompanyOpprtunity,
  UpdateNote,
  UpdateNoteVariables,
} from 'generatedTypes';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import QuillEditor from 'components/QuillEditor';
import catchError from 'lib/catch-error';
import { createNote as createNoteMutation } from 'lib/mutation/notes/create-note';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { toast } from 'react-toastify';
import CompanyName from 'screens/companies/components/CompanyName';
import Button from 'components/ui/button/Button';
import EventCardView from 'screens/events/components/EventCard';
import { routes } from 'routes';
import { updateNote } from 'lib/mutation/notes/update-note';
import { noteDetailsQuery } from 'lib/query/notes/note-details';
import { errorList, successList } from '../../lib/message.json';
import Popup from 'reactjs-popup';
import './notes.scss';
import SpaceOnly from 'lib/form-validation/space-only';

interface CompanyDetails {
  id: string;
  name: string;
  isStarred: boolean;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
  company?: CompanyDetails;
  eventId?: string;
  opportunityId?: string;
  parentMessageId?: string;
  opportunity?: PretaaGetCompanyOpportunity_pretaaGetCompanyOpprtunity;
  onSubmitted?: (data: CreateNote_pretaaNoteCreate | NoteDetails_pretaaGetNote) => void;
}

interface NoteCreateForm {
  text: string;
  subject: string;
  eventId?: string;
  companyId?: string;
  opportunityId?: string;
}

export default function NoteCreateModal({
  open,
  setOpen,
  id,
  company,
  eventId,
  opportunityId,
  opportunity,
  onSubmitted,
}: Props): JSX.Element {
  const location = useLocation();
  const [createNote, { loading: createNoteLoading }] = useMutation<CreateNote, CreateNoteVariables>(createNoteMutation);
  const [editNote, { loading: editNoteLoading }] = useMutation<UpdateNote, UpdateNoteVariables>(updateNote);
  const [getNote, { data: note }] = useLazyQuery<NoteDetails, NoteDetailsVariables>(noteDetailsQuery);

  const validationSchema = Yup.object().shape({
    eventId: Yup.string(),
    companyId: Yup.string(),
    subject: Yup.string().trim().required(errorList.required),
    text: Yup.string().transform(SpaceOnly).typeError(errorList.text).required(errorList.required),
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<NoteCreateForm>({
    resolver: yupResolver(validationSchema) as unknown as any,
  });

  // Todo: This is not required not because UI not modify a message anytime
  useEffect(() => {
    if (note) {
      const noteValue = note.pretaaGetNote;
      if (noteValue?.eventId) {
        setValue('eventId', noteValue?.eventId);
      } else if (noteValue?.company?.id){
        setValue('companyId', noteValue?.company?.id);
      }
      setValue('text', noteValue?.text || '');
      setValue('subject', noteValue?.subject || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, setValue]);

  useEffect(() => {
    if (opportunityId) {
      setValue('opportunityId', opportunityId);
    }
    if (eventId) {
      setValue('eventId', eventId);
    } else {
      if (company && company.id) {
        setValue('companyId', company.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, setValue, getNote]);

  // Todo: This is not required not because UI not modify a message anytime
  useEffect(() => {
    if (id) {
      getNote({
        variables: {
          noteId: id,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClose = () => {
    setOpen(false);
  };

  async function onSubmit(formValue: NoteCreateForm) {
    try {
      if (id) {
        const { data } = await editNote({
          variables: {
            id: id,
            ...formValue,
            delta: '',
          },
        });

        if (data) {
          toast.success(successList.noteUpdate);
          if (onSubmitted) {
            onSubmitted(data.pretaaNoteUpdate);
          }
          handleClose();
        }
      } else {
        const { data } = await createNote({
          variables: {
            ...formValue,
            delta: '',
            ...((formValue.companyId || company?.id) && {
              companyId: formValue.companyId || company?.id,
            }),
            ...(eventId && { eventId }),
          },
        });

        if (data) {
          toast.success(successList.noteCreate);
          if (onSubmitted) {
            onSubmitted(data.pretaaNoteCreate);
          }
          handleClose();
        }
      }
    } catch (e) {
      catchError(e, true);
    }
  }

  function handleEditorChange(value: { html: string }) {
    setValue('text', value.html);
    trigger('text');
  }

  return (
    <>
      <Popup
        modal={true}
        nested={true}
        open={open}
        arrow={false}
        position="center center"
        closeOnDocumentClick
        onClose={handleClose}
        className="rounded-md "
        contentStyle={{ borderRadius: '13px' }}
        overlayStyle={{ background: 'rgba(24, 24, 24, 0.1)' }}>
        <div className="bg-gray-50 px-5 py-6 rounded-md" style={{ margin: '-5px -5px 32px -5px' }}>
          <div
            className="flex justify-between 
        relative text-primary mb-5">
            <h1
              className="h1 leading-none text-primary font-bold 
            text-md lg:text-lg">
              {id ? 'Edit Note' : 'New Note'}
            </h1>
            <Button
              type="button"
              classes={['text-base', 'text-pt-blue-300', 'notes-cancel-btn']}
              style="bg-none"
              onClick={handleClose}>
              Cancel
            </Button>
          </div>
          <div>
            {(note?.pretaaGetNote?.opportunity || opportunity) && (
              <div className="rounded-xl border border-gray-200 px-5 py-6 flex flex-col space-y-1 bg-white mb-6">
                <div className="flex flex-row justify-between items-center">
                  <div className="uppercase text-xs font-semibold">Opportunity</div>
                  <div></div>
                </div>
                <div className="text-base font-bold text-primary">
                  <Link
                    to={routes.companyDetail.build(
                      String(note?.pretaaGetNote?.company?.id || opportunity?.company?.id)
                    )}
                    className="text-primary-light">
                    {note?.pretaaGetNote?.company?.name || opportunity?.company?.name}
                  </Link>{' '}
                  <span>{note?.pretaaGetNote?.opportunity?.name || opportunity?.name}</span>
                </div>
              </div>
            )}
            {!note?.pretaaGetNote?.eventId && !note?.pretaaGetNote?.opportunity && note?.pretaaGetNote?.company ? (
              <CompanyName
                name={note.pretaaGetNote.company.name || ''}
                id={note.pretaaGetNote.company.id}
                className={`px-6 py-5 h-20 rounded-xl shadow-sm 
                  bg-white border border-gray-200 font-bold text-primary text-md`}
                isLinked={true}
                starred={Boolean(note.pretaaGetNote.company.starredByUser)}
                isOnClickStar={true}
              />
            ) : !id && company && (
              <CompanyName
                name={company.name}
                id={company.id}
                className={`px-6 py-5 h-20 rounded-xl shadow-sm
                  bg-white border border-gray-200 text-md font-bold text-primary`}
                isLinked={true}
                starred={Boolean(company.isStarred)}
                isOnClickStar={true}
              />
            )}

            {id && note?.pretaaGetNote?.eventId ? (
              <EventCardView
                className="text-base font-bold text-primary"
                wrapperClassName="bg-white rounded-xl border border-gray-200"
                id={note.pretaaGetNote.eventId}
              />
            ) : !id && eventId && (
              <EventCardView
                className="text-base font-bold text-primary"
                wrapperClassName="bg-white rounded-xl border border-gray-200"
                id={eventId}
              />
            )}
          </div>
        </div>
        <ContentFrame classes={['bg-white', 'px-5', 'pb-0', 'flex', 'flex-col']}>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col">
            <div>
              <div className="pb-4">
                <input
                  type="text"
                  {...register('subject')}
                  className="text-black
              placeholder:text-black border border-gray rounded-lg 
              bg-none mb-2 w-full"
                  placeholder="Headline"
                />
                <ErrorMessage message={errors?.subject?.message || ''} />
              </div>
            </div>
            <div>
              <div className="rounded-md h-48 flex flex-col overflow-x-auto">
                <QuillEditor
                  onChange={(value) => handleEditorChange(value)}
                  defaultValue={note?.pretaaGetNote?.text}
                  theme="snow"
                  placeholder="Add Details"
                  className="flex-1 mb-2 notes-editor whitespace-pre"
                />
                <ErrorMessage message={errors?.text?.message || ''} />
              </div>
            </div>
          </form>
        </ContentFrame>

        <div className="flex justify-center py-4 ">
          <Button
            classes={['w-48']}
            onClick={handleSubmit(onSubmit)}
            disabled={id ? editNoteLoading : createNoteLoading}
            loading={id ? editNoteLoading : createNoteLoading}>
            Save
          </Button>
        </div>
      </Popup>
    </>
  );
}
