/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

 import {faker} from "@faker-js/faker";
import pageTitleAssert from "components/page-title";


export default class feedback {
  navFeedbackMenu() {
    cy.get('[data-testid="feedback"]').click();
    pageTitleAssert('Feedback');
    cy.waitForNetworkIdle(1000);
  }

  selectRating() {
    cy.get('[data-test-id="star-rating"]').then(($btn) => {
      cy.wrap($btn)
        .get('[data-test-id="rating-inactive"]')
        .eq(Cypress._.random(0, 4))
        .click();
    });
  }

  addComments() {
    cy.get('[name="feedback"]').click().type(`CY ${faker.lorem.lines()}`, { delay: 0 });
  }

  thankYouModal() {
    cy.contains('Thank you!');
    cy.get("[data-testid='cross-button']").click();
  }

  errorMessage() {
    cy.contains('This field is required');
  }
}