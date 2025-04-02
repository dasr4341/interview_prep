/// <reference types="cypress" />
import LoginPage from '../../../lib/pages/login/login';
import CompetitorsPage from '../../../lib/pages/companies/competitors/competitors';

describe('Competitors list verify from company detail', () => {
  const login = new LoginPage();
  const competitors = new CompetitorsPage();

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

  it('Competitors from company detail and check competitors exist or not', () => {
    cy.waitForNetworkIdle(3000);
    competitors.selectCompetitor();

    if (competitors.competitorsListExists) {
      cy.get('[data-test-id="competitors"]').should('exist');
      cy.log(' competitors exist');
    } else {
      cy.log('No competitors exist');
    }
  });
});