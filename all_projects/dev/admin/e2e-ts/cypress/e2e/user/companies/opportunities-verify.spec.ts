/// <reference types="cypress" />
import LoginPage from '../../../lib/pages/login/login';
import OpportunitiesPage from '../../../lib/pages/companies/opportunities/opportunities-verify';

describe('Opportunity page verification from company detail', () => {
  const login = new LoginPage();
  const opportunities = new OpportunitiesPage();
  let companyName = null;

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

  it('Go to Companies list', () => {
    opportunities.companiesMenu();
    cy.wait(3000);
    opportunities.pageHeader().should('contain.text', 'Companies');
  });

  it('Go to first company detail page', () => {
    opportunities.companyName();
    cy.get('@companyCount').then((count) => {
      if(count) {
        opportunities.firstCompanyName().click();
        cy.wait(4000);
        opportunities.companyNameInDetailPage().then(el => companyName = el.text());
      }
    });
  });

  it('Verify opportunities listing and detail page', () => {
    cy.get('[data-test-id="opportunities-link"]').click();
    cy.wait(2000);
    opportunities.opportunitiesHeader();
    cy.get('@opportunityCount').then((count) => {
      if(count) {
        cy.get('[data-test-id="opportunity-name"]').first().click();
        cy.waitForNetworkIdle(2000);
        opportunities.pageTitle().should('contain.text', 'Opportunity Detail');
        opportunities.companyLink().should('contain.text', companyName);
      } else {
        cy.log('No opportunities exist');
      }
    })
  });

  it('Verify opportunity label on detail page', () => {
    opportunities.opportunityLabel();
    cy.get('@opportunityLabelCount').then((count) => {
      if (count) {
        opportunities.opportunityLabelCheck()
      }
    });
  });
});