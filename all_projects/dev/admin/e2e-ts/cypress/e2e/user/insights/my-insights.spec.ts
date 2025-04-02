/// <reference types="cypress" />
import LoginPage from '../../../lib/pages/login/login';
import insightsPage from '../../../lib/pages/settings/my-insights/my-insights';
import DefaultPage from '../../../lib/pages/default-page';

describe('Insight Page Flow', () => {
  const login = new LoginPage();
  const insight = new insightsPage();
  const defaultPage = new DefaultPage();
  let numberInfo = null;

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

  it('Go My Insight Page ', () => {
    cy.visit('/dashboard/me');
    cy.waitForNetworkIdle(3000);
    defaultPage.pageTitle().should('contains.text', 'My Insights');
  });

  it('filter And Check Different Sections And Get Number Inside Insight Page', () => {
    cy.wait(3000);
    insight.filterAndVerifyUsingDropdown();
    insight.verifyNumberInsights();
    cy.get('@numberTitle').then((el) => {
      numberInfo = el.text();
      cy.log(numberInfo);
      cy.waitForNetworkIdle(3000);
      insight.selectWeekOption();
      cy.waitForNetworkIdle(3000);
      insight.VerifyWeeksNumberInsights({ numberInfo });
      
    });
  });
});
