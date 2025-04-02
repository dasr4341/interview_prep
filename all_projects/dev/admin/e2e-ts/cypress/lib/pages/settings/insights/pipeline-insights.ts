export default class PipelinePage {
  memberName() {
    cy.get('[data-test-id="pipeline-insight"] [data-test-id="team_name"]').first().as('teamNames');
    cy.waitForNetworkIdle(4000);
    cy.get('[data-test-id="pipeline-insight"] [data-test-id="direct-report"]').should('contains.text', 'Direct Report');
  }
  
  clickTeamGoDetails() {
    cy.waitForNetworkIdle(4000);
    cy.get('[data-test-id="team-details-arrow"] a').first().click();
  }

  verifyTeamName({ teamName }) {
    cy.waitForNetworkIdle(4000);
    cy.get('[data-testid="page-back-button"] span').should('contain.text','Back')
    cy.get('[data-test-id="page-title"]').then(($teamNameVerify) => {
      const teamNameMatch = $teamNameVerify.text();
      console.log({ teamNameMatch, teamName });
      expect(teamNameMatch).to.equal(teamName);
    });
  }
  countsTeamMembersSection() {
    cy.get('[data-test-id="team-members-wrap"]')
      .then((el) => el.length)
      .as('countTeam');
  }
}
