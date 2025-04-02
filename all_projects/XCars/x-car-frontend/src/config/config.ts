export const configVar = {
  otp: '1234',
  phoneRegExp: /^[6-9]{1}[0-9]{9}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  drivenMin: 100,
  drivenMax: 150000,
  ownersMax: 5,
};

export const config = {
  app: {
    title: 'XCars',
    baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
    applicationType: 'WEB',
    downloadAppUrl: process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL!,
  },
  storage: {
    app_data: 'xCar_app_data_client',
  },
  emitter: {
    forBidden: 'forBidden',
    tokenIncorrect: 'tokenIncorrect',
    network_disconnected: 'network_disconnected',
    api_server_down: 'api_server_down',
  },
  razorpay: {
    razorpaySignature: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY!,
  },
};

export const GalleryType = {
  Thumbnail: 'thumbnail',
  Video: 'video',
  Images: 'images',
};
