import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';

describe('Team insight page flow', () => {
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

  it('Disable Team insights view capabilities and test UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'TEAM_INSIGHTS', capabilities: ['VIEW'] })
      .then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/dashboard/team');
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Team Insights');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/unauthorized');
  });


  it('Enable Team insights view capabilities and test UI', () => {
   rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/dashboard/team');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Team Insights');
    cy.url().should('contain', '/dashboard/team');
  });


});