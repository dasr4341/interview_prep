import SettingsPage from '../../settings/settings-page';
import CompanyPage from '../company-page';
class OpportunitiesPage extends CompanyPage {
  settingsPage = new SettingsPage();

  opportunityLabel() {
    cy.get('[data-test-id="opt-label"]').then(el => el.length).as('opportunityLabelCount');
  }

  opportunityLabelCheck() {
    cy.get('[data-test-id="opt-label"]').then(el => {
      const labelText = el.text();
      cy.log(' open button exist:', labelText);
      if (labelText == 'Open') {
        cy.log('Label Open')
      }
      else if (labelText == 'Closed - Lost') {
        cy.log('Label Closed - Lost');
      } 
      else if (labelText == 'Closed - Won') {
        cy.log('Label Closed - Won');
      }
      else {
        cy.log('Label Open - Won');
      }
    });
  }

  headerText() {
    return cy.get('body h1');
  }

  opportunitiesHeader() {
    cy.get('[data-test-id="opportunity-name"]').then(el => el.length).as('opportunityCount');
  }

  companyLink() {
    return cy.get('[data-test-id="company-link"]');
  }
}
export default OpportunitiesPage;