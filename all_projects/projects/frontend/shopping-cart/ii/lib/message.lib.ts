export const messageData = {
    success: {
        dataRetrievedSuccessFull : 'Data retrieved successful'
    },
    error: {
        failedToFetch: 'Failed to fetch',
        invalidData: (extraMessage?: string) =>  `Invalid data !!  ${extraMessage && `: ${extraMessage}`}`
    }
}