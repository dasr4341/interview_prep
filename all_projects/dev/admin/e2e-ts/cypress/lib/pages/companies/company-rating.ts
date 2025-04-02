import CompanyPage from '../../../lib/pages/companies/company-page';
import * as _ from 'lodash';

class CompanyRating {
  emotions = null;

  companies = new CompanyPage();

  ratingPageHeading() {
    return cy.get('[data-test-id="page-title"]');
  }

  ratingOptionField() {
    return cy.get('[data-testid="content-frame"] h3');
  }

  validationMessage() {
    return cy.get('[data-testid="server-side-login-error"]');
  }

  companyDetailPageCompanyName() {
    return cy.get('[data-testid="content-frame"] a');
  }

  companyDetailPageFloatingButton() {
    return cy.get('body .floating-btn');
  }

  companyRatingMenu() {
    return cy.get('[data-testid="company-rating"]');
  }

  companyDetailPageEmoji() {
    return cy.get('[data-test-id="rating-image"]');
  }

  ratingDetailPageComment() {
    return cy.get('[data-testid="rating_comments"]');
  }
  
  companyDetailRatingText() {
    return cy.get('[data-testid="rating_block"] label');
  }

  firstEvent() {
    return cy.get('[data-test-id="events"]');
  }

  checkCancelRating({ comments }) {
    const options = ['UNHAPPY', 'NEUTRAL', 'HAPPY'];
    this.emotions = options[_.random(0, 2)];
    cy.get(`[data-rating="${this.emotions}"]`).click();
    this.companies.addCommentField().type(comments);
    cy.contains('Cancel').click();
  }

  submitRating({ comments }) {
    cy.log(this.emotions);
    this.companyDetailPageFloatingButton().click();
    this.companyRatingMenu().click();
    cy.get(`[data-rating="${this.emotions}"]`).click();
      this.companies.addCommentField().type(comments);
      cy.contains('Submit').click();
      this.companies.alert().should('contain.text', 'Added company rating successfully');
  }

  checkSubmittedRatingData() {
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="rating-image"]').then(($el) => {
      const ratingText = $el.attr('data-rating');
      expect(ratingText).to.equal(this.emotions);
    });
  }

  checkSubmittedRatingFromRatingDetails({ comments }) {
    cy.waitForNetworkIdle(3000);
    cy.get('[data-testid="card"] img').then(($el) => {
      const ratingText = $el.attr('alt');
      expect(ratingText).to.equal(this.emotions);
    });
    cy.get('[data-testid="rating_comments"]').should('have.text', comments);
  } 
}

export default CompanyRating;
