/// <reference types="cypress" />

import DefaultPage from '../../../lib/pages/default-page';
import loginPage from '../../../lib/pages/login/login';
import insightPage from '../../../lib/pages/settings/insights/my-insights';

describe('Team Insight page Flow', () => {
  const login = new loginPage();
  const insight = new insightPage();
  const defaultPage = new DefaultPage();
  let title = null;

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

  it(' Go Team Insight Page', () => {
    cy.visit('/dashboard/team');
    cy.waitForNetworkIdle(3000);
    defaultPage.pageTitle().should('contains.text', 'Team Insights');
  });

  it('Go Team Details Page And verify Team Member Title', () => {
    cy.waitForNetworkIdle(3000);
    insight.getMemberName();
    cy.get('@memberName').then((el) => {
      title = el.text();
      cy.log(title);
      insight.verifyTeamMemberName({ title });
    });
  });

  it('Check Team members Section exist', () => {
    insight.teamMembersSection();
    cy.get('@teamMembersCount').then((count) => {
      if (count) {
        cy.log('count');
        cy.get('[data-test-id="team-members-wrap"]');
      }
    });
  });
});
