/// <reference types="cypress" />
import CompaniesPage from "../../../lib/pages/settings/company-mangements";
import LoginPage from "../../../lib/pages/login/login";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import * as faker from 'faker';

describe('Company List search flow check', () => {
  const login = new LoginPage();
  const companiesListPage = new CompaniesPage();
  const settingsPage = new SettingsPage();
  const invalidDataSearch = 'test search ' + faker.lorem.words();

  before(() => {
    cy.clearLocalStorageSnapshot()
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

  it('Go to company list management page', () => {
    settingsPage.clickSettingsMenu();
    settingsPage.clickAdminMenu();
    settingsPage.clickCompaniesMenu();
    cy.url().should('include', '/admin/company-management-list/group');
    settingsPage.headerText().should('contain.text', 'Company List Management');
  });

  it('Search company list by valid company list name and invalid data', () => {
    cy.waitForNetworkIdle(3000);
    cy.get('body').then(($elm) => {
      if ($elm.has('[test-data-id="companies_List"]').length) {
        companiesListPage.fillSearchField(invalidDataSearch)
        companiesListPage.noDataFoundText().should('contain.text', 'No results');
        companiesListPage.searchField().clear();
        cy.wait(3000)
        companiesListPage.firstCompanyListName()
          .then(($el) => {
            const companyListName = $el.text();
            cy.log(companyListName);
            companiesListPage.fillSearchField(companyListName);
            cy.wait(2000);
            companiesListPage.firstCompanyListName().should('contain.text', companyListName);
          });
      } else {
        companiesListPage.noResultsText().should('contain.text', 'No results');
        companiesListPage.refineSearchText().should('contain.text', 'Refine your search and try again');
      }
    })
  });
});