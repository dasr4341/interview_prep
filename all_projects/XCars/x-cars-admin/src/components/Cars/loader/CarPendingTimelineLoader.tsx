import React from 'react';
import { CircularProgress } from '@mui/material';

export const CarPendingTimelineLoader = () => {
  return (
    <div className=" flex justify-center items-center h-full min-h-96">
      <CircularProgress size={50} color="primary" />
    </div>
  );
};
