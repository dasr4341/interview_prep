import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import Dashboard from '../screens/Dashboard/Dashboard';

export default function AppWrapper() {
  return (
      <Routes>
          <Route path={routes.dashboard.path} element={<Dashboard />} >
              <Route path='s' element={<>TEST</>} />
          </Route>
    </Routes>
  )
}
