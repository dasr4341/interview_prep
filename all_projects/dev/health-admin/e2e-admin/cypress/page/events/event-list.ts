/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import submitButton from 'components/submit-button';
import alertMessage from 'components/toast-msg';
import noDataFoundTextAssert from 'components/no-result-assert';
import searchData from 'components/search-input';
import { filter } from 'cypress/types/bluebird';
export default class Event {
  locators = {
    eventRow: '[data-testid="event-row"]',
    eventPopOver: '[data-test-id="pop-over-trigger-el"]',
    eventDesc: '[data-testid="event-desc"]',
    eventHeading:'[data-test-id="event-heading"]',
    searchInput: '[type="text"]',
    noteOptionInPopupModal: '[data-testid="note-popover-element"]',
    filterIcon: '[alt="filter"]',
    eventDetailsBackButton: '[data-testid="page-back-button"]',
    filterOption: '[data-testid="eventFilterOption"]',
  };

  eventFilters = [
    'ALERT',
    'COMPLETED ASSESSMENT',
    'REPORT',
    'CONTACTED HELPLINE',
    'FENCE',
  ];

  existingEventSearch() {
    cy.get(this.locators.eventDesc)
      .its('length')
      .then((eventCount) => {
        const randomEvent = Math.floor(Math.random() * eventCount);
        const selectedEvent = cy.get(this.locators.eventDesc).eq(randomEvent);
        selectedEvent.then((el) => {
          const eventContent = el.text();
          let event = eventContent.split(' ').slice(0, 2).join(' ');
          searchData(event);
          cy.waitForNetworkIdle(3000);
          cy.get(this.locators.eventRow).each(($eventDesc) => {
            cy.wrap($eventDesc).contains(event);
          });
        });
      });
  }

  nonExistingEventSearch() {
    cy.get(this.locators.searchInput).click().clear();
    searchData(faker.lorem.words());
    cy.contains('No results');
    cy.get(this.locators.searchInput).click().clear();
  }

  filterEventsByType() {
    cy.get(this.locators.filterIcon).click();
    this.eventFilters.forEach((filterType) => {
      cy.get(this.locators.filterOption).each((filterOption) => {
        if (filterOption.text().toUpperCase() === filterType) {
          cy.wrap(filterOption.children('[type="checkbox"]')).check();
          submitButton();
          cy.waitForNetworkIdle(5000);
          cy.get('body').then(($element) => {
            if ($element.has(this.locators.eventRow).length) {
              cy.get(this.locators.eventRow)
                .find('h3')
                .each(($eventType) => {
                  expect($eventType.text()).to.equal(filterType);
                });
            } else {
              noDataFoundTextAssert(
                'No results',
                'Refine your search and try again'
              );
            }
            cy.contains('Clear all').click();
            cy.waitForNetworkIdle(5000);
          });
          filterType === 'FENCE'
            ? ''
            : cy.get(this.locators.filterIcon).click();
        }
      });
    });
  }

  openFirstEvent() {
    const firstEventDesc = cy.get(this.locators.eventHeading).first();
    firstEventDesc.then((FirstEventContent) => {
      cy.get(this.locators.eventHeading).first().click();
      cy.waitForNetworkIdle(10000);
      cy.contains(FirstEventContent.text());
    });
  }

  backToPreviousPage() {
    cy.get(this.locators.eventDetailsBackButton).click();
  }

  checkNoteCreate(userType:string,counter:number){
    let testEventNotes=false;
    cy.get(this.locators.eventRow)
    .eq(counter)
    .then((eventType) => {
      if (userType === 'patient') {
        cy.wrap(eventType).contains('ASSESSMENT') ||
        cy.wrap(eventType).contains('COMPLETED ASSESSMENT')
          ? (testEventNotes = false)
          : (testEventNotes = true);
      } else if (userType === 'facilityUser') {
        cy.wrap(eventType).contains('COMPLETED ASSESSMENT') ||
        (cy.wrap(eventType).contains('ALERT') &&
          cy.wrap(eventType).contains('Assessment'))
          ? (testEventNotes = false)
          : (testEventNotes = true);
      }
      if(testEventNotes===false){
        this.checkNoteCreate(userType,counter++)
      }
    })
            
          return testEventNotes
  }

  toggleReadUnread() {
    const readStatusArray = ['read', 'unread'];
    cy.get(this.locators.eventRow)
      .first()
      .then((event) => {
        this.eventPopover();
        for (let index = 0; index < readStatusArray.length; index++) {
          if (event.attr('cy-event-status') === readStatusArray[index]) {
            cy.get('[data-testid="read-unread-popover"]').click();
            alertMessage(
              `Marked ${
                index === 1
                  ? readStatusArray[index - 1]
                  : readStatusArray[index + 1]
              } successfully`
            );
          }
        }
        cy.waitForNetworkIdle(1000);
        cy.get('[role="alert"]').click();
      });
  }

  eventPopover() {
    cy.get(this.locators.eventPopOver).first().click();
  }
  eventCreateNote() {
    cy.get(this.locators.noteOptionInPopupModal).click();
  }

  eventSnoozeOption() {
    cy.get(".snooze-timing-list [data-testid='snoozeOption']").then(($btn) => {
      //store the text
      const reminderTime = $btn
        .find("[data-testid='snoozeOption']")
        .get().length;
      cy.wrap($btn)
        .get("[data-testid='snoozeOption']")
        .eq(Math.floor(Math.random() * reminderTime) + 2)
        .click();
      alertMessage('Reminder set successfully');
    });
  }
}
