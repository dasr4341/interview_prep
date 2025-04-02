/// <reference types="cypress" />

import event from './event-list';
import login from "auth/login/login-page"
import specInit from 'lib/spec.init';
import logout from 'auth/logout/logout-page';

const userTypeArray = [
  // 'supporter',
  'patient',
  'facilityUser',
];

userTypeArray.forEach((userType) => {
  describe(`Events Page Functionalities for userType: ${userType}`, () => {
    const loginPage = new login();
    const eventList = new event();
    specInit();

    it(`Login with valid credentials as user : ${userType}`, () => {
      loginPage.visitTheLoginPage('/login');
      loginPage.useValidCredential(userType);
    });

    it('Check whether events exist and then move to the first event and check event details', () => {
      cy.get('body').then(($element) => {
        if ($element.has(eventList.locators.eventRow).length) {
          eventList.openFirstEvent();
          eventList.backToPreviousPage();
        }
      });
    });

    it('Event Search', () => {
      cy.visit('/dashboard/events');
      eventList.existingEventSearch();
      eventList.nonExistingEventSearch();
    });

    it('Event Filter', () => {
      cy.visit('/dashboard/events');
      eventList.filterEventsByType();
    });

    it('Mark as Read/Unread functionality', () => {
      cy.visit('/dashboard/events');
      eventList.toggleReadUnread();
      eventList.toggleReadUnread();
    });

    it('Snooze event for random time', () => {
      cy.visit('/dashboard/events');
      eventList.eventPopover();
      eventList.eventSnoozeOption();
    });

  });
});
