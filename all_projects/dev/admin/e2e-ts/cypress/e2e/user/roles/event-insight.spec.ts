import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';

describe('Event insight page flow', () => {
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
    cy.url().should('include', '/events');
  });

  it('Disable Events view capabilities and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EVENTS', capabilities: ['VIEW'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Events');
    cy.visit('/events');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/unauthorized');
  });


  it('Enable Events view capabilities and re-check UI', () => {
   rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
   cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/events');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Events');
    cy.url().should('contain', '/events');
  });

  it('Disable Events Edit capabilities and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege:'EVENTS', capabilities: ['EDIT'] }).then((response: 
  any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/events');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Events');
    cy.url().should('contain', '/events');
  });
    
  it('Enable Events view capabilities and verify UI', () => {
   rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole
  (response));
   cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/events');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Events');
    cy.url().should('contain', '/events');
  });


});