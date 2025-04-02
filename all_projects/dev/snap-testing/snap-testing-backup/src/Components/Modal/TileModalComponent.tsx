/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import CloseIcon from 'Icons/Close';
import ImageTextAreaComponent from 'Components/ImageTextArea/ImageTextAreaComponent';
import { ImageUploadInterface, TilesForm } from 'Interface/Tiles';
import { tilesActions } from 'Lib/Store/Page/Tiles/TilesSlice';
import { useAppDispatch, useAppSelector } from 'Lib/Store/hooks';
import useQueryParams from 'Lib/Hooks/UseQueryParams';
import { helperSliceActions } from 'Lib/Store/Helper/HelperSlice';
import routes from 'Lib/Routes/Routes';
import messageConfig from 'Lib/message';
import { LoadingButton } from '@mui/lab';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
// import { toast } from 'react-toastify';
import { handleError } from 'Lib/Api/api-client';
import MessageComponent from 'Components/MessageComponent/MessageComponent';

export default function TileModalComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const query: { newTitles?: string } = useQueryParams();
  const tilesCreateLoading = useAppSelector((state) => state.tiles.tilesCreateLoading);

  const tileFormSchema = yup.object().shape({
    tiles: yup
      .array()
      .of(
        yup.object().shape({
          s3_key: yup.string().required(),
          compilation_id: yup.number().required(),
        })
      )
      .min(1, messageConfig.image),
  });

  const {
    setValue,
    trigger,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<TilesForm>({
    resolver: yupResolver(tileFormSchema),
  });

  const uploadTilesImage = (s3_key: ImageUploadInterface[]) => {
    setValue('tiles', s3_key);
    trigger('tiles');
  };

  const closeModal = () => {
    setModalOpen(false);
    dispatch(helperSliceActions.setRedirectUrl(routes.tilesList.build(String(params.id), { newTitles: false })));
    reset();
  };

  useEffect(() => {
    if (query.newTitles === 'true') {
      setModalOpen(true);
    } else if (query.newTitles === 'false') {
      setModalOpen(false);
    }
    console.log('images list', getValues('tiles'));
  }, [query.newTitles, getValues('tiles')?.length]);

  async function createTiles(data: TilesForm) {
    dispatch(tilesActions.updateTilesLoading(true));
    setLoading(true);

    try {
      await snapActionsApi.createTiles(data.tiles);
      // toast.success(messageConfig.tilesSuccess);
      dispatch(tilesActions.getTilesDetails(params.id));
      dispatch(helperSliceActions.setRedirectUrl(routes.tilesList.build(String(params.id), { newTitles: false })));
    } catch (e: any) {
      handleError(e);
    }
    dispatch(tilesActions.updateTilesLoading(false));
    reset();
    setLoading(false);
  }

  function onSubmit(data: TilesForm) {
    createTiles(data);
  }

  const isSubmitDisabled = () => {
    return (
      tilesCreateLoading ||
      getValues('tiles') === undefined ||
      (getValues('tiles') !== undefined && getValues('tiles').length == 0)
    );
  };

  return (
    <Dialog open={modalOpen} onClose={() => closeModal()} aria-labelledby='responsive-dialog-title'>
      <form>
        <div className='flex justify-between'>
          <DialogTitle id='responsive-dialog-title' fontWeight='700'>
            Add Tile
          </DialogTitle>
          <div className='px-2 py-4'>
            <Button onClick={() => closeModal()}>
              <CloseIcon className='w-6 h-6 font-semibold' />
            </Button>
          </div>
        </div>

        <DialogContent>
          <ImageTextAreaComponent onTileChange={uploadTilesImage} />
          <div className='mt-2'>
            <MessageComponent>
              {getValues('tiles')?.length < 1 ? 'Please select a tile to upload!' : ''}
            </MessageComponent>
          </div>
          <div className='py-4'></div>
        </DialogContent>

        <DialogActions className='mr-4 ml-4 mb-4'>
          <LoadingButton
            variant='contained'
            type='button'
            disabled={isSubmitDisabled()}
            loading={loading}
            onClick={() => {
              setTimeout(() => {
                if (Object.keys(errors).length === 0) {
                  handleSubmit(onSubmit)();
                }
              }, 1000);
            }}>
            Add tiles to current show
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
