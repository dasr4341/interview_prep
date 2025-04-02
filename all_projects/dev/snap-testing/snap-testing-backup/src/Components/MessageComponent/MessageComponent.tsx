import React, { ReactNode } from 'react';
import { Alert } from '@mui/material';


export default function MessageComponent({ children }: { children?: ReactNode }) {
  return <>{children && <Alert severity='error'>{children}</Alert>}</>;
}
