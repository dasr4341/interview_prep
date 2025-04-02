export function authorizeFitbit() {
  console.log({ clientID: process.env.REACT_APP_FITBIT_CLIENTID });
  const url = new URL('/oauth2/authorize', 'https://www.fitbit.com');
  url.searchParams.append('client_id', String(process.env.REACT_APP_FITBIT_CLIENTID));
  url.searchParams.append('response_type', 'code');
  // eslint-disable-next-line max-len
  url.searchParams.append('scope', 'activity heartrate location nutrition profile settings sleep social weight oxygen_saturation respiratory_rate temperature cardio_fitness social');
  url.searchParams.append('redirect_uri', `${location.origin}/fhs-confirm`);
  url.searchParams.append('expires_in', '31536000');
  url.searchParams.append('disableThirdPartyLogin', 'true');
  window.open(url.toString(), '_self');
}