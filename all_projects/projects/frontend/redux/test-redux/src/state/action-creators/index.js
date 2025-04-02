export const add = (data) => {
    console.log('action is called');
    return {
        type: 'add',
        data
    }
}