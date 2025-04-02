/// <reference types="cypress" />
import * as _ from 'lodash';
import Toast from '../../components/toastify';

class UseCasePage {
  toast = null;

  constructor() {
    this.toast = new Toast()
  }

  routes = {
    list: () => {
      cy.visit('/settings/admin/use-cases');
      cy.waitForNetworkIdle(1000);
      cy.url().should('include', '/use-cases');
    },
    
  };

  selectors =  {
    nameField : () => cy.get('[data-test-id="use-case-name-field"]'),
    submit: () => cy.get('button[type="submit"]'),
    listItem: () => cy.get('[data-test-id="useCase_item"]')
  }

  editUseCase(useCaseName: string) {
    cy.contains(useCaseName).parent().find('button').click();
    cy.contains('Edit').click();
    cy.waitForNetworkIdle(3000);
    cy.get('input[type="checkbox"]').eq(_.random(1, 15)).click();
    this.selectors.submit().click();
    this.toast.selectors.success().should('contain.text', 'Use case collection updated');
    cy.waitForNetworkIdle(1000);
  }

  deleteUseCase(UseCaseName) {
    cy.contains(UseCaseName).parent().find('button').click();
    cy.contains('Delete').click();
    cy.get('[data-popup="modal"] .modal').should('contain.text', 'Did you want to delete this use case?');
    cy.contains('Delete').click();
    this.toast.selectors.success().should('contain.text', 'Use case deleted successfully');
  }
}

export default UseCasePage;
