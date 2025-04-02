/// <reference types="cypress" />

import DefaultPage from '../../default-page';

export default class NotificationPage {
  defaultPage: DefaultPage;

  constructor() {
    this.defaultPage = new DefaultPage();
  }

  selectors = {
    scheduleTimeRow: () => cy.get('[data-test-id="schedule"]'),
    pauseEl: () => cy.get('[data-test-id="toggle-label-pause"]'),
    submitBtn: () => cy.contains('Save'),
  };

  toggleNotificationSettings() {
    cy.waitForNetworkIdle(4000);
    this.selectors.pauseEl().click();
    this.selectors.submitBtn().click();
    cy.waitForNetworkIdle(1000);
    cy.reload();
    cy.waitForNetworkIdle(1000);
  }
  toggleNotificationsEnable() {
    cy.waitForNetworkIdle(4000);
    this.selectors.pauseEl().click();
  }
  deleteScheduleItem(){
  cy.get('[data-test-id="remove-buttons"] svg').last().click();
  }
  

  addSchedule() {
    cy.get('[data-test-id="addschedule"]').click();
      cy.waitForNetworkIdle(1000);
      cy.get('[data-test-id="addschedule"]').click();
      
  }

  
}
