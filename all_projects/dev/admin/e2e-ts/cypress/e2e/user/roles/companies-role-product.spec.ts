import CompanyListPage from '../../../lib/pages/companies/company-page';
import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';

describe('Companies privilege check', () => {
  const login = new LoginPage();
  const rolesPage = new RolesPage();
  const companyPage = new CompanyListPage();
  let product = null;
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

  it('Disable Companies VIEW Role Capabilities for Product and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'COMPANIES', capabilities: ['VIEW'] }).then((response: any) => rolesPage.updateRole(response));

    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Companies');

    cy.visit('/companies/list');
    cy.waitForNetworkIdle(1000);
    cy.url().should('contain', '/unauthorized');

    cy.visit('/companies/1212');
    cy.waitForNetworkIdle(1000);
    cy.url().should('contain', '/unauthorized');
  });

  it('Enable Companies VIEW Role Capabilities for Product and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Companies');
    cy.get('[data-test-id="navLink-el"]').contains('Companies').click();
    cy.waitForNetworkIdle(4000);
    cy.url().should('contain', '/companies/list');
    companyPage.firstCompany().click();
    cy.waitForNetworkIdle(3000);
    companyPage.pageTitle().should('contain.text', 'Details');
    companyPage.getTitle();
    cy.get('@productTitle').then((el) => {
      product = el.text();
      console.log(product);
      cy.get('[data-test-id="Products-link"]').click();
      companyPage.verifyProductTitle({ product })
    });
  });
});
