import SettingsPage from '../../../pages/settings/settings-page';
import CompanyPage from '../company-page';
class ContactPage extends CompanyPage {
  settingsPage: SettingsPage;

  constructor() {
    super();
    this.settingsPage = new SettingsPage();
  }

  primaryContactHeader() {
    return cy.get('[data-test-id="primary_contact_header"] span');
  }

  primaryContactInList() {
    return '[data-test-id="primary_contact"]';
  }

  selectContact() {
    return new Cypress.Promise((resolve) => {
      cy.contains('Companies').click();
      this.settingsPage.headerText().should('contain.text', 'Companies');
      this.firstCompanyName().then(($title) => {
        const title = $title.text()
        this.firstCompanyName().click();
        cy.waitForNetworkIdle(1000);
        cy.contains('Contacts').click();
        resolve({ title });
      });
    });

  }

  clickContactVerifyTitle({ title }) {
    cy.waitForNetworkIdle(1000);
    cy.get(this.primaryContactInList()).first().click();
    cy.waitForNetworkIdle(2000);
    cy.get('[data-testid="content-frame"] a').first().then(($companyName) => {
      const companyName = $companyName.text()
      console.log({ companyName, title })
      expect(companyName).to.equal(title);
    })
  }

  contactExits() {
    return new Cypress.Promise((res) => {
      cy.get('body').then(($elm) => {
        cy.waitForNetworkIdle(1000);
        if ($elm.has(this.primaryContactInList()).length) {
          cy.wait(20000);
          cy.log('Data found');
        } else {
          cy.log('No data found.');
        }
        res();
      });
    });
  }
}

export default ContactPage;