/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";

describe('Login Flow check', () => {

  before(() => {
    cy.clearLocalStorageSnapshot()
  });
  
  it('Login with password', () => {
    const login = new LoginPage();
    login.loginWithPassword();
    cy.url().should('include', '/events');
    login.logout();
    cy.url().should('include', '/login');
  });
});
