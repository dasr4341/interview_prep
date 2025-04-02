/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../page/login";
import feedback from "../../page/feedback";
import specInit from "lib/spec.init";
import submitButton from "components/submit-button";

describe('Feedback', () => {
  const loginPage = new login();
  const feedbackPage = new feedback();

  specInit();

  it('Login and go to Events page', () => {
    loginPage.login();
  })

  it('Go to feedback page and give feedback', () => {
    feedbackPage.navFeedbackMenu();
    feedbackPage.selectRating();
    cy.waitForNetworkIdle(1000);
    feedbackPage.addComments();
    submitButton();
    feedbackPage.thankYouModal();
  })

  it('Without value validation check on feedback page', () => {
    submitButton();
    feedbackPage.errorMessage();
  })

  it('Only rating given on the feedback page', () => {
    feedbackPage.selectRating();
    submitButton();
    feedbackPage.errorMessage();
  })

  it('Only comment given on the feedback page', () => {
    cy.reload();
    feedbackPage.addComments();
    submitButton();
    feedbackPage.errorMessage();
  })

})