/*  */
import React, { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomInputField from 'components/Input/CustomInputField';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { client } from 'apiClient';
import { noteCreation } from 'graphql/note-create.mutation';
import { noteEdit } from 'graphql/note-update.mutation';
import { toast } from 'react-toastify';
import messages from 'lib/messages';
import { NoteCreate, NoteCreateVariables, NoteUpdate, NoteUpdateVariables } from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { getHotkeyHandler } from '@mantine/hooks';
import EventCardView from 'screens/EventsScreen/component/EventCard';
import PatientNameCard from 'components/PatientNameCard';
import { config } from 'config';

interface CreateNotesFormData {
  subject: string;
  text: string;
}
interface CreateNotesFormState {
  loading: boolean;
  data?: null | CreateNotesFormData;
  error?: null | string;
  successMessage?: null | string;
}

const CreateNoteFormSchema = yup.object().shape({
  subject: yup
    .string()
    .required(messages.errorList.required)
    .trim(),
  text: yup.string().required(messages.errorList.required).trim(),
});

interface CreateNoteFormInterface {
  noteBody?: string;
  noteSubject?: string;
  title: string;
  onClick: () => void;
  noteId?: string;
  eventId?: string;
  patientId?: string;
  onUpdate?: (subject: string, text: string, id?: string, canModify?: boolean, errorExist?: boolean) => void;
}

export default function CreateNoteForm({
  noteBody,
  noteSubject,
  title,
  onClick,
  noteId,
  eventId,
  patientId,
  // Read me :
  // on update of a note we will, pass the info to this function to update the note data in parent component
  onUpdate,
}: CreateNoteFormInterface) {
  const [noteData, setNoteData] = useState<CreateNotesFormState>({
    loading: false,
    data: null,
    error: null,
    successMessage: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setValue,
    getValues,
    watch,
  } = useForm<CreateNotesFormData>({
    resolver: yupResolver(CreateNoteFormSchema),
  });


  async function updateNote(validId: string, data: CreateNotesFormData) {
    try {
      setNoteData({ ...noteData, loading: true });
      const { errors: errorResponse } = await client.mutate<NoteUpdate, NoteUpdateVariables>({
        mutation: noteEdit,
        variables: {
          pretaaHealthNoteUpdateId: validId,
          subject: data.subject,
          text: data.text,
        },
      });
      let errorRes = false;
      if (errorResponse && errorResponse.length) {
        errorRes = true;
        setNoteData({ loading: false, data: null, error: getGraphError(errorResponse).join(','), successMessage: null });
      } else {
        setNoteData({ loading: false, data: null, error: null, successMessage: null });
      }
      onClick();
      toast.success(messages.successList.noteUpdate);
      reset();
      if (onUpdate) {
        onUpdate(data.subject, data.text, noteId, false, errorRes);
      }
    } catch (e: any) {
      setNoteData({ loading: false, data: null, error: e.message });
    }
  }

  async function createNote(data: CreateNotesFormData) {
    let noteVariables: NoteCreateVariables = {
      subject: data.subject,
      text: data.text,
    };

    if (eventId) {
      noteVariables = {
        ...noteVariables,
        eventId,
      };
    }

    if (patientId) {
      noteVariables = {
        ...noteVariables,
        patientId,
      };
    }

    try {
      setNoteData({ ...noteData, loading: true });
      const { errors: errorResponse, data: noteCreateResponseData } = await client.mutate<NoteCreate, NoteCreateVariables>({
        mutation: noteCreation,
        variables: noteVariables,
      });
      let errorRes = false;
      if (errorResponse && errorResponse.length) {
        errorRes = true;
        setNoteData({ loading: false, data: null, error: getGraphError(errorResponse).join(','), successMessage: '' });
      } else {
        setNoteData({ loading: false, data: null, error: null, successMessage: null });
      }

      onClick();
      reset();
      toast.success(messages.successList.noteCreate);

      if (onUpdate && noteCreateResponseData?.pretaaHealthNoteCreate) {
        const noteDetails = noteCreateResponseData?.pretaaHealthNoteCreate;
        onUpdate(noteDetails?.subject, noteDetails.text, String(noteDetails?.id), Boolean(noteDetails.canModify), errorRes);
      }

    } catch (e: any) {
      setNoteData({ loading: false, data: null, error: e.message });
    }

  }

  const noteSubmit = async (data: CreateNotesFormData) => {
    setNoteData({ loading: true, data: null, error: null });
    if (noteId) {
      updateNote(noteId, data);
      return;
    }
    createNote(data);
  };

  watch('subject');
  watch('text');

  useEffect(() => {
    if (noteSubject) {
      setValue('subject', noteSubject);
    }
    if (noteBody) {
      setValue('text', noteBody);
    }
  }, [noteSubject, noteBody]);

  function onInputChange() {
    setNoteData({ ...noteData, error: '' });
  }


  return (
    <div
      className="bg-white w-11/12 md:w-2/4 rounded "
      onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col py-6 px-4 md:px-8 bg-gray-100  ">
        <div className="flex justify-between items-center">
          <div className="text-md md:text-lg font-semibold ">{title}</div>
          <div
            data-testid="cancel_btn"
            className=" text-primary-light cursor-pointer text-sm md:text-base"
            tabIndex={4}
            onKeyPress={getHotkeyHandler([['Enter', onClick]])}
            onClick={() => onClick()}>
            Cancel
          </div>
        </div>
        {eventId && (
          <div className="mt-4">
            <EventCardView eventId={eventId} />
          </div>
        )}
        {(!eventId && patientId) && (
          <div className="mt-4">
            <PatientNameCard patientId={patientId} />
          </div>
        )}
      </div>

      <form
        onChange={onInputChange}
        className=" flex flex-col w-11/12 mx-auto items-start py-6"
        onSubmit={handleSubmit(noteSubmit)}
        autoComplete="off">
          <div className='w-full'>

        <CustomInputField
          tabIndex={1}
          placeholder="Add Headline"
          data-testid="Headline"
          className="input placeholder-black-500 text-base"
          type={'text'}
          register={register('subject')}
          error={Boolean(formState.errors.subject?.message)}
          autoFocus={true}
          characterLength={1000}
        />

        {formState.errors.subject?.message && (
          <ErrorMessage message={formState.errors.subject?.message} />
        )}

        <div className="text-green font-normal text-xsm pt-3">
          {getValues('subject')?.length > 0 && `${
            config.form.largeTextLength -
            (getValues('subject')?.length ? getValues('subject')?.length : 0)
          } characters remaining`}
        </div>

        <br />
        <div className='details-field'>
          <CustomInputField
            tabIndex={2}
            placeholder="Add Details"
            data-testid="Add Details"
            className="input placeholder-black-500 text-base "
            type={'text'}
            register={register('text')}
            multiline={true}
            component="textarea"
            error={Boolean(formState.errors.text?.message)}
            characterLength={5000}
          />
        </div>

        {formState.errors.text?.message && (
          <ErrorMessage message={formState.errors.text?.message} />
        )}

        <div className="text-green font-normal text-xsm pt-3">
          {getValues('text')?.length > 0 && `${
            config.form.largeTextAreaMaxLength -
            (getValues('text')?.length ? getValues('text')?.length : 0)
          } characters remaining`}
        </div>

        <div
          className="flex justify-center items-center w-full"
          data-testid="update">
          <Button
            tabIndex={3}
            type="submit"
            classes={['w-fit', 'mt-6 ']}
            loading={noteData.loading}
            disabled={noteData.loading}>
            {noteId ? 'Update' : 'Save'}
          </Button>
        </div>

        {formState.isValid && noteData.error && (
          <ErrorMessage message={noteData.error} />
        )}
</div>
      </form>
    </div>
  );
}
