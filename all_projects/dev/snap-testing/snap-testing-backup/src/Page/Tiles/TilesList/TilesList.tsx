/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Chip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import TileModalComponent from 'Components/Modal/TileModalComponent';
import ListLoaderComponent from 'Components/ListLoader/ListLoader';
import AddCaptionComponent from 'Components/CreatableSelect/AddCaptionComponent';
import SearchCompilations from 'Page/Compilation/CompilationList/SearchCompilations/SearchCompilations';
import DownloadReport from 'Page/Compilation/CompilationList/DownloadReport/DownloadReport';
import routes from 'Lib/Routes/Routes';

import 'Styles/Dialog.scss';
import './_popup-style.scss';
import '../../../Styles/caption-close.css';
import { useAppDispatch, useAppSelector } from 'Lib/Store/hooks';
import { tilesActions } from 'Lib/Store/Page/Tiles/TilesSlice';
import { TilesListInterface } from 'Interface/TilesListInterface';
import { helperSliceActions } from 'Lib/Store/Helper/HelperSlice';
import AddIcon from 'Icons/AddIcon';
import CompilationModal from 'Components/Modal/CompilationModal';
import { CompilationListInterface } from 'Interface/CompilationListInterface';
import Spinner from 'Components/Spinner/Spinner';
import Delete from 'Icons/Delete';
import { LoadingButton } from '@mui/lab';
import { useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CompilationMetaData from 'Page/Compilation/CompilationList/MetaData/CompilationMetaData';
import ToggleButton from 'Components/ToggleButton/ToggleButton';
import ConfirmationDialog from 'Components/Modal/ConfirmationDialog';
import { archiveCompilation } from 'Lib/HelperFunction/archiveCompilation';
import { MetaDataInterface } from 'Interface/MetaDataInterface';
import { ArchiveStateInterface } from 'Interface/ArchiveStateInterface';
import { getCompilationMetaData } from 'Lib/HelperFunction/getCompilationMetaData';
import { freezeCompilation } from 'Lib/HelperFunction/freezeCompilation';
import { FreezeStateInterface } from 'Interface/FreezeStateInterface';
import Popup from 'reactjs-popup';

export enum CompilationStatus {
  'ARCHIVED' = 'archived',
}

interface TitleVisibilityInterface {
  loading: boolean;
  modalState: boolean;
  tile_id?: number;
}

const setCaptionColor = (
  caption: 'AD_NOT_CREATED' | 'CREATED' | 'COMPLETED' | 'REJECTED' | 'FINALIZING' | 'APPROVED'
): 'default' | 'primary' | 'yellow' | 'success' | 'error' | 'info' | 'warning' | undefined => {
  if (caption === 'CREATED' || caption === 'FINALIZING' || caption === 'APPROVED') {
    return 'yellow';
  } else if (caption === 'COMPLETED') {
    return 'success';
  } else if (caption === 'REJECTED') {
    return 'error';
  } else if (caption === 'AD_NOT_CREATED') {
    return 'default';
  } else {
    return 'default';
  }
};

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: '700',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function getWindowDimensions() {
  const { innerWidth: dimension } = window;
  return dimension;
}

export default function TilesList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const captionComponentState = useRef(0);
  const params = useParams<{ id: string }>();

  const loading = useAppSelector((state) => state.tiles.loading);
  const listLoader = useAppSelector((state) => state.tiles.listLoader);
  const deleteLoader = useAppSelector((state) => state.tiles.deleteLoader);
  const tilesList = useAppSelector((state) => state.tiles.tiles as unknown as TilesListInterface[]);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const compilationList = useAppSelector(
    (state) => state.compilation.compilationList as unknown as CompilationListInterface[]
  );

  const [freezeState, setFreezeState] = useState<FreezeStateInterface>({ loading: false, toggleState: false });
  const [metaData, setMetaData] = useState<MetaDataInterface>({ loading: false });
  const [archiveState, setArchiveState] = useState<ArchiveStateInterface>({ loading: false, dialogState: false });
  const [addNewShowModalState, setAddNewShowModalState] = useState(false);
  const [titleVisibility, setTitleVisibility] = useState<TitleVisibilityInterface>({
    loading: false,
    modalState: false,
  });

  const getCompilationDetails = (compilationId: string | undefined) => {
    const id = Number(compilationId);
    const index = compilationList.findIndex((e) => {
      return e.id === id;
      /* Archiving the compilation. */
    });
    return compilationList[index];
  };

  const handleOpenTileModal = () => {
    dispatch(helperSliceActions.setRedirectUrl(routes.tilesList.build(String(params.id), { newTitles: true })));
  };

  const deleteTiles = (tile_id: number) => {
    dispatch(tilesActions.deleteTiles({ tile_id }));
    setTitleVisibility((e) => {
      return {
        ...e,
        modalState: false,
      };
    });
  };

  function toggleOnChange(toggleState: boolean) {
    setFreezeState({ ...freezeState, toggleState });
    freezeCompilation(String(params.id), setFreezeState, setMetaData);
  }

  useEffect(() => {
    getCompilationMetaData(String(params.id), setMetaData);
  }, [params]);

  useEffect(() => {
    if (params.id) {
      dispatch(tilesActions.getTilesDetails(params.id));
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowDimensions(getWindowDimensions()));
    return () => window.removeEventListener('resize', () => setWindowDimensions(getWindowDimensions()));
  }, []);

  return (
    <div className='p-6'>
      <div className='flex flex-col justify-center items-center mt-5 md:flex-row'>
        <div className='w-full md:w-6/12 mx-4 mb-2 md:mb-0'>
          <SearchCompilations
            tileInfo={
              getCompilationDetails(params.id) !== undefined
                ? {
                    name: String(getCompilationDetails(params.id).name),
                    id: Number(getCompilationDetails(params.id).id),
                  }
                : { name: '', id: 0 }
            }
          />
        </div>
        <Button
          startIcon={<AddIcon className='text-white' />}
          variant='contained'
          color='primary'
          onClick={() => setAddNewShowModalState(true)}
          sx={{ py: '9px', width: '200px', height: '50px' }}>
          Add new episode
        </Button>
      </div>
      <CompilationMetaData metaData={metaData} />

      <div className='flex flex-col space-y-4 md:space-y-0 space-x-4 justify-center items-center md:flex-row  mt-4'>
        <div className='flex space-x-4'>
          <DownloadReport id={(tilesList?.slice(0, 1).map((el) => el.compilation_id))[0]} title={'Download Report'} />
          <Button
            startIcon={<FileUploadIcon className='text-white' />}
            variant='contained'
            color='success'
            onClick={handleOpenTileModal}>
            Add More Tiles
          </Button>
        </div>
        <TileModalComponent />
        <CompilationModal modalOpen={addNewShowModalState} closeModal={() => setAddNewShowModalState(false)} />
      </div>

      {listLoader && <ListLoaderComponent />}

      {loading && <Spinner />}
      {!loading && !listLoader && (
        <div className='flex flex-col justify-center items-center'>
          <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: 1500 }} className='custom-shadow-none'>
            <div className='flex justify-center md:justify-end items-center w-full my-8 '>
              <div className='flex items-center font-normal text-sm'>
                <div className='mr-2'>Freeze</div>
                {metaData.data ? (
                  <ToggleButton
                    status={metaData?.data?.freeze}
                    onChange={toggleOnChange}
                    loading={freezeState.loading}
                  />
                ) : (
                  <div className='w-16 rounded-3xl h-8 wounded bg-slate-200 animate-pulse'></div>
                )}
              </div>
              {/* if compilation status is === CompilationStatus.ARCHIVED, then we will disable then archive btn  */}
              <div className='ml-5'>
                <Popup
                  trigger={
                    <button className='button ml-4 px-1 py-3'>
                      <BsThreeDotsVertical />
                    </button>
                  }
                  position={`${windowDimensions > 767 ? 'bottom right' : 'bottom center'}`}>
                  <button
                    className='archive-btn '
                    disabled={
                      metaData.loading || String(metaData.data?.status).toLowerCase() === CompilationStatus.ARCHIVED
                    }
                    onClick={() => setArchiveState({ ...archiveState, dialogState: !archiveState.dialogState })}>
                    Archive
                  </button>
                </Popup>
              </div>
            </div>
            <Table sx={{ minWidth: 100, height: '1px' }} aria-label='customized table'>
              {tilesList.length > 0 && (
                <TableHead>
                  <TableRow>
                    <StyledTableCell className=' bg-gray-200 w-1/6' sx={{ paddingLeft: 12 }}>
                      Preview
                    </StyledTableCell>
                    <StyledTableCell className=' bg-gray-200' sx={{ paddingLeft: 5 }}>
                      Captions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {tilesList.length > 0 ? (
                  tilesList.map((row) => (
                    <StyledTableRow
                      key={row.id}
                      sx={{ height: '100%' }}
                      onClick={() => {
                        captionComponentState.current = row.id;
                      }}>
                      <StyledTableCell component='th' scope='row' sx={{ paddingLeft: 0, paddingRight: 0 }}>
                        <div className='flex items-center'>
                          {/* the visibility btn */}
                          <div className='h-full flex justify-center items-center mr-2 '>
                            <LoadingButton
                              onClick={() =>
                                setTitleVisibility((e) => {
                                  return {
                                    ...e,
                                    modalState: true,
                                    tile_id: row.id,
                                  };
                                })
                              }
                              loading={Boolean(deleteLoader) && row.id === deleteLoader}
                              disabled={Boolean(deleteLoader) && row.id === deleteLoader}>
                              <Delete className='w-6 h-6' />
                            </LoadingButton>
                          </div>
                          <div className='flex justify-center'>
                            {row.preview_url && <img src={row.preview_url} width={'150'} alt='' />}
                            {!row.preview_url && (
                              <img
                                src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png'
                                width='160'
                              />
                            )}
                          </div>
                        </div>
                      </StyledTableCell>

                      <StyledTableCell sx={{ height: '100%', paddingLeft: 5 }}>
                        <div className='flex flex-row justify-between h-full items-center'>
                          <div className='flex flex-col justify-between h-full content-end w-full '>
                            <div className='max-h-48  overflow-y-auto flex flex-col justify-start items-start'>
                              {row?.captions?.length > 0 &&
                                row.captions
                                  .slice()
                                  .reverse()
                                  .map((el) => {
                                    return (
                                      <div
                                        key={el.id}
                                        id={el.id}
                                        className='caption-body w-full flex flex-row justify-between items-center mb-1 p-1 rounded-md'>
                                        <div className=' flex flex-row justify-start items-center'>
                                          <div className='flex flex-row justify-center items-center'>
                                            {el.snap_ad_status !== 'AD_NOT_CREATED' ? (
                                              <Chip
                                                size='small'
                                                style={{ width: '10px', height: '10px' }}
                                                color={setCaptionColor(el.snap_ad_status)}
                                              />
                                            ) : (
                                              <Chip
                                                size='small'
                                                icon={
                                                  <ClearIcon
                                                    style={{ width: '12px', height: '12px', marginLeft: '10px' }}
                                                  />
                                                }
                                                onClick={() => {
                                                  if (el.snap_ad_status === 'AD_NOT_CREATED') {
                                                    dispatch(
                                                      tilesActions.deleteCaption({
                                                        id: el.id,
                                                        tile_id: el.tile_id,
                                                        caption_text: el.caption_text,
                                                      })
                                                    );
                                                  }
                                                }}
                                                style={{ width: '10px', height: '10px' }}
                                                color={setCaptionColor(el.snap_ad_status)}
                                              />
                                            )}
                                          </div>
                                          <span key={el.id} className=' ml-2 text-sm'>{`${el.caption_text}`}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                            </div>
                            {/* if compilation status is === CompilationStatus.ARCHIVED, then we will not allow to add comments  */}
                            {(metaData.loading || freezeState.loading) && (
                              <div className='w-full py-4 rounded animate-pulse bg-slate-200'></div>
                            )}
                            {!metaData.loading && !freezeState.loading && !metaData?.data?.freeze && (
                              <AddCaptionComponent
                                tile_id={row.id}
                                selected={captionComponentState.current === row.id}
                              />
                            )}
                          </div>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell>
                      <div className='flex justify-center font-semibold p-4'>No tiles to show</div>
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <ConfirmationDialog
        title='Are you sure you want to archive this episode?'
        loading={archiveState.loading}
        archive={async () => {
          const nextCompilationId = await archiveCompilation(String(params.id), setArchiveState, compilationList);
          if (!!String(nextCompilationId).length) {
            dispatch(helperSliceActions.setRedirectUrl(routes.tilesList.build(String(nextCompilationId))));
          }
        }}
        onClose={() => setArchiveState({ ...archiveState, dialogState: false })}
        state={archiveState.dialogState}
      />
      <ConfirmationDialog
        title='Are you sure you want to delete this tile?'
        state={titleVisibility.modalState}
        onClose={() => setTitleVisibility({ ...titleVisibility, modalState: false })}
        loading={titleVisibility.loading}
        archive={() => deleteTiles(Number(titleVisibility?.tile_id))}
      />
    </div>
  );
}
