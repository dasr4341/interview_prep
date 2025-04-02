import * as _ from 'lodash';
import DefaultPage from '../default-page';

class EventsPage {
  page: DefaultPage;

  constructor() {
    this.page = new DefaultPage();
  }
  selectors = {
    events: () => cy.get('[data-test-id="events"]')
  };

  eventExposeMenu() {
    cy.get('[data-test-id="events"] svg').first().click();
  }

  // Desecrated
  alert() {
    return cy.get('.Toastify .Toastify__toast--success');
  }

  firstEvent() {
    return cy.get('[data-test-id="events"]').first();
  }
  firstObject(){
     return cy.get('[data-test-id="data-object-row"]').first();
  }
  hideUnhideOption() {
    cy.get('[data-test-id="hide-show-option"]').click();
  }
 
  firstObject(){
     return cy.get('[data-test-id="data-object-row"]').first();
  }
  

  eventFilterButton() {
    cy.get('[role="event-filter"]').click();;
  }

  hiddenFilterOption() {
    cy.get('[data-testid="option"] [value="HIDDEN"]').click();
  }

  pageHeader() {
    return cy.get('body h1');
  }

  applyButton() {
    return cy.get('.popup-content button');
  }

  eventsListExist() {
   cy.get('[data-test-id="events"]').then(els => els.length).as('eventCount');
  }

  readUnreadOption() {
    cy.get('[data-test-id="read-unread-option"]').click();
  }

  toggleReadUnread() {
    cy.get('[data-test-id="read-unread-option"]').click();
  }

  eventCompanyName() {
    cy.get('[data-test-id="company-name"]').then(el => el.text()).as('companyName');
  }

  filterEventByNotInLaunch() {
    cy.get('[data-test-id="filter-btn"]').click();
    cy.get('[data-testid="option"]').contains('Company Rating').click();
    cy.get('[data-testid="option"]').contains('Product').click();
    cy.get('[data-testid="option"]').contains('Potential Reference').click();
    cy.get('[data-test-id="apply-button"]').click();
    cy.waitForNetworkIdle(3000);
  }

  unreadToRead() {
    cy.get('[data-test-event-status="unread"] button').first().click();
    this.toggleReadUnread();
    this.page.toast.selectors.success().should('contain.text', 'Event successfully marked as read');
  }

  readToUnread() {
    cy.get('[data-test-event-status="read"] button').first().click();
    this.toggleReadUnread();
    this.page.toast.selectors.success().should('contain.text', 'Event successfully marked as unread');
  }

  readUnreadEvent() {
    cy.get('[data-test-id="events"]').then($event => {
      const eventStatus = $event.attr('data-test-event-status');
      if (eventStatus === 'read') {
        this.readToUnread();
      } else {
        this.unreadToRead();
      }
    })
  }
  

  getEventType() {
    return new Cypress.Promise((resolve, reject) => {
      let result = '';
      const index = _.random(0, 10);

      cy.get('[data-test-id="events"]')
        .eq(index)
        .then($el => {
          const type = $el.attr('data-event-type');
          if (type === 'POTENTIAL_REFERENCE') {
            result = 'has indicated';
            cy.log('result data: ', result);
          } else if (type === 'Launch') {
            result = 'emailed';
          } else if (type === 'COMPANY_RATING') {
            result = 'rating';
          } else if (type === 'CONTACT_CHANGE') {
            result = 'change';
          } else if (type === 'ONBOARDING') {
            result = 'An instance for';
          } else if (type === 'PERFORMANCE') {
            result = 'CUSTOMER OUTREACH RECOMMENDED';
          } else if (type === 'PIPELINE') {
            result = 'Sales Stage';
          } else if (type === 'PRODUCT') {
            result = 'reported';
          } else if (type === 'RENEWALS') {
            result = 'renewal';
          } else if (type === 'REVENUE_CHANGE') {
            result = 'customer';
          } else if (type === 'SUPPORT') {
            result = 'support';
          } else {
            result = '';
            reject(result);
          }
          resolve(result);
        });
    });
  }

  getFilterOption() {
    cy.get('[data-test-id="filter-btn"]').click();
    return new Cypress.Promise((resolve) => { 
      const optionEL = cy.get('[data-testid="option"]');
      optionEL.then(els => els.length).as('optionLength');
      cy.get('@optionLength').then(count => {
        let index = _.random(0, Number(count) - 1);
        cy.log(index.toString(), count);
        const $el = cy.get('[data-testid="option"]').eq(index);
        $el.click();
        cy.get('[data-test-id="apply-button"]').click();
        $el.then(el => resolve(el.text()))
      })
    });
  }

  getFilterEvent(eventType) {
    cy.get('body').then(($elm) => {
      if ($elm.has('[data-test-id="events"]').length) {
      cy.get('[data-test-id="events"]').then($el => {
        const et = $el.attr('data-event-type');
        if (et === eventType) {
          return $el;
        }
      });
    }
    });
  }

}

export default EventsPage;
