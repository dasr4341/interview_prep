/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../../../../Lib/Store/hooks';
import { CompilationListInterface } from '../../../../Interface/CompilationListInterface';
import { compilationActions } from 'Lib/Store/Page/Compilation/CompilationSlice';
import { useNavigate } from 'react-router-dom';
import routes from 'Lib/Routes/Routes';
import { tilesActions } from 'Lib/Store/Page/Tiles/TilesSlice';

export interface SetCompilationNameInterface {
  label: string;
  value: string;
  id: string;
}
export interface OptionInterface {
  label: string;
  value: string;
  id: number;
}
export default function SearchCompilations({ tileInfo }: { tileInfo: { name: string; id: number } }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const compilationName: OptionInterface[] = [];
  const compilationList = useAppSelector(
    (state) => state.compilation.compilationList as unknown as CompilationListInterface[]
  );
  const loading = useAppSelector((state) => state.compilation.loading);

  const setCompilationName = () => {
    compilationList.map((e) => {
      compilationName.push({ label: String(e.name), value: String(e.name), id: Number(e.id) });
      return { label: String(e.name), value: String(e.name), id: Number(e.id) };
    });
    return compilationName;
  };

  useEffect(() => {
    dispatch(compilationActions.getCompilationList());
  }, []);


  const customStyles = {
    option: (base: any, state: any) => {
        return ({
          ...base,
          color: state.data.id === tileInfo.id ? 'white' : 'black',
          background: state.data.id === tileInfo.id ? '#648ef5' : 'white'
        });
    },
    control: (base: any) => {
      return ({
        ...base,
        height: 50,
        borderColor: '#EAEAEA',
      });
    }
  };

  return (
    <>
      <Select
        value={{ label: tileInfo.name, value: tileInfo.name, id: tileInfo.id }}
        options={setCompilationName()}
        isLoading={loading}
        onChange={(data) => {
          dispatch(tilesActions.setTilesEmpty());
          navigate(`/${routes.tilesList.absolutePath + data?.id}`);
        }}
        placeholder='Search Tile Sets...'
        styles={customStyles}
      />
    </>
  );
}
