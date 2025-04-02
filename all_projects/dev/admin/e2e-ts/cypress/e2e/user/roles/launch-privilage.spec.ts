import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';
import EventsPage from '../../../lib/pages/events/events-page';

describe('Launch  page flow', () => {
  const login = new LoginPage();
  const rolesPage = new RolesPage();
  const events = new EventsPage();

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
    cy.url().should('include', '/events');
  });

  it('Disable EXECUTE Launch and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'LAUNCH', capabilities: ['EXECUTE'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/companies/list').get('[data-test-id="company-row"]').first().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="floating-btn"]').click().should('not.contain.text', 'launch');
  });

  it('Enable EXECUTE Launch and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/companies/list').get('[data-test-id="company-row"]').first().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="floating-btn"]').click().should('not.contain.text', 'launch');
  });

  it('Disable VIEW Launch and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'LAUNCH', capabilities: ['VIEW'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/companies/list').get('[data-test-id="company-row"]').first().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="link-list"]').should('not.contain.text', 'Launched');
  });

  it('Enable VIEW Launch and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/companies/list').get('[data-test-id="company-row"]').first().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="link-list"]').should('contain.text', 'Launched');
  });
});
