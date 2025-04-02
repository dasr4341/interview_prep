/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import Onboarding from "../page/fhs-onboarding";

describe.skip('Onboarding fitbit', () => {
  const onboarding = new Onboarding();

  it('Start onboarding process', () => {
    cy.visit(Cypress.env("baseUrl") + '/authenticate-with-fhs')
    cy.wait(2000);
  })

  it('Go to connect fitbit page', () => {
    onboarding.connectFitbit();
  })

  it('Go to the join fitbit page', () => {
    onboarding.joinProgram();
  })

  it('Go to the pretaa login page', () => {
    onboarding.fillUserDetails();
  })


  it('Go to fitbit sign in page', () => {
    cy.waitForNetworkIdle(2000);
    cy.log('Fitbit page ready!');
    onboarding.fitbitFillUserDetails();
  })

})