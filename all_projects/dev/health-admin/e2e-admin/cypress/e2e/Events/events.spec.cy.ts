/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import event from '../../page/events/event-list';
import login from '../../page/login';
import specInit from '../../lib/spec.init';
import note from '../../page/notes/note-list';
import logout from '../../page/logout';

const userTypeArray = [
  // 'supporter',
  'patient',
  'facilityUser',
];

userTypeArray.forEach((userType) => {
  describe('Events Page Functionalities', () => {
    const loginPage = new login();
    const eventList = new event();
    const noteList = new note();
    const logoutPage = new logout();

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
        } else {
          cy.contains('No events yet');
        }
      });
    });

    it('Event Search', () => {
      eventList.existingEventSearch();
      eventList.nonExistingEventSearch();
    });

    it('Event Filter', () => {
      eventList.filterEventsByType();
    });

    it.skip('Creating Notes from Events Page', () => {
    
          let testEventNotes = eventList.checkNoteCreate(userType,0);
          if (testEventNotes === true) {
            eventList.eventPopover();
            eventList.eventCreateNote();
            noteList.createNote();
            eventList.openFirstEvent();
            noteList.openEventNotes();
            noteList.assertNoteSubject();
            eventList.backToPreviousPage();
            eventList.backToPreviousPage();
          } 
    });

    it.skip('Creating Notes from Events Details floating button', () => {
          let testEventNotes = eventList.checkNoteCreate(userType,0);
          if (testEventNotes === true) {
            eventList.openFirstEvent();
            noteList.noteFloatingButtonClick();
            noteList.createNote();
            noteList.openEventNotes();
            noteList.assertNoteSubject();
            eventList.backToPreviousPage();
            eventList.backToPreviousPage();
          } 
        });
      

    it('Mark as Read/Unread functionality', () => {
      eventList.toggleReadUnread();
      eventList.toggleReadUnread();
    });

    it('Snooze event for random time', () => {
      eventList.eventPopover();
      eventList.eventSnoozeOption();
    });

    it(`Signing out from user : ${userType}`, () => {
      logoutPage.logout();
    });
  });
});
