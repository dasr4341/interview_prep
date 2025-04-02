/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import CompaniesPage from "../../../lib/pages/settings/company-mangements";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import * as faker from 'faker';

describe('Company list create and delete flow', () => {
  const login = new LoginPage();
  const settingsPage = new SettingsPage();
  const companiesPage = new CompaniesPage();
  const companyName = 'test company name ' + faker.lorem.word();

  before(() => {
    cy.clearLocalStorageSnapshot()
  })

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

  it('Go to company list management page', () => {
    settingsPage.clickSettingsMenu();
    settingsPage.clickAdminMenu();
    settingsPage.clickCompaniesMenu();
    cy.url().should('include', '/settings/admin/company-management-list/group');
    settingsPage.headerText().should('contain.text', 'Company List Management');
  })

  it('Create a company list', () => {
    companiesPage.createCompanyListButton();
    settingsPage.headerText().should('contain.text', 'Company Management');
    cy.url().should('include', '/company-management-list');
    cy.waitForNetworkIdle(3000);
    companiesPage.selectAllCompaniesCheckBox();
    companiesPage.createCompanyListButton();
    settingsPage.headerText().should('contain.text', 'New Company List');
    companiesPage.companyListFieldHeading().should('contain.text', 'Company list name');
    companiesPage.CompaniesButton().should('contain.text', 'Manage Companies');
    cy.waitForNetworkIdle(4000)
    settingsPage.fillFieldName(companyName);
    settingsPage.saveButton();
    cy.waitForNetworkIdle(3000);
    companiesPage.companyListName().should('contain.text', companyName);
  });

  it('Delete created company list', () => {
    companiesPage.deleteCompanyList(companyName);
  });
});
