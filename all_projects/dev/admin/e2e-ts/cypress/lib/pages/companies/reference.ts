import * as faker from "faker";
import Toast from '../../components/toastify';
import EventsPage from '../events/events-page';
import DefaultPage from '../default-page';
import { CustomerReference } from "../../interfaces/customer-reference.interface";
import { ProspectReference } from "../../interfaces/prospect-reference.interface";

export default class CreateReferencePage {
  page: DefaultPage;
  toast: Toast;
  eventsPage: EventsPage;

  constructor() {
    this.page = new DefaultPage();
    this.toast = new Toast();
    this.eventsPage = new EventsPage();
  }

  filterCustomers() {
    cy.get('[data-test-id="company-filter"]').click();
    cy.contains('CUSTOMER').click();
    cy.get('button[type="submit"]').should('contain.text', 'Filter').click();
  }

  filterProspects() {
    cy.get('[data-test-id="company-filter"]').click();
    cy.contains('PROSPECTS').click();
    cy.get('button[type="submit"]').should('contain.text', 'Filter').click();
  }

  /**
   * This function can
   * - open popover menu to select 'add reference' option
   * - and go to reference page of the same company.
  */
  goToReference() {
    cy.get('.floating-btn').click();
    cy.get('[data-testid="reference-create"]').click();
    this.page.pageTitle().should('contain.text', 'Reference');
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-id="reference-page-title"]').then(el => el.text()).as('selectCompanyTitle');
  }


  customerRefFillUpForm(randomDesc) {
    const formValuesCF: CustomerReference = {
      offeredTo: "",
      offerOptionsFirstOption: "",
      offerOptionsSecondOption: "",
      servedAsReferenceForId: "",
      servedAsReferenceAt: "",
      dealClosed: "",
      didTheyDoFirstOption: "",
      didTheyDoSecondOption: "",
      firstName: "",
      lastName: "",
      position: "",
      phone: 0,
      email: "",
      notes: ""
    };
    //Did they offer to be a reference?

    cy.get('form').find('#offeredTo').click();
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-id="option-item-YES"]').click().then((value) => {
      formValuesCF.offeredTo = value.text();
      cy.log(formValuesCF.offeredTo);
    });
    //What did they offer to do?
    cy.get('form').find('#offerOptions').click();
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-id="select-row-checkbox"]').eq(0).click().then((value) => {
      formValuesCF.offerOptionsFirstOption = value.text();
      cy.log(formValuesCF.offerOptionsFirstOption);
    });

    cy.get('[data-test-id="select-row-checkbox"]').eq(1).click().then((value) => {
      formValuesCF.offerOptionsSecondOption = value.text();
      cy.log(formValuesCF.offerOptionsSecondOption);
    });
    cy.get('body').click();

    //Have they served as a reference before?
    cy.get('form').find('.toggle-container .toggle-bar').click();
    cy.waitForNetworkIdle(1000);
    //Who did they serve as reference for?
    cy.get('form').find('#servedAsReferenceForId').click();
    cy.waitForNetworkIdle(1000);
    cy.get('[data-test-item="option-item"]').first().click().then((value) => {
      formValuesCF.servedAsReferenceForId = value.text();
      cy.log(formValuesCF.servedAsReferenceForId);
    });
    //When did they serve as a reference?
    cy.get('form').find('#servedAsReferenceAt').click();
    cy.get('.react-datepicker__day--009').click().then((value) => {
      formValuesCF.servedAsReferenceAt = value.val() as string;
      cy.log(formValuesCF.servedAsReferenceAt);
    });
    //Did the deal close?
    cy.get('form').find('#dealClosed').click();
    cy.get('[data-test-item="option-item"]').first().click().then((value) => {
      formValuesCF.dealClosed = value.text();
      cy.log(formValuesCF.dealClosed);
    });
    //What did they do?
    cy.get('form').find('#didTheyDo').click();
    cy.get('[data-test-id="select-row-checkbox"]').eq(0).click().then((value) => {
      formValuesCF.didTheyDoFirstOption = value.text();
      cy.log(formValuesCF.didTheyDoFirstOption);
    });
    cy.get('[data-test-id="select-row-checkbox"]').eq(1).click().then((value) => {
      formValuesCF.didTheyDoSecondOption = value.text();
      cy.log(formValuesCF.didTheyDoSecondOption);
    });
    cy.get('body').click();

    //Person from Reference Company Info
    formValuesCF.firstName = faker.name.firstName();
    cy.get('#firstName').clear().type(formValuesCF.firstName);

    formValuesCF.lastName = faker.name.lastName();
    cy.get('#lastName').clear().type(formValuesCF.lastName);

    formValuesCF.position = faker.commerce.department();
    cy.get('#position').clear().type(formValuesCF.position);

    formValuesCF.phone = faker.datatype.number({
      'min': 1111111111,
      'max': 9999999999
    });
    cy.get('#phone').clear().type(String(formValuesCF.phone));

    formValuesCF.email = faker.internet.email();
    cy.get('#email').clear().type(formValuesCF.email);

    //Additional Messages
    formValuesCF.notes = randomDesc;
    cy.get('[name="notes"]').clear().type(formValuesCF.notes);

    cy.get('[type="submit"]').should('have.text', 'Submit').click();

    return cy.wrap(formValuesCF);

  }


  prospectRefFillUpForm(randomDesc) {
    cy.waitForNetworkIdle(1000);
    const formValues: ProspectReference = {
      offerOptionsFirstOption: "",
      servedAsReferenceAt: "",
      didTheyDoFirstOption: "",
      didTheyDoSecondOption: "",
      firstName: "",
      lastName: "",
      position: "",
      phone: 0,
      email: "",
      notes: ""
    };

    // What Company Served as your reference?
    cy.get('form').find('#servedAsReferenceForId').click();
    cy.get('[data-test-item="option-item"]').eq(0).click().then((value) => {
      formValues.offerOptionsFirstOption = value.text();
      cy.log(formValues.offerOptionsFirstOption);
    });

    // When did they serve as a reference?
    cy.get('form').find('#servedAsReferenceAt').click();
    cy.get('.react-datepicker__day--009').click().then((value) => {
      formValues.servedAsReferenceAt = value.val() as string;
      cy.log(formValues.servedAsReferenceAt);
    });
    cy.get('body').click();
    cy.waitForNetworkIdle(1000);
    // What did they do?
    cy.get('form').find('#didTheyDo').click();
    cy.get('[data-test-id="select-row-checkbox"]').eq(0).click().then((value) => {
      formValues.didTheyDoFirstOption = value.text();
      cy.log(formValues.didTheyDoFirstOption);
    });

    cy.get('[data-test-id="select-row-checkbox"]').eq(1).click().then((value) => {
      formValues.didTheyDoSecondOption = value.text();
      cy.log(formValues.didTheyDoSecondOption);
    });
    cy.get('body').click();

    //Person from Reference Company Info
    formValues.firstName = faker.name.firstName()
    cy.get('#firstName').clear().type(formValues.firstName);

    formValues.lastName = faker.name.lastName()
    cy.get('#lastName').clear().type(formValues.lastName);

    formValues.position = faker.commerce.department()
    cy.get('#position').clear().type(formValues.position);

    formValues.phone = faker.datatype.number({
      'min': 1111111111,
      'max': 9999999999
    });
    cy.get('#phone').clear().type(String(formValues.phone));

    formValues.email = faker.internet.email()
    cy.get('#email').clear().type(formValues.email);

    //Additional Messages
    formValues.notes = randomDesc
    cy.get('[name="notes"]').clear().type(formValues.notes);

    cy.get('[type="submit"]').should('have.text', 'Submit').click();

    return cy.wrap(formValues);

  }

  verifyReference() {
    this.eventsPage.selectors.events().first().then(el => {
      const eventTypeRef = el.attr('data-event-type');
      expect(eventTypeRef).to.eq('POTENTIAL_REFERENCE');
      const eventCreateAt = el.find('[data-test-id="event-created-at"]').text();
      expect(eventCreateAt).to.be.eq('a few seconds ago');
    });
  }

  verifyCreatedReferenceForOpportunity() {
    this.toast.selectors.success().should('contain.text', 'Reference created');
    cy.wait(1000);
    cy.visit('/events');
    cy.waitForNetworkIdle(1000);
    this.verifyReference();
  }

  /**
   * This function
   * - verifies if that companies reference is created
  */
  verifyCreatedReferenceAddedInTheList() {
    cy.get('[data-test-id="page-title"]').should('have.text', 'References');
    this.toast.selectors.success().should('contain.text', 'Reference created');
    cy.get('[data-test-id="reference-add-tagline"]').should('contain.text', 'Reference Added.');
    cy.wait(1000);
    cy.visit('/events');
    cy.waitForNetworkIdle(1000);
    this.verifyReference();
  }

  /**
  * This function can
  * - be used to go to same company's reference details page for the further verifications.
 */
  referenceDetails(selectedCompanyTitle) {
    this.eventsPage.firstEvent().click();
    cy.get('body h1').should('have.text', 'Event Details');
    this.eventsPage.selectors.events().find('.link:nth-child(2)').should('contain.text', selectedCompanyTitle);
  }

  referenceDetailsVerifyCompany(selectedCompanyTitle) {
    this.eventsPage.firstEvent().click();
    this.page.pageTitle().should('have.text', 'Event Details');
    this.eventsPage.selectors.events().find('.link:nth-child(3)').should('contain.text', selectedCompanyTitle);
  }
}
