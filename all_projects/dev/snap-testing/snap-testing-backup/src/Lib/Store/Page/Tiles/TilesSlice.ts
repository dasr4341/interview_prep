import { CaptionsInterface } from 'Interface/Captions';
import { CaptionForm } from './../../../../Interface/TilesSlice';
import { createSlice } from '@reduxjs/toolkit';
import { AddCaptionInterface } from 'Interface/AddCaption';
import { DeleteCaptionInterface, DeleteTilesPayload } from 'Interface/DeleteCaption';

import { TilesInterface } from 'Interface/Tiles';
import { TilesSliceInterface } from 'Interface/TilesSlice';

const initialState: TilesSliceInterface = {
  errorMessage: null,
  successMessage: null,
  tiles: [],
  tilesCreateLoading: false,
  listLoader: true,
  loading: false,
  captionForm: {
    adding: false,
    error: null,
    onFocus: false,
  },
  deleteLoader: null,
};

const tilesSlice = createSlice({
  name: 'tiles',
  initialState,
  reducers: {
    updateTilesLoading: (state, { payload }: { payload: boolean }) => {
      state.tilesCreateLoading = payload;
    },
    updateTilesList: (state, { payload }: { payload: TilesInterface }) => {
      state.tiles = state.tiles.concat(payload);
    },

    uploadTilesImage: (state, { payload }: { payload: File }) => {
      console.log({ state, payload });
    },

    // get tiles details by id
    getTilesDetails: (state, payload) => {
      console.log({ tiles: state.tiles, payload });
      state.deleteLoader = null;
    },
    setTilesDetails: (state, { payload }: { payload: TilesInterface[] }) => {
      state.tiles = payload;
      state.listLoader = false;
      state.loading = false;
    },
    addCaptions: (state, { payload }: { payload: AddCaptionInterface }) => {
      console.log(state, payload);
      state.captionForm = {
        adding: true,
        error: null,
        onFocus: false,
      };
    },
    updateCaptionForm: (state, { payload }: { payload: CaptionForm }) => {
      state.captionForm = payload;
    },
    updateTileByCaption: (state, { payload }: { payload: CaptionsInterface }) => {
      const tileId = payload.tile_id;
      const index = state.tiles.findIndex((e) => {
        return e.id === tileId;
      });
      state.tiles[index].captions?.push(payload);
      console.log('list updated!');
    },
    deleteCaption: (state, { payload }: { payload: DeleteCaptionInterface }) => {
      console.log(state, payload);
    },
    deleteTiles: (state, { payload }: { payload: DeleteTilesPayload }) => {
      console.log(state, payload);
      state.deleteLoader = payload.tile_id;
    },
    setTilesEmpty: (state) => {
      state.loading = true;
      state.tiles = [];
    },
  },
});

export const tilesActions = tilesSlice.actions;
export const tilesReducer = tilesSlice.reducer;
