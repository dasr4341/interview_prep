import React from 'react';
import { compilationActions } from 'Lib/Store/Page/Compilation/CompilationSlice';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { useAppSelector } from 'Lib/Store/hooks';
import fileSaver from 'file-saver';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadReport({ id, sx, title }: { id: number, sx?: any, title?: string }) {
  const dispatch = useDispatch();
  const processingId = useAppSelector((state) => state.compilation.report.processingId);

  async function downloadReport(testId: number) {
    dispatch(compilationActions.downloadReport({ processingId: testId }));
    const data = await snapActionsApi.downloadReport(testId);
    const blob = new Blob([data], { type: 'text/csv' });
    fileSaver.saveAs(blob, `report-${+new Date()}.csv`);
    dispatch(compilationActions.downloadReport({ processingId: null }));
  }

  return (
    <LoadingButton
      startIcon={<DownloadIcon />}
      sx={sx}
      variant='contained'
      size='small'
      onClick={() => downloadReport(id)}
      loading={id === processingId}
      disabled={Boolean(processingId)}>
      {title ? title : 'Report'}
    </LoadingButton>
  );
}
