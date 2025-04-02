/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';
import FloatingButton from '../../../lib/components/floating-button';
import NavElement from '../../../lib/components/nav';
import CompanyListPage from '../../../lib/pages/companies/company-page';


describe('My Insights privilege check', () => {
  const login = new LoginPage();
  const rolesPage = new RolesPage();
  let companyID = null;
  const companyPage = new CompanyListPage();
  

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

  // Test privileges for uncheck values
  it('Remove Reference Create Capabilities and verify for reference create', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'ADD_A_REFERENCE', capabilities: ['CREATE'] })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();

    // Reference create privileges now disable so we will check reference create functionality should not available in UI 
    NavElement().companyList().click();

    // Set company Id for later use 
    cy.get('[data-test-name="company-id"]').then($el => companyID = $el.attr('data-test-company-id'));

    new CompanyListPage().firstCompany().click();
    cy.waitForNetworkIdle(1000);
    new FloatingButton().open();
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Add Reference');
  });

  it('Reference create should not accessible by URL', () => {
    NavElement().companyList().click();
    cy.waitForNetworkIdle(1000);
    cy.visit(`/companies/${companyID}/reference/add`);
    cy.waitForNetworkIdle(1000);
    cy.url().should('contain', '/unauthorized');
  });


  it('Add all Reference Capabilities and verify for reference create ', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response: any) => rolesPage.updateRole(response));

    cy.reload();

    // Reference create privileges now enable so we will check reference create functionality 
    NavElement().companyList().click();

    // Set company Id for later use 
    cy.get('[data-test-name="company-id"]').then($el => companyID = $el.attr('data-test-company-id'));

    new CompanyListPage().firstCompany().click();
    cy.waitForNetworkIdle(1000);
    new FloatingButton().open();
    cy.get('[data-testid="reference-create"]').should('contain.text', 'Add Reference');
  });

  it('Reference create should accessible by URL', () => {
    NavElement().companyList().click();
    cy.waitForNetworkIdle(1000);
    cy.visit(`/companies/${companyID}/reference/add`);
    cy.waitForNetworkIdle(1000);
    companyPage.pageTitle().should('contain.text', 'Reference');
  });

  it('Remove reference view capabilities and verify for reference view ', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'ADD_A_REFERENCE', capabilities: ['VIEW'] })
    .then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    NavElement().companyList().click();
    new CompanyListPage().firstCompany().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="link-list"]').should('not.contain.text', 'Reference');
  });

  it('Reference list should not accessible by URL', () => {
    NavElement().companyList().click();
    cy.waitForNetworkIdle(1000);
    cy.visit(`/companies/${companyID}/references`);
    cy.waitForNetworkIdle(1000);
    cy.url().should('contain', '/unauthorized');
  });

  it('Add all Reference capabilities and verify for reference view ', () => {
    rolesPage.getPrivileges({ excludePrivilege: '' })
    .then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    NavElement().companyList().click();
    new CompanyListPage().firstCompany().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="link-list"]').should('contain.text', 'Reference');
  });

  it('Reference list should accessible by URL', () => {
    NavElement().companyList().click();
    cy.waitForNetworkIdle(1000);
    cy.visit(`/companies/${companyID}/references`);
    cy.waitForNetworkIdle(1000);
    companyPage.pageTitle().should('contain.text', 'References');
  });
  
});


