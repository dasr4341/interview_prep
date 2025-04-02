/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import 'Styles/Dialog.scss';
import routes from 'Lib/Routes/Routes';
import { useAppDispatch, useAppSelector } from 'Lib/Store/hooks';
import { compilationActions } from 'Lib/Store/Page/Compilation/CompilationSlice';
import { CompilationListInterface } from 'Interface/CompilationListInterface';
import ListLoaderComponent from 'Components/ListLoader/ListLoader';
import { helperSliceActions } from 'Lib/Store/Helper/HelperSlice';

export default function CompilationList() {
  const dispatch = useAppDispatch();

  const compilationList = useAppSelector(
    (state) => state.compilation.compilationList as unknown as CompilationListInterface[]
  );
  const listLoader = useAppSelector((state) => state.compilation.listLoader);

  useEffect(() => {
    dispatch(compilationActions.getCompilationList());
  }, [dispatch]);

  useEffect(() => {
    if (compilationList.length > 0) {
      dispatch(helperSliceActions.setRedirectUrl(routes.tilesList.build(compilationList[0].id)));
    }
  }, [compilationList.length]);

  return (
    <>
      <div className='p-6'>{listLoader && <ListLoaderComponent />}</div>
    </>
  );
}
