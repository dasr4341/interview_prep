/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import * as faker from 'faker';
import GroupsPage from "../../../lib/pages/groups/groups-page";

describe('Group name search flow check', () => {
  const login = new LoginPage();
  const settingsPage = new SettingsPage();
  const groupsPage = new GroupsPage();
  const invalidDataSearch = 'test search ' + faker.lorem.words();

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

  it('Go to groups list', () => {
    settingsPage.clickSettingsMenu();
    settingsPage.clickAdminMenu();
    settingsPage.clickGroupsMenu();
    cy.url().should('include', '/admin/user-groups');
    settingsPage.headerText().should('contain.text', 'Group Management');
  })

  it('Search group by valid group name and invalid data', () => {
    cy.waitForNetworkIdle(3000);
    cy.get('body').then(($elm) => {
      if ($elm.has('[test-data-id="group_list"]').length) {
        groupsPage.fillSearchField(invalidDataSearch);
        groupsPage.noDataFoundText().should('contain.text', 'No results');
        groupsPage.searchField().clear();
        cy.waitForNetworkIdle(3000);
        groupsPage.firstgroupName()
          .then(($el) => {
            const groupName = $el.text();
            cy.log(groupName);
            groupsPage.fillSearchField(groupName);
            cy.waitForNetworkIdle(3000);
            groupsPage.firstgroupName().should('contain.text', groupName);
          });
        cy.log('searched group found');
      } else {
        cy.log('No group found.');
      }
    });
  });
});