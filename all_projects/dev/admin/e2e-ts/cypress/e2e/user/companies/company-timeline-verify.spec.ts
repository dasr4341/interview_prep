import LoginPage from '../../../lib/pages/login/login';
import SettingsPage from '../../../lib/pages/settings/settings-page';
import DefaultPage from '../../../lib/pages/default-page';
import CompanyTimelineVerifyPage from '../../../lib/pages/companies/company-timeline-verify';
import companyPage from '../../../lib/pages/companies/company-page';
interface Response {
  title: string;
}
describe('Company timeline verify page flow', () => {
  const login = new LoginPage();
  const defaultPage = new DefaultPage();
  const CompanyTimelinePage = new CompanyTimelineVerifyPage();
  let title = null;

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

  it('Go Company page section', () => {
    cy.visit('/companies/list?options=%5B%5D');
    cy.waitForNetworkIdle(1000);
    defaultPage.pageTitle().should('contain.text', 'Companies');
  });

  it('Verify Timeline Title and description', () => {
    cy.waitForNetworkIdle(3000);
    CompanyTimelinePage.verifyTimelineFromCompanyDetails();
  });
});
