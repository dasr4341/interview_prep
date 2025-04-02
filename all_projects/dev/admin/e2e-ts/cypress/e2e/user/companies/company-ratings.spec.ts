/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import CompanyPage from '../../../lib/pages/companies/company-page';
import CompanyRating from '../../../lib/pages/companies/company-rating';
import * as faker from "faker";

// Failed randomly 
describe('Company rating test from Company details page', () => {
  const login = new LoginPage();
  const companyRating = new CompanyRating();
  const companyPage = new CompanyPage();
  const comments = 'CY - ' + faker.lorem.paragraph(1);
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
  });

  it('Go to first company details', () => {
    cy.contains('Companies').click();
    companyPage.firstCompanyName()
      .then(($el) => {
        companyName = $el.text();
        companyPage.firstCompanyName().click();
        cy.log(companyName);
        cy.waitForNetworkIdle(3000);
        companyRating.companyDetailPageCompanyName().should('contain.text', companyName);
      });
    companyPage.pageHeader().should(
      "contain.text",
      "Details"
    );
  });

  it('Click on company rating button', () => {
    companyRating.companyDetailPageFloatingButton().click();
    companyRating.companyRatingMenu().click();
    cy.waitForNetworkIdle(5000);
  });

  it('Validation check on company rating page', () => {
    companyRating.ratingPageHeading().should(
      "contain.text",
      "New Rating"
    );
    companyRating.ratingOptionField().should(
      "contain.text",
      "How does the company feel about us?"
    );
    cy.contains('Submit').click();
    companyRating.validationMessage().should(
      "contain.text",
      "Select rating option"
    );
    companyRating.validationMessage().should(
      "contain.text",
      "Comment requires at least 25 characters"
    );
  });

  it('Fill up rating form', () => {
    companyRating.checkCancelRating({comments})
    companyPage.pageTitle().should('have.text', 'Details');
    cy.waitForNetworkIdle(3000);
    companyRating.submitRating({ comments });
    cy.waitForNetworkIdle(3000);
  });

  it('Checking rating after submit the form', () => {
    companyPage.pageTitle().should('have.text', 'Details');
    cy.get('[data-test-id="company-list-link"]').should('contain.text', companyName);
    companyRating.checkSubmittedRatingData();
  });

  it('Checking rating details', () => {
    cy.get('[data-test-id="rating-image"]').click();
    cy.get('[data-test-id="page-title"]').should('have.text', 'Rating Detail');
    companyRating.checkSubmittedRatingFromRatingDetails({comments });
  });
});
