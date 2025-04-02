import { TabNames } from "screens/auth/AppleOnboarding/lib/apple-onboarding-interface";
import { buildUrl, makeRoute } from "./lib-router";

export const onboardingRoutes = {
  //fitbit
  authenticateWithFhs: makeRoute('/authenticate-with-fhs', {
    name: 'AuthenticateFitbit',
  }),
  linkWithFitbit: makeRoute('/link-with-fitbit', { name: 'LinkWithFitBit' }),
  fhsConfirm: makeRoute('/fhs-confirm', { name: 'FitbitConfirm' }),
  fhsInvitation: makeRoute('/fhs-invitation', { name: 'FitbitInvitation' }),
  fhsThankyou: makeRoute('/fhs-thankyou', { name: 'FitbitThankyou' }),
  fhsOnboarding: makeRoute('/fhs-onboarding', { name: 'FitbitOnboarding' }),
  fhsJoinTheProgramme: makeRoute('/fhs-join-the-programme', {
    name: 'FitbitJoinTheProgramme',
  }),
  fhsAgreeAndProceed: makeRoute('/fhs-agree-and-proceed', { name: 'Fitbit' }),

  appleOnboarding: {
    view: {
      match: '/apple-onboarding',
      name: 'AppleOnboardingView',
    },
    connect: {
      match: '/apple-onboarding/:pageType',
      name: 'AppleOnboardingPage',
      build: (pageType: TabNames) => buildUrl(`/apple-onboarding/${pageType}`)
    },
  },

  fhsConnect: makeRoute('/fhs-connect', { name: 'ConnectFitbit' }),
}
