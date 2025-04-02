
export const messageData = {
    invalidData: 'Please send proper data',
    pageNotFound: 'Page Not Found',
    fetchedDataSuccessfully: 'Fetched data successfully',
    inValidSourceSystemType: 'Invalid Source system type',
    dbInstanceNotFound: 'Db instance not found',
    ritten: {
        failedToLogin: 'Failed to login into ritten',
        failedToFetchData: 'Failed to fetch data from ritten'
    },
    reportLogsInfo: 'Report Logs max limit 20',
    errorInFetchingDataFromDb: (moreInfo?:string) => `Error is fetching data. ${moreInfo}`
}