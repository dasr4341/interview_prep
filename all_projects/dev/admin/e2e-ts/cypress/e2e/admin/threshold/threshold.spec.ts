import LoginPage from '../../../lib/pages/login/login';
import ThresholdPage from '../../../lib/pages/threshold/threshold';
import DefaultPage from '../../../lib/pages/default-page';

describe('Threshold page flow', () => {
  const login = new LoginPage();
  const thresholdPage = new ThresholdPage();
  const defaultPage = new DefaultPage();

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

  it('Go to threshold page', () => {
    cy.visit('/settings/admin/threshold');
    cy.waitForNetworkIdle(1000);
    defaultPage.pageTitle().should('contain.text','Thresholds');
    cy.waitForNetworkIdle(3000);
  });

  it('Select threshold items and changes values', () => {
    thresholdPage.selectFirstThresholdItem();
    thresholdPage.checkFieldValue();
    cy.waitForNetworkIdle(1000);
  });

  it('Again change threshold items value and check', () => {
    thresholdPage.changeSelectedValue();
    thresholdPage.secondCheckFieldValue();
  });

  it('Again change threshold items value and check',()=>{
    thresholdPage.changeSelectedValue();
    thresholdPage.secondCheckFieldValue();
  });
});
