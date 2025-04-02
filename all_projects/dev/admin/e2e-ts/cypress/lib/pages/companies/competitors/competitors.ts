import SettingsPage from '../../settings/settings-page';

class CompetitorsPage {
  settingsPage = new SettingsPage();

  selectCompetitor() {
    cy.contains('Companies').click();
    this.settingsPage.headerText().should('contain.text', 'Companies');
    cy.get('[data-test-id="company-list-link"]').first().click();
    cy.get('[data-test-id="Competitors-link"]').click();
    this.settingsPage.headerText().should('contain.text', 'Competitors');
  }

  competitorsListExists() {
    return new Cypress.Promise((res) => {
      cy.get('body').then(($elm) => {
        if ($elm.has('[data-test-id="competitors"]').length) {
          cy.log('Data found');
        } else {
          cy.log('No data found.');
        }
        res();
      });
    });
  }
}

export default CompetitorsPage;