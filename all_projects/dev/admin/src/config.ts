export const config = {
  pusher: {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    key: process.env.REACT_APP_PUSHER_KEY,
  },
  pretaa: {
    apiURL: process.env.REACT_APP_PRETAA_API_URL,
    serverHost: process.env.REACT_APP_PRETAA_SERVER_HOST,
  },
  salesforce: {
    consumerKey: process.env.REACT_APP_SALESFORCE_CONSUMER_KEY,
  },
  storage: {
    impersonation_mode: 'impersonation_mode',
    user_store: 'user_store',
    admin_store: 'admin_store',
    refreshToken: 'refreshToken',
    token: 'token',
    loginTime: 'loginTime',
    session_id: 'session_id',
    last_url: 'pretaa_last_url'
  },
  emitter: {
    forBidden: 'forBidden',
    tokenIncorrect: 'tokenIncorrect'
  },
  pagination: {
    limit: 1000,
  },
  requestLimit: {
    default: 1000
  }
};
