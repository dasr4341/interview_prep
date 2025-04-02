import LoginPage from '../../../lib/pages/login/login';
import CompanyTimelineVerifyPage from '../../../lib/pages/companies/company-timeline-verify';

describe('Event Company timeline verify page flow', () => {
  const login = new LoginPage();
  const CompanyTimelinePage = new CompanyTimelineVerifyPage();

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
  it('Timeline verify from Event', () => {
    cy.waitForNetworkIdle(3000);
    CompanyTimelinePage.firstEventClick();
    CompanyTimelinePage.verifyTimelineFromEventDetails();
  });
});