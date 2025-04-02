import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';
import EventsPage from '../../../lib/pages/events/events-page';

describe('Data Object page flow', () => {
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
    cy.url().should('include', '/events');
  });

  it('Disable Data Object VIEW capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'DATA_OBJECT_COLLECTIONS', capabilities: ['VIEW'] })
      .then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Data Objects');
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/unauthorized');
  });

  it('Enable Data Object VIEW capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
      .then((response) => rolesPage.updateRole(response));
      cy.reload();
      cy.waitForNetworkIdle(5000);
      cy.visit('/settings/admin/data-objects');
      cy.waitForNetworkIdle(2000);
      cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Data Objects');
      cy.url().should('contain', '/settings/admin/data-objects');
  });



  it('Disable Data Object EDIT capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'DATA_OBJECT_COLLECTIONS', capabilities: ['EDIT'] })
      .then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Data Objects');
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/admin/data-objects');
    events.firstObject()
      .then($el => $el.find('[data-test-id="pop-over-trigger-el"]'))
      .click().should('not.contain.text', 'EDIT')

      cy.visit('settings/admin/data-objects/details');
      cy.waitForNetworkIdle(1000);
      cy.get('.btn').click();
      cy.url().should('contain', '/unauthorized');
  });

  it('Enable Data Object EDIT capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/admin/data-objects');
    events.firstObject().then($el => $el.find('[data-test-id="pop-over-trigger-el"]'))
    .click()
    .get('[data-test-id="options"]')
    .should('contain.text', 'EDIT')
  });

  it('Disable Data Object DELETE capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'DATA_OBJECT_COLLECTIONS', capabilities: ['DELETE'] }).then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Data Objects');
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/admin/data-objects');
    events.firstObject()
      .then($el => $el.find('[data-test-id="pop-over-trigger-el"]'))
      .click().should('not.contain.text', 'DELETE')
  });


  it('Enable Data Object DELETE capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Data Objects');
    cy.url().should('contain', '/settings/admin/data-objects');
    events.firstObject()
    .then($el => $el.find('[data-test-id="pop-over-trigger-el"]'))
    .click().get('[data-test-id="options"]').should('contain.text', 'DELETE')
  });


  it('Disable Data Object CREATE capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'DATA_OBJECT_COLLECTIONS', capabilities: ['CREATE'] })
      .then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Data Objects');
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/admin/data-objects');
    cy.get('[data-testid="create-data-object-button"]').should('not.exist');
  });



  it('Enable Data Object CREATE capabilities and check UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
      .then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/admin/data-objects');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Data Objects');
    cy.url().should('contain', '/settings/admin/data-objects');
    cy.waitForNetworkIdle(3000);
    cy.get('[data-testid="create-data-object-button"]').should('exist');
  });

});
