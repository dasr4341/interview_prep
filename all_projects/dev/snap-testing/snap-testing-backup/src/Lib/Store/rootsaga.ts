import { all } from 'redux-saga/effects';

import captionsSagas from './Captions/CaptionsSaga';
import compilationSagas from './Page/Compilation/CompilationSaga';
import tilesSagas from './Page/Tiles/TilesSaga';

export default function* rootSaga() {
  yield all([captionsSagas(), compilationSagas(), tilesSagas()]);
}
