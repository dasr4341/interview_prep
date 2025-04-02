/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import MessageComponent from 'Components/MessageComponent/MessageComponent';
import CloseIcon from 'Icons/Close';
import { useAppSelector, useAppDispatch } from 'Lib/Store/hooks';
import { compilationActions } from 'Lib/Store/Page/Compilation/CompilationSlice';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { CompilationListInterface } from 'Interface/CompilationListInterface';
import useQueryParams from 'Lib/Hooks/UseQueryParams';
import { helperSliceActions } from 'Lib/Store/Helper/HelperSlice';
import routes from 'Lib/Routes/Routes';
import { toastNetworkError } from 'Lib/Utility/toastNetworkError';

export interface CompilationFormFields {
  name: string;
  showId: number;
}

interface DropDownInterface {
  loading: boolean;
  data?: {
    created_at?: string;
    id: number;
    logo_snap_id: string;
    name: string;
    updated_at?: string;
  }[];
  error?: string;
}
const compilationFormValidationSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  showId: yup.number().required('Please select shows').min(0, 'Please select shows'),
});

export default function CompilationModal({ modalOpen, closeModal }: { modalOpen: boolean; closeModal: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    setFocus,
    formState: { errors, isValid },
  } = useForm<CompilationFormFields>({
    mode: 'onChange',
    resolver: yupResolver(compilationFormValidationSchema),
  });
  const dispatch = useAppDispatch();
  const [dropDownValue, setDropDownValue] = useState<string>('Not selected');
  const [dropdown, setDropDown] = useState<DropDownInterface>({ loading: false });
  const query: { newCompilation?: string } = useQueryParams();
  const compilationCreating = useAppSelector((state) => state.compilation.compilationCreating);
  const compilationList = useAppSelector(
    (state) => state.compilation.compilationList as unknown as CompilationListInterface[]
  );

  async function createCompilation(data: CompilationFormFields) {
    dispatch(
      compilationActions.updateCompilationFormState({
        compilationCreating: true,
      })
    );
    try {
      const responseOfCreate = await snapActionsApi.createCompilation({ name: data.name, show_id: data.showId });
      // toast.success('Compilation Created');
      reset();
      closeModal();
      setDropDownValue('Not selected');
      dispatch(compilationActions.setCompilationList(compilationList.concat(responseOfCreate)));
      dispatch(helperSliceActions.setRedirectUrl(`${routes.tilesList.absolutePath}${responseOfCreate?.id}`));
    } catch (e: any) {
      toastNetworkError(e);
    }
    dispatch(
      compilationActions.updateCompilationFormState({
        compilationCreating: false,
      })
    );
  }

  async function getCompilationDropDown() {
    try {
      setDropDown({ loading: true });
      const response = await snapActionsApi.getDropDown();
      setDropDown({ loading: false, data: response });
    } catch (e: any) {
      setDropDown({ loading: false, error: e.message });
    }
  }

  function handleDropDown(e: SelectChangeEvent) {
    setDropDownValue(e.target.value as string);
    setValue('showId', dropdown?.data?.find((d) => d.name === (e.target.value as string))?.id || -1);
    trigger('showId');
  }

  useEffect(() => {
    if (modalOpen) {
      getCompilationDropDown();
      setTimeout(() => { 
        setFocus('name');
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);


  return (
    <Dialog open={modalOpen}  onClose={closeModal} aria-labelledby='responsive-dialog-title'>
      <div className='flex justify-between'>
        <DialogTitle id='responsive-dialog-title' fontWeight='700' variant='h6'>
          New Episode
        </DialogTitle>
        <div className='px-2 py-4'>
          <Button onClick={closeModal}>
            <CloseIcon className='w-6 h-6 font-semibold' />
          </Button>
        </div>
      </div>

      <DialogContent>
        <form onSubmit={handleSubmit(createCompilation)}>
          <div className='pb-4'>
            <TextField
              fullWidth
              margin='dense'
              id='name'
              label='Name'
              type='text'
              variant='standard'
              {...register('name')}
            />

            <MessageComponent>{errors.name?.message}</MessageComponent>

            <div className='mt-4'>
              {dropdown.loading && <CircularProgress />}
              {!!dropdown?.data?.length && (
                <FormControl fullWidth variant='standard'>
                  <InputLabel>Shows</InputLabel>
                  <Select value={dropDownValue} onChange={handleDropDown} label='Shows'>
                    <MenuItem value='Not selected'>Not selected</MenuItem>
                    {dropdown?.data?.map((e, i) => (
                      <MenuItem value={e.name} key={i}>
                        {e.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <MessageComponent>{errors.showId?.message || dropdown?.error}</MessageComponent>
            </div>
          </div>
          <div className='py-4'></div>
          <LoadingButton disabled={!isValid} type='submit' variant='contained' loading={compilationCreating}>
            Create
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
