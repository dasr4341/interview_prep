export default class companyInsightsPage {
  GetCompanyInsightNumberEvents() {
    cy.get('.basic-single').first().click();
    cy.contains('All').click();
    cy.waitForNetworkIdle(4000);
    cy.get('[data-test-id="company-insights-numbers"]').eq(0).as('companyInsightEventNumber');
  }

  verifyCompanyInsightEventNumber({ eventNumber }) {
    cy.get('.basic-single').eq(0).click();
    cy.contains('1 Week').click();
    cy.get('[data-test-id="company-insights-numbers"]')
      .eq(0)
      .then(($companyInsightNumber) => {
        const companyInsightNumbers = $companyInsightNumber.text();
        console.log({ companyInsightNumbers, eventNumber });
        expect(companyInsightNumbers).not.to.equal(eventNumber);
      });
  }

  clickGetOptionTitle(){
    cy.get('.basic-single').eq(0);
    cy.waitForNetworkIdle(4000);
    cy.get(' .basic-single .css-gz8eam-SingleValue').contains('1 Week').as('optionWeek');
  }
  clickViewEventsVerifyOptionTitle({ optionTitle }) {
    cy.get('[data-test-id="view-events"]').click();
    cy.waitForNetworkIdle(4000);
    cy.get('[data-testid="tag-badge"]').then(($tagTitle) => {
      const tagTitle = $tagTitle.text();
      console.log({ tagTitle, optionTitle });
      expect(tagTitle).to.equal(optionTitle);
    });
  }
}
