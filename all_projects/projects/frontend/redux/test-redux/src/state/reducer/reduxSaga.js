import { takeEvery , put} from "redux-saga/effects";
import axios from 'axios';
function* add() {
    const url = "https://my-json-server.typicode.com/typicode/demo/posts";
    const url1 = "http://localhost:3001/order/details/1";
    console.log('saga im called');
    let data = yield axios.get(url1);
    console.log('saga data -> ', data.data);
    yield put({ type: 'test-api', data: data });
}

function* config() {
   yield takeEvery('add',add);
}

export default config;