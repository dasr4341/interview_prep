/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import CompanyPage from '../../../lib/pages/companies/company-page';
import CompanyFilter from '../../../lib/pages/companies/company-filter-page';

describe('Company starred filteration and verify result set', () => {
  const login = new LoginPage();
  const companyPage = new CompanyPage();
  const companyFilter = new CompanyFilter();
  let companyName: string;

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
    cy.waitForNetworkIdle(2000)
  });

  it('Go to Companies list', () => {
    companyPage.companiesMenu();
    cy.wait(5000);
    companyPage.pageHeader().should('contain.text', 'Companies');
  });

  it('Starred company filter and verify', () => {
    companyFilter.filterClickForStarredOption()
    cy.waitForNetworkIdle(2000)
    companyFilter.filteredCompanyListExist().then(number => {
      if (number) {
        companyFilter.filteredCompanyName()
          .then(($el) => {
            companyName = $el.text();
            companyFilter.starredCompanyList().then(($elm) => {
              if ($elm.attr('class') == 'w-5 h-5 text-yellow') {
                companyFilter.starredCompanyDetailCheck(companyName)
              }
            });
          });
      } else {
        cy.get('[data-testid="content-frame"] h1').should('contain.text', 'No results')
        companyFilter.clearLink()
        cy.waitForNetworkIdle(2000)
        companyFilter.starIcon().first().click()
        cy.waitForNetworkIdle(2000)
        companyFilter.filterClickForStarredOption()
        cy.waitForNetworkIdle(2000)
        companyFilter.filteredCompanyName()
          .then(($el) => {
            companyName = $el.text();
            companyFilter.starredCompanyDetailCheck(companyName)
          });
      }
    })
  });
});