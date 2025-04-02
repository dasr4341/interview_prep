import { RootState } from './../../Store';
import { fork, put, takeEvery, select } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { snapActionsApi } from '../../../Api/snap-actions-api';
import { TilesInterface } from 'Interface/Tiles';
import { tilesActions } from './TilesSlice';
import { handleError } from 'Lib/Api/api-client';
import { cloneDeep } from 'lodash';
import { AddCaptionInterface } from 'Interface/AddCaption';
import { DeleteCaptionInterface, DeleteTilesPayload } from 'Interface/DeleteCaption';

function* getTilesDetailsMiddleWare({ payload }: { payload: number }): any {
  try {
    const tilesDetails: TilesInterface[] = yield snapActionsApi.getTileDetails(payload);
    yield put(tilesActions.setTilesDetails(tilesDetails));
  } catch (e: any) {
    handleError(e);
  }
}
function* getTilesDetailsSagas() {
  yield takeEvery(tilesActions.getTilesDetails, getTilesDetailsMiddleWare);
}

function* addCaptionsMiddleware({ payload }: { payload: AddCaptionInterface }): any {
  try {
    const addCaptionsResponse = yield snapActionsApi.addCaption(payload);
    yield put(tilesActions.updateTileByCaption(addCaptionsResponse));
    yield put(
      tilesActions.updateCaptionForm({
        adding: false,
        error: null,
        onFocus: true,
      })
    );
  } catch (e: any) {
    handleError(e);
    yield put(
      tilesActions.updateCaptionForm({
        adding: false,
        error: e.message,
        onFocus: false,
      })
    );
  }
}
function* addCaptionsSaga() {
  yield takeEvery(tilesActions.addCaptions, addCaptionsMiddleware);
}

function* deleteCaptionsMiddleware({ payload }: { payload: DeleteCaptionInterface }) {
  try {
    yield snapActionsApi.deleteCaption(payload.id, { tile_id: payload.tile_id, caption_text: payload.caption_text });

    const tiles: TilesInterface[] = yield select((state: RootState) => state.tiles.tiles);
    const index = tiles.findIndex((t) => t.id === payload.tile_id);
    const newTiles = cloneDeep(tiles);

    newTiles[index] = {
      ...newTiles[index],
      captions: newTiles[index].captions?.filter((c) => c.id !== payload.id),
    };

    yield put(tilesActions.setTilesDetails(newTiles));
    toast.success('Caption deleted');
  } catch (e: any) {
    handleError(e);
  }
}
function* deleteCaptionsSaga() {
  yield takeEvery(tilesActions.deleteCaption, deleteCaptionsMiddleware);
}

function* deleteTilesMiddleware({ payload }: { payload: DeleteTilesPayload }) {
  try {
    yield snapActionsApi.deleteTiles(payload.tile_id);
    const tiles: TilesInterface[] = yield select((state: RootState) => state.tiles.tiles);
    const newTiles = tiles.filter((t) => t.id !== payload.tile_id);
    yield put(tilesActions.setTilesDetails(newTiles));
    toast.success('Tile deleted successfully');
  } catch (e: any) {
    handleError(e);
  }
}
function* deleteTilesSaga() {
  yield takeEvery(tilesActions.deleteTiles, deleteTilesMiddleware);
}

export default function* tilesSagas() {
  yield fork(getTilesDetailsSagas);
  yield fork(addCaptionsSaga);
  yield fork(deleteCaptionsSaga);
  yield fork(deleteTilesSaga);
}
