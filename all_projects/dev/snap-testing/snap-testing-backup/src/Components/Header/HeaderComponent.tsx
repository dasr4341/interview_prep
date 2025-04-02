import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import routes from 'Lib/Routes/Routes';
import { resetToken } from 'Lib/HelperFunction/resetToken';
import { config } from 'config';

export default function HeaderComponent() {
  const navigate = useNavigate();
  function logout() {
    resetToken();
    navigate(routes.login.path, { replace: true });
  }
  return (
    <div >
      <AppBar position='static' className='drop-shadow-sm'>
        <Toolbar className='bg-slate-400 justify-between' >
          <Link to={routes.compilationList.path}>
            <Typography variant='h6'>Snappy</Typography>
          </Link>
          {localStorage.getItem(config.storage.token) && <div onClick={() => logout()} className='bg-red-300 px-3 py-1 rounded capitalize hover:bg-red-400 text-sm tracking-wider font-normal cursor-pointer '>logout</div>}
        </Toolbar>
      </AppBar>
    </div>
  );
}
