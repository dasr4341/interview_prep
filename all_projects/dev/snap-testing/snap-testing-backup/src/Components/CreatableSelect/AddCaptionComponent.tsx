/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MessageComponent from 'Components/MessageComponent/MessageComponent';
import { useAppDispatch, useAppSelector } from 'Lib/Store/hooks';
import { tilesActions } from 'Lib/Store/Page/Tiles/TilesSlice';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';

export default function AddCaptionComponent({ tile_id, selected }: { tile_id: number; selected: boolean }) {
  const dispatch = useAppDispatch();
  const captionForm = useAppSelector((state) => state.tiles.captionForm);

  const captionInputSchema = yup.object({
    captionInputField: yup.string().max(55, 'Max length should be 55 characters').required('Caption is required'),
  });

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(captionInputSchema),
  });

  const onSubmit = async (data: any) => {
    /* Creating an object with the tile_id and the caption_text. */
    const captionObj = {
      tile_id: tile_id,
      caption_text: data.captionInputField,
    };
    dispatch(tilesActions.addCaptions(captionObj));
  };
  
  useEffect(() => {
    if (selected) {
      setFocus('captionInputField');
    }
  }, [setFocus]);

  return (
    <>
      <form className='flex flex-col flex-end ' onSubmit={handleSubmit(onSubmit)}>
        <div className=' mt-2 flex flex-col md:flex-row md:justify-start md:items-baseline'>
          <div className=' w-full mb-1 md:mb-0  md:mr-2'>
            <input
              {...register('captionInputField')}
              id='captionInputField'
              type='text'
              className='w-full p-2 border rounded'
              placeholder='Enter caption (55 char limit)'
              style={{ height: '40px' }}
            />
          </div>
          <LoadingButton
            loading={captionForm.adding}
            disabled={captionForm.adding}
            sx={{ height: '38px' }}
            variant='outlined'
            color='primary'
            type='submit'>
            Submit
          </LoadingButton>
        </div>
        <div className='w-8/12 mt-1'>
          <MessageComponent>{errors?.captionInputField?.message}</MessageComponent>
        </div>
      </form>
    </>
  );
}
