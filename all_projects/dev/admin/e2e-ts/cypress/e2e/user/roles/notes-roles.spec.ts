/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

import LoginPage from "../../../lib/pages/login/login";
import RolesPage from '../../../lib/pages/roles/roles';

describe('Notes privilege check', () => {
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

  it('Remove view privilege for note and check functionality', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'NOTES', capabilities: ['VIEW'] })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);

    //check from event details
    cy.visit('/events/12543546/notes');
    cy.waitForNetworkIdle(3000);
    cy.url().should('contain', '/unauthorized');

    //check from company details
    cy.visit('/companies/1234768/notes');
    cy.waitForNetworkIdle(3000);
    cy.url().should('contain', '/unauthorized');

    //check from my notes
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(3000);
    cy.url().should('contain', '/unauthorized');

    //check from opportunity detail
    cy.visit('/companies/123245/notes?opportunityId=12234');
    cy.waitForNetworkIdle(3000);
    cy.url().should('contain', '/unauthorized');

    //check sidebar my notes nav
    cy.get('[data-test-id="parent-nav-el"]').click();
    rolesPage.navLinkEl().should('not.include.text', 'My Notes');
  });

  it('Add note view privilege and check functionality', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);

    //check from event details
    cy.visit('/events/12543546/notes');
    cy.waitForNetworkIdle(3000);
    cy.url().should('not.contain', '/unauthorized');

    //check from company details
    cy.visit('/companies/1234768/notes');
    cy.waitForNetworkIdle(3000);
    cy.url().should('not.contain', '/unauthorized');

    //check from my notes
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(3000);
    cy.url().should('not.contain', '/unauthorized');

    //check from opportunity detail
    cy.visit('/companies/123245/notes?opportunityId=12234');
    cy.waitForNetworkIdle(3000);
    cy.url().should('not.contain', '/unauthorized');

    //check sidebar my notes nav
    cy.get('[data-test-id="parent-nav-el"]').click();
    rolesPage.navLinkEl().should('include.text', 'My Notes');
  });

  it('Remove note create privilege and check functionality', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'NOTES', capabilities: ['CREATE'] })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/events');
    cy.waitForNetworkIdle(3000);

    //check from event details
    rolesPage.getEventId();
    cy.get('[data-test-id="floating-btn"]').click();
    cy.get('[data-testid="note-create"]').should('not.exist');

    //check from company details
    cy.visit('/companies/list');
    rolesPage.getCompanyId();
    cy.get('[data-test-id="floating-btn"]').click();
    cy.get('[data-testid="note-create"]').should('not.exist');

    //check from opportunity details
    rolesPage.opportunityNoteCheck();
    cy.get('[data-testid="note-create"]').should('not.exist');

    //check from my notes
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="floating-btn"]').should('not.exist');
  });

  it('Add note create privilege and check functionality', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/events');
    cy.waitForNetworkIdle(3000);

    //check from event details
    rolesPage.getEventId();
    cy.get('[data-test-id="floating-btn"]').click();
    cy.get('[data-testid="note-create"]').should('exist');

    //check from company details
    cy.visit('/companies/list');
    rolesPage.getCompanyId();
    cy.get('[data-test-id="floating-btn"]').click();
    cy.get('[data-testid="note-create"]').should('exist');

    //check from opportunity details
    rolesPage.opportunityNoteCheck();
    cy.get('[data-testid="note-create"]').should('exist');

    //check from my notes
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="floating-btn"]').should('exist');
  });

  it('Remove note delete privilege and check functionality', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'NOTES', capabilities: ['DELETE'] })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);

    //check from my notes
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(4000);
    cy.get('[data-testid="note-item"]').first().find('[data-test-id="pop-over-trigger-el"]').click();
    cy.get('[data-test-id="options"]').should('not.include.text', 'Delete');

    cy.get('[data-testid="note-item"]').first().click();
    cy.waitForNetworkIdle(4000);
    cy.get('[data-testid="content-footer"]').should('not.contain', 'Delete');
  });

  it('Add note delete privilege and check functionality', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);

    //check from my notes
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(4000);
    cy.get('[data-testid="note-item"]').first().find('[data-test-id="pop-over-trigger-el"]').click();
    cy.get('[data-test-id="options"]').should('include.text', 'Delete');

    cy.get('[data-testid="note-item"]').first().click();
    cy.waitForNetworkIdle(4000);
    cy.get('[data-testid="content-footer"]').should('contain', 'Delete');
  });
});