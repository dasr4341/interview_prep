
const common = {
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + '/login/callback',
};

const oktaAuthConfig = {
  // Note: If your app is configured to use the Implicit flow
  // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
  // you will need to add `pkce: false`
  issuer: `${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`,
  ...common,
};

const oktaSignInConfig = {
  baseUrl: process.env.REACT_APP_OKTA_DOMAIN as string,
  ...common,
  authParams: {
    // If your app is configured to use the Implicit flow
    // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
    // you will need to uncomment the below line
    // pkce: false
  }
  // Additional documentation on config options can be found at
  // https://github.com/okta/okta-signin-widget#basic-config-options
};

export { oktaAuthConfig, oktaSignInConfig };
