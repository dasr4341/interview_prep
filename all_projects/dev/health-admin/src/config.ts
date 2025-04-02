export const config = {
  pusher: {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    key: process.env.REACT_APP_PUSHER_KEY,
  },
  pretaa: {
    apiURL: localStorage.getItem('API_URL')
      ? `${localStorage.getItem('API_URL')}/graphql`
      : `${process.env.REACT_APP_PRETAA_API_URL}/graphql`,
    apiURLAppleWatch: process.env.REACT_APP_PRETAA_API_URL + '/watch',
    apiRoot: localStorage.getItem('API_URL')
    ? `${localStorage.getItem('API_URL')}`
      : `${process.env.REACT_APP_PRETAA_API_URL}`,
   
  },
  salesforce: {
    consumerKey: process.env.REACT_APP_SALESFORCE_CONSUMER_KEY,
  },
  storage: {
    user_store: 'user_store',
    owner_store: 'owner_store',
    refreshToken: 'refreshToken',
    token: 'token',
    loginTime: 'loginTime',
    session_id: 'session_id',
    last_url: 'pretaa_last_url',
    app_env: 'app_env',
    facilityId: 'onboarding_facility_id',
    userLocation: 'pretaa_user_location',
    app_data: 'pretaa_app_data',
    app_debug: 'app_debug',
    health_data_type: 'health_data_type'
  },
  emitter: {
    geofences: {
      onClickMarker: 'onClickMarker',
      onClickCircle: 'onClickCircle'
    },
    forBidden: 'forBidden',
    tokenIncorrect: 'tokenIncorrect',
    network_disconnected: 'network_disconnected',
    api_server_down: 'api_server_down',
    searchSurvey: 'searchSurvey',
    searchCampaign: 'search_campaign',
    scheduleListTemplateName: 'schedule_list_template_name',
    patientSearch: 'patientSearch'
  },
  pagination: {
    defaultTakeForGeofence : 20,
    defaultTake: 50,
    defaultAgGridTake: 10000,
  },
  idleTimeLimit: {
    timeout: 30 * 60 * 1000 // 30mins
  },
  patterns: {
    // eslint-disable-next-line no-useless-escape
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\[\]\$%^\\\&*()|\-_=+{};:,<.>\?~`"']).{8,32}$/,
    otp: /^\d*$/,
    numberOnly: /^\d*$/,
    phoneNo: /^[0-9()+\s-]+$/,
  },
  roles: {
    owner: 'PRETAA_ADMIN',
    otherUser: 'OTHERS',
  },
  form: {
    descriptionMaxLength: 400,
    passwordMaxLength: 32,
    inputFieldMaxLength: 100,
    largeInputFieldMaxLength: 400,
    largeTextLength: 1000,
    textAreaMaxLength: 3000,
    largeTextAreaMaxLength: 5000,
  },
  agGridKey: process.env.REACT_APP_agGridLicenseKey,
  dateFormat: 'MM/dd/yyyy',
  agGridDateFormat: 'yyyy-MM-dd',
  agGridDateFilterFormat: 'dd/MM/yyyy',
  monthDateFormat: 'MM/dd',
  dateTimeFormat: 'MM/dd/yyyy -  hh:mm:ss aa',
  agGridDateTimeFormat: 'MM/dd/yyyy, h:mm a',
  timeFormat: 'hh:mm a',
  map: {
    minZoom: 2,
    maxZoom: 17,
    apiKey: 'AIzaSyCbBJfPTispNQfb96GDai5lhFBE47WIxkI',
  },
  largeDefaultTake: 10000,
  pretaaAdminDetails: {
    name: 'Pretaa Admin',
  },
  preloadAppTemplateTime: 3000
};

