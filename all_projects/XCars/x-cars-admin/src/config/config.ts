export const config = {
  app: {
    applicationType: 'WEB',
    title: 'XCars',
    baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
    maxAllowedFiles: 5,
  },
  storage: {
    app_data: 'xCar_app_admin_data',
  },
  emitter: {
    forBidden: 'forBidden',
    tokenIncorrect: 'tokenIncorrect',
    network_disconnected: 'network_disconnected',
    api_server_down: 'api_server_down',
  },
  documents: {
    acceptedTypes: { pdf: '.pdf', png: '.png', jpg: '.jpg', mp4: '.mp4' },
    admin: [
      { value: 'PAN_CARD', label: 'Pan Card' },
      { value: 'VOTER_CARD', label: 'Voter Card' },
      { value: 'AADHAAR_CARD', label: 'Aadhar Card' },
    ],
    cars: {
      thumbnail: { label: 'Thumbnail', value: 'thumbnail' },
      video: { label: 'Video', value: 'video' },
      images: { label: 'Images', value: 'images' },
    },
  },
  operators: {
    isEquals: 'equals',
  },
  regex: {
    registrationNumberFormatter:
      /^(?<NORMAL>(?<A>[A-Z]{2})\s?(?<B>[0-9]{2})\s?(?<C>[A-Z]{1,3})\s?(?<D>[0-9]{4}))$|(?<BHARAT>(?<E>\d{2})\s?(?<F>BH)\s?(?<G>\d{4})\s?(?<H>[A-Za-z]{1,2}))$/,
  },
};
