import {takeEvery, put} from 'redux-saga/effects';

function* getApi() {
    let data = yield fetch("http://localhost:3001/order/details/1");
    data = yield data.json();
    console.log('api calling', data);
    yield put({ type: 'test-api', data: data });
}

function* config() {
    yield takeEvery('test1', getApi);
}
export default config;