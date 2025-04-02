import * as _ from 'lodash';

export default class LaunchPage {
  selectLaunch(){
    cy.get('[data-testid="launch"]').click();
  }

  /**
   * Use "selectedTemplate" alias for get template name
   * cy.get('@selectedTemplate')
   */
  selectingATemplate() {
    cy.get('[data-test-id="select-template"]').click();
    const option = cy.get('[data-test-item="option-item"]').eq(_.random(0, 5)).click();
    option.then(el => el.text()).as('selectedTemplate');
    cy.get('form .pt-2 button[type="submit"]').should('have.text', 'Create New Message').click();
    cy.waitForNetworkIdle(1000);
  }

  setEmailAndUsers(){
    const customEmail = Cypress.env("automation_email_password").split(":")[0];
    cy.get('form div:first()').find('input[type="text"]').clear().type(customEmail)
    localStorage.setItem('customEmail', customEmail);

    cy.get('[data-testid="content-frame"]').then(($el) => {
      if ($el.find('[data-testid="tag-badge"]').length) {
        cy.get('[data-testid="tag-badge"]').each(($els, index) => {
          localStorage.setItem(`user-name-${index + 1}`, $els.text())
        });
      }
    })
    
  }

  previewTheEvent(){
    cy.get('[data-testid="preview-btn"]').click();
    cy.get('[data-test-id="email-input"]').should('have.value', localStorage.getItem('customEmail'));
  }

  launch(){
    cy.get('[data-testid="launch-btn"]').click();
  }

  seeTheLaunchedEvent(){
    cy.get('[data-test-id="page-title"]').should('have.text', 'Launch Detail');
    cy.get('[data-test-id="mailing-name"]').contains(localStorage.getItem('customEmail'));
  }
  
}
