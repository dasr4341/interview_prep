/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';

describe('Login Flow check', () => {

  before(() => {
    cy.clearLocalStorageSnapshot()
  });
  
  it('Login with password', () => {
    const login = new LoginPage();
    login.superAdminLogin();
    cy.url().should('include', '/super-admin/settings/control-panel');
    login.logout()
    cy.url().should('include', '/super-admin/login')
  });

});
