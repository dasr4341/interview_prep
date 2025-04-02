/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import login from "../../page/login";

describe('Profile page email assertion', () => {
  const loginPage = new login();

  it('Go to Profile page', () => {
    loginPage.login();
    const credentials = Cypress.env("patient_user_name_with_password").split(":");
    cy.waitForNetworkIdle(1000);
    cy.contains('Settings').click();
    cy.contains('Profile').click();
    cy.get('[data-testid="logged-in-email-id"]').should('contain.text', credentials[0]);
  })
})
