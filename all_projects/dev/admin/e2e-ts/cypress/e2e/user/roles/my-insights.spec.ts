/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';

describe('My Insights privilege check', () => {
  const login = new LoginPage();
  const rolesPage = new RolesPage();

  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Login', () => {
    login.loginWithPassword();
  });

  it('Checking My Insights Role Capabilities Feature', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'MY_INSIGHTS', capabilities: ['VIEW'] })
      .then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(4000);
    cy.visit('/dashboard/me');
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'My Insights');
    cy.url().should('contain', '/unauthorized');

    rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(4000);
    cy.visit('/dashboard/me');
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'My Insights');
    cy.url().should('contain', '/dashboard/me');
  });
});
