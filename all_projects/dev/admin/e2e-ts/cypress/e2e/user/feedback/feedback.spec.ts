/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import FeedbackPage from '../../../lib/pages/feedback/feedback-page';
import * as faker from 'faker';

// Todo: Failed randomly need to fix
describe('Feedback fields validation check and flow check', () => {
  const login = new LoginPage();
  const feedbackPage = new FeedbackPage();

  before(() => {
    cy.clearLocalStorageSnapshot()
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

  it('Click on feedback menu from sidebar', () => {
    feedbackPage.feedBackMenu();
    feedbackPage.feedbackTitle()
      .should('contain.text', 'Feedback');
  });

  it('Feedback form submit without data', () => {
    feedbackPage.save();
    cy.waitForNetworkIdle(1000);
    feedbackPage.validationAlert().should('contain.text', 'Feedback value is a required field');
  });

  it('Feedback submit', () => {
    const randomRating = Math.floor(Math.random() * 5);
    feedbackPage.feedbackRating(randomRating).click();
    feedbackPage.fillComment('CY-' + faker.lorem.paragraphs());
    feedbackPage.save();
    feedbackPage.thankYouText().should('contain.text', 'Thank you!');
    feedbackPage.modalText().should('contain.text', 'By making your voice heard, you help us improve Pretaa.');
    feedbackPage.closeModal();
  });
});