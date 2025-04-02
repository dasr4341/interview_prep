import { client } from 'apiClient';
import { CareTeamTypes, GetAllCareTeamType, GetAllCareTeamType_pretaaHealthGetAllCareTeamType } from 'health-generatedTypes';
import { fork, put, takeEvery } from 'redux-saga/effects';
import { authSliceActions } from '../auth/auth.slice';
import { GetAllCareTeamTypeQuery } from 'graphql/getAllCareTeamType.query';
import { appSliceActions } from './app.slice';
import catchError from 'lib/catch-error';

export function formatCareTeamTypeArr(array: GetAllCareTeamType_pretaaHealthGetAllCareTeamType[]) {
  return array.reduce((prevState: { [key: string] : GetAllCareTeamType_pretaaHealthGetAllCareTeamType }, currentState) => {
    prevState[CareTeamTypes[currentState.enumType]] = currentState;
    return prevState;
  }, {}
  );
}

function* getCareTeamLabels() {
  try {
    const { data }: { data: GetAllCareTeamType } = yield client.query<GetAllCareTeamType>({
      query: GetAllCareTeamTypeQuery,
    });
    if (data) {
      yield put(appSliceActions.setCareTeamTypeLabels({
        remoteData: data.pretaaHealthGetAllCareTeamType,
        formattedData: formatCareTeamTypeArr(data.pretaaHealthGetAllCareTeamType)
      }));
      yield put(appSliceActions.setClinicianFilterClinicianType(formatCareTeamTypeArr(data.pretaaHealthGetAllCareTeamType)));
    }
  } catch (e) {
    catchError(e, true);
  }
}

function* invoke() {
  yield takeEvery(authSliceActions.getCurrentUser, getCareTeamLabels);
}

export default function* appSaga() {
  yield fork(invoke);
}
