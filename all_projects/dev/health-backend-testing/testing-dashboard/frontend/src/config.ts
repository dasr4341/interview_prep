enum EnvironmentList {
  clientDev = 'client_dev',
  production = 'production',
}
export enum SourceSystemTypesEnum {
  'KIPU' = 'kipu',
  'RITTEN' = 'ritten',
}
export enum DataSourceEnum {
  KIPU = 'KIPU',
  LOCAL = 'LOCAL',
  RITTEN = 'RITTEN'
}

export const config = {
  apiEndPoints: {
    schedulerFrequency: 'api/scheduler/list',
    sourceSystem: '/api/source-system/',
    sourceSystemFacilityList: 'api/source-system/facilityList/',
    reportTestData: '/api/reports/reports-test-data',
    facilitiesList: '/api/facilities/list',
    reportLogs: '/api/logs/report-logs'
  },
  baseUrl: process.env.REACT_APP_API_ENDPOINT,
  storage: {
    api_instance: 'api_instance',
    facilityList: {
      rittenFacilityList: 'ritten_facility_list',
      kipuFacilityList: 'kipu_facility_list',
    }
  },
  environment: {
    defaultEnv: EnvironmentList.clientDev,
    list: EnvironmentList,
  },
};
