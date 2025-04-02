/// <reference types="cypress"/>

import LoginPage from '../../../lib/pages/login/login';
import PipelinePage from '../../../lib/pages/settings/insights/pipeline-insights';
import Default from '../../../lib/pages/default-page';

describe('Pipeline Insights Page Flow', () => {
  const login = new LoginPage();
  const pipelinePage = new PipelinePage();
  const defaultPage = new Default();
  let teamName = null;

  before(() => {
    cy.clearLocalStorageSnapshot();
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

  it('Go pipeline page', () => {
    cy.visit('/dashboard/pipeline');
    cy.waitForNetworkIdle(4000);
    defaultPage.pageTitle().should('contains.text', 'Pipeline Insights');
  });

  it('Go your team section and verify title in details page ', () => {
    cy.waitForNetworkIdle(3000); 
    pipelinePage.memberName();
    cy.get('@teamNames').then((el) => {
      teamName = el.text();
      cy.log(teamName);
      pipelinePage.clickTeamGoDetails();
      pipelinePage.verifyTeamName({ teamName });
    });
  });
  
  it('count team members existence', () => {
    pipelinePage.countsTeamMembersSection();
    cy.get('@countTeam').then((count) => {
      if (count) {
        cy.get('[data-test-id="team-members-wrap"]');
      }
    });
  });
});
