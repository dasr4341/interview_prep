/// <reference types="cypress" />

export default class ThresholdPage {
  selectors = {
    scheduleTimeRow: () => cy.get('[data-test-id="threshold-wrap"] .basic-single'),
    submitBtn: () => cy.contains('Save'),
  };

  selectFirstThresholdItem() {
    this.selectors.scheduleTimeRow().eq(0).click();
    cy.get('.react-select__menu').contains('14 days').click();
    cy.wait(3000);
    this.selectors.scheduleTimeRow().eq(1).click();
    cy.get('.react-select__menu').contains('Months').click();
    this.selectors.submitBtn().click();
  }

  checkFieldValue() {
    this.selectors.scheduleTimeRow().eq(0).should('contain.text', '14 day');
    this.selectors.scheduleTimeRow().eq(1).should('contain.text', 'Months');
  }

  changeSelectedValue() {
    this.selectors.scheduleTimeRow().eq(0).click();
    cy.get('.react-select__menu').contains('90 days').click();
    cy.wait(3000);
    this.selectors.scheduleTimeRow().eq(1).click();
    cy.get('.react-select__menu').contains('Weeks').click();
    this.selectors.submitBtn().click();
  }

  secondCheckFieldValue() {
    this.selectors.scheduleTimeRow().eq(0).should('contain.text', '90 days');
    this.selectors.scheduleTimeRow().eq(1).should('contain.text', 'Weeks');
  }
}
