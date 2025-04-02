/// <reference types="cypress"/>

import LoginPage from '../../../lib/pages/login/login';
import companyInsightsPage from '../../../lib/pages/settings/insights/company-insights';
import DefaultPage from '../../../lib/pages/default-page';

describe('Company Insights Page Flow', () => {
  const login = new LoginPage();
  const companyInsightPage = new companyInsightsPage();
  const defaultPage = new DefaultPage();
  let eventNumber = null;
  let optionTitle = null;

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

  it('Go Company Insight Page', () => {
    cy.waitForNetworkIdle(3000);
    cy.visit('/dashboard/company');
    cy.waitForNetworkIdle(3000);
    defaultPage.pageTitle().should('contains.text', 'Company Insights');
  });
  it('Click on  Drop Down and Verify Event Number', () => {
    cy.waitForNetworkIdle(3000);
    companyInsightPage.GetCompanyInsightNumberEvents();
    cy.get('@companyInsightEventNumber').then((el) => {
      eventNumber = el.text();
      cy.log(eventNumber);
      companyInsightPage.verifyCompanyInsightEventNumber({ eventNumber });
    });
  });

  it('Click and Get Option Title For Verify',()=>{

    companyInsightPage.clickGetOptionTitle();
    cy.get('@optionWeek').then((el) => {
      optionTitle = el.text();
      cy.log(optionTitle);
      companyInsightPage.clickViewEventsVerifyOptionTitle({optionTitle})
    });

  });
});
