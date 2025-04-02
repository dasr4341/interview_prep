const res = (pData = [], action) => {
    console.log('test reducer is called');
    if (action.type === 'test') {
        return [action.data,...pData]
    } else if (action.type === 'test-api') {
        return [action.data, ...pData];
    }
    else {
        return pData;
    }
}
export default res;