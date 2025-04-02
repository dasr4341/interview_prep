/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />


import EventsPage from '../../../lib/pages/events/events-page';
import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';

describe('Events privilege check', () => {
  const login = new LoginPage();
  const rolesPage = new RolesPage();
  const events = new EventsPage()

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

  it('Remove Event Edit Role Capabilities and verify event mark as read features not exist', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EVENTS', capabilities: ['EDIT'] })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(1000);
    events.firstEvent().then($el => $el.find('[data-test-id="pop-over-trigger-el"]')).should('not.exist')
  });
  it('Add Event Edit Role Capabilities and verify event mark as read features not exist', () => {
    rolesPage.getPrivileges({ excludePrivilege: '', })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(1000);
    events.firstEvent().then($el => $el.find('[data-test-id="pop-over-trigger-el"]')).should('exist')
  });

  it('Remove Event View Role Capabilities and verify event does not exist on sidebar', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EVENTS', capabilities: ['VIEW'] })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Events');

    cy.visit('/events');
    cy.waitForNetworkIdle(1000);
    cy.url().should('contain', '/unauthorized')

    cy.visit('/events/1212');
    cy.waitForNetworkIdle(1000);
    cy.url().should('contain', '/unauthorized')

  });

  it('Add Event View Role Capabilities and verify event exists', () => {
    rolesPage.getPrivileges({ excludePrivilege: '', })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Events');

    cy.get('[data-test-id="navLink-el"]').contains('Events').click();
    cy.waitForNetworkIdle(4000);
    cy.url().should('contain', '/events')

    events.firstEvent().click();
    cy.waitForNetworkIdle(3000);
    events.pageHeader().should('contain.text', 'Event Details');
  });
    
});
