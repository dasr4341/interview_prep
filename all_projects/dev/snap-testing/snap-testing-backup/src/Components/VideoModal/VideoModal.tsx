import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import CloseIcon from 'Icons/Close';
import ImageTextAreaComponent from 'Components/ImageTextArea/ImageTextAreaComponent';
import MessageComponent from 'Components/MessageComponent/MessageComponent';
import { VideoActionsInterface } from 'Interface/VideoActionsInterface';
import messageConfig from 'Lib/message';

export default function VideoModalComponent({
  open,
  onClose,
  onClick,
  onClickModal,
}: {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  onClickModal: () => void;
}) {
  const videoSchema = yup.object().shape({
    name: yup.string().trim().required(messageConfig.name),
    image: yup.string().required(messageConfig.image),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoActionsInterface>({
    resolver: yupResolver(videoSchema),
  });
  const onSubmit = (data: VideoActionsInterface) => {
    console.log(data);
  };
  return (
    <form>
      <Dialog open={open} onClose={onClose} aria-labelledby='responsive-dialog-title'>
        <div className='flex justify-between'>
          <DialogTitle id='responsive-dialog-title' fontWeight='700'>
            Add Video
          </DialogTitle>
          <div className='px-2 py-4'>
            <Button onClick={onClick}>
              <CloseIcon className='w-6 h-6 font-semibold cursor-pointer' />
            </Button>
          </div>
        </div>

        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin='dense'
            id='name'
            label='Name'
            type='text'
            variant='standard'
            {...register('name')}
          />
          <MessageComponent>{errors.name?.message}</MessageComponent>
          <div className='pt-4 pb-2'>
            <ImageTextAreaComponent />
          </div>

          <MessageComponent>{errors.image?.message}</MessageComponent>
        </DialogContent>

        <DialogActions className='m-4'>
          <Button autoFocus variant='contained' type='submit' onClick={handleSubmit(onSubmit)}>
            Upload
          </Button>
          <Button autoFocus variant='contained' type='submit' onClick={onClickModal}>
            Upload and add new
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
