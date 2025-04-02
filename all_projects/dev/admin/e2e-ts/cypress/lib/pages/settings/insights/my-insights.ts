/// <reference types="cypress" />
export default class insightPage {
  getMemberName() {
    cy.get('[data-test-id="team-name"] label.block').first().as('memberName');
  }

  verifyTeamMemberName({ title }) {
    cy.get('[data-test-id="team-name"] span').should('contains.text', 'Direct Report');
    cy.waitForNetworkIdle(3000);
    cy.get('[data-tes-id="member-name"] a').first().click();
    cy.waitForNetworkIdle(4000);
    cy.get('[data-test-id="team-members-name"] h1.leading-none').then(($teamMemberName) => {
      const teamMembersName = $teamMemberName.text();
      console.log({ teamMembersName, title });
      cy.waitForNetworkIdle(3000);
      expect(teamMembersName).to.equal(title);
    });
  }
  teamMembersSection() {
    cy.get('[data-test-id="team-members-wrap"]')
      .then((el) => el.length)
      .as('teamMembersCount');
  }
}
