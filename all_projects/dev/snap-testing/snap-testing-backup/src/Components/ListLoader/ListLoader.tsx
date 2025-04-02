import React from 'react';
import { Box, Skeleton } from '@mui/material';

export default function ListLoaderComponent() {
  return (
    <Box sx={{ width: '100% ' }} marginTop={8}>
      <Skeleton height={80} />

      <Skeleton animation='wave' height={80} />
      <Skeleton height={80} />
      <Skeleton animation='wave' height={80} />
      <Skeleton animation='wave' height={80} />
      <Skeleton animation='wave' height={80} />
      <Skeleton animation='wave' height={80} />
      <Skeleton animation={false} height={80} />
    </Box>
  );
}
