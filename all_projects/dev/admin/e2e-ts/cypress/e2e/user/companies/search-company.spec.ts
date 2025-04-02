/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import CompanyPage from "../../../lib/pages/companies/company-page";
import * as faker from 'faker';

describe('Company search flow', () => {
  const loginPage = new LoginPage();
  const companies = new CompanyPage();
  const invalidDataSearch = 'test search' + faker.lorem.words();

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
    loginPage.loginWithPassword();
    cy.url().should('include', '/events');
  });

  it('Go to Companies list', () => {
    companies.companiesMenu();
    cy.wait(5000);
    companies.pageHeader().should('contain.text', 'Companies');
  });

  it('Search company by valid company name and invalid data', () => {
    companies.companiesListExist();
    cy.get('@companyCount').then((count) => {
      if (count) {
        companies.fillSearchField(invalidDataSearch);
        companies.noDataFoundText().should('contain.text', 'No results');
        companies.searchField().clear();
        cy.wait(3000);
        companies.firstCompanyName().then(($el) => {
          const companyName = $el.text();
          cy.log(companyName);
          companies.fillSearchField(companyName);
          cy.wait(2000);
          cy.get('[data-test-id="company_header"]').should('contain.text', companyName);
        })
      }
    });
  });
})