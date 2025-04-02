/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import LoginPage from '../../../lib/pages/login/login';
import EventsPage from '../../../lib/pages/events/events-page';
import CompanyRating from '../../../lib/pages/companies/company-rating';
import * as faker from 'faker';

describe('Company rating from event details', () => {
  const login = new LoginPage();
  const eventPage = new EventsPage();
  const companyRating = new CompanyRating();
  let companyName = null;
  const comments = 'CY - ' + faker.lorem.paragraph(1);

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

  it('Go to event details page', () => {
    eventPage.eventsListExist(); 
    cy.get('@eventCount').then((count) => {
      if (count) {
        eventPage.firstEvent().click();
        cy.waitForNetworkIdle(3000);
        eventPage.page.pageTitle().should('have.text', 'Event Details');
      }
    })
  });

  it('Click on company rating button', () => {
    cy.waitForNetworkIdle(4000);
    eventPage.eventCompanyName();
    cy.get('@companyName').then(c => companyName = c);
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
    eventPage.page.pageTitle().should('have.text', 'Event Details');
    cy.waitForNetworkIdle(3000);
    companyRating.submitRating({ comments });
    cy.waitForNetworkIdle(3000);
  });

  it('Checking rating after submit the form', () => {
    eventPage.page.pageTitle().should('have.text', 'Event Details');
    cy.get('[data-test-id="company-name"]').should('contain.text', companyName);
    companyRating.checkSubmittedRatingData();
  });

  it('Checking rating details', () => {
    cy.get('[data-test-id="rating-image"]').click();
    cy.get('[data-test-id="page-title"]').should('have.text', 'Rating Detail');
    companyRating.checkSubmittedRatingFromRatingDetails({comments });
  });

})
