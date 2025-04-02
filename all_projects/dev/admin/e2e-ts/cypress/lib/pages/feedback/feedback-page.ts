/// <reference types="cypress" />

class FeedbackPage {
    fillComment(value) {
      cy.get('[data-test-id="feedback-comment"]')
        .clear()
        .type(value);
    }
  
    feedBackMenu() {
      cy.get('[data-testid="feedback-link"]')
        .click();
    }
  
    feedbackTitle() {
      return cy.get('[data-test-id="page-title"]');
    }
  
    save() {
      cy.get('[data-testid="save-btn"]')
        .click();
    }
  
    feedbackRating(ratingIndex) {
      return cy.get('[data-test-id="star-rating"] button').eq(ratingIndex);
    }
  
    thankYouText() {
      return cy.get('[data-test-id="modal-title"]');
    }
  
    modalText() {
      return cy.get('.modal p');
    }
  
    closeModal() {
      cy.get('[data-test-id="close-modal"]')
        .click();
    }
  
    validationAlert() {
      return cy.get('[data-testid="feedback-rating-error"]');
    }
  }
  
  export default FeedbackPage;
  