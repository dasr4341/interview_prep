/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import { faker } from '@faker-js/faker';
import searchData from '../../admin/components/search-input';
import noDataFoundTextAssert from '../../admin/components/no-result-assert';
import clearData from '../../actions/clear-search-data';
import { selectMenu } from 'components/nav';
import pageTitleAssert from 'components/page-title';
import submitButton from 'components/submit-button';
import notesLinkFromDetails from 'components/notes-link';
import alertMessage from 'components/toast-msg';

export default class Note {
  subject = `CY ${faker.lorem.word()}`;
  editSubject = `CY ${faker.lorem.word()}`;

  locators = {
    notesHeadline: '[data-testid="note-headline"]',
    notesLink: '[data-testid="note-link"]',
    noteDetails: '[data-testid="note-details"]',
    notesRow: '[data-testid="notes-row"]',
    noteHeadlineInput: '[name="subject"]',
    noteTextInput: '[name="text"]',
    noteCreateFlyoutMenu: '[data-testid="note_option"]',
    floatingButton: '[data-testid="floating_btn"]',
    alertMessage: '[data-testid="error-id"]',
    cancelButton: '[data-testid="cancel_btn"]',
    settingsMenu: '[data-testid="settingsLink"]',
    //saveButton: '[data-testid="update"] [type="submit"]'
    saveButtonOnCreateNoteModal: '[data-testid="update"] button',
  };

  openEventNotes() {
    cy.get(this.locators.notesLink).click();
    cy.waitForNetworkIdle(10000);
    pageTitleAssert('My Notes');
  }
  openNotePopOver() {
    cy.get('[data-testid="notes-row"] button').first().click({ force: true });
  }
  openMyNotes() {
    cy.get(this.locators.settingsMenu).click();
    selectMenu('Notes');
    pageTitleAssert('My Notes');
  }

  noteFloatingButtonClick() {
    cy.get(this.locators.floatingButton).click();
    cy.get(this.locators.noteCreateFlyoutMenu).click();
  }

  createNote() {
    cy.contains('New Note');
    cy.get(this.locators.noteHeadlineInput).click().type(this.subject);
    cy.get(this.locators.noteTextInput)
      .click()
      .type(`CY ${faker.lorem.lines()}`);
    cy.get(this.locators.saveButtonOnCreateNoteModal).click();
    cy.waitForNetworkIdle(5000);
  }

  assertionForCreateNote() {
    notesLinkFromDetails();
    cy.waitForNetworkIdle(2000);
    this.assertNoteSubject();
  }

  assertNoteSubject() {
    cy.get(this.locators.notesHeadline)
      .first()
      .should('contain.text', this.subject);
  }

  async editNote() {
    cy.contains('Edit').click();
    cy.contains('Edit Note');
    cy.get(this.locators.noteHeadlineInput).click().clear();
    cy.get(this.locators.noteTextInput).click().clear();
    cy.get(this.locators.noteHeadlineInput).click().type(this.editSubject);
    cy.get(this.locators.noteTextInput)
      .click()
      .type(`CY ${faker.lorem.lines()}`);
    submitButton();
    cy.waitForNetworkIdle(2000);
    cy.get(this.locators.notesHeadline).should(
      'contain.text',
      this.editSubject
    );
  }

  deleteNote() {
    cy.contains('Delete').click();
    cy.contains('Are you sure you want to delete this note?');
    cy.get('[data-testid="confirm-btn"]').click();
    alertMessage('Note deleted successfully');
  }

  assertNoteFromEventsNoteLink() {
    cy.get(this.locators.notesHeadline).should(
      'not.contain.text',
      this.subject
    );
  }

  validNoteTitleSearch() {
    cy.get(this.locators.notesHeadline)
      .its('length')
      .then((noteCount) => {
        cy.log('note count', noteCount);
        const randomNoteTitle = Math.floor(Math.random() * noteCount);
        const selectedNoteTitle = cy
          .get(this.locators.notesHeadline)
          .eq(randomNoteTitle);
        selectedNoteTitle.then((el) => {
          const noteTitle = el.text();
          cy.log(noteTitle);
          searchData(noteTitle);
          cy.waitForNetworkIdle(2000);
          cy.get(this.locators.notesRow)
            .find(this.locators.notesHeadline)
            .each(($searchedNoteTitle) => {
              const searchedHeadline = $searchedNoteTitle.text();
              console.log(searchedHeadline);
              expect(searchedHeadline.toLowerCase()).to.contains(
                noteTitle.toLowerCase()
              );
            });
        });
      });
  }

  validNoteDetailsSearch() {
    cy.get(this.locators.noteDetails)
      .its('length')
      .then((noteCount) => {
        cy.log('note count', noteCount);
        const randomNoteDetails = Math.floor(Math.random() * noteCount);
        const selectedNoteDetails = cy
          .get(this.locators.noteDetails)
          .eq(randomNoteDetails);
        selectedNoteDetails.then((el) => {
          const noteDetails = el.text();
          cy.log(noteDetails);
          searchData(noteDetails);
          cy.waitForNetworkIdle(2000);
          cy.get(this.locators.notesRow)
            .find(this.locators.noteDetails)
            .each(($searchedNoteTitle) => {
              const searchedDetails = $searchedNoteTitle.text();
              console.log(searchedDetails);
              expect(searchedDetails.toLowerCase()).to.equal(
                noteDetails.toLowerCase()
              );
            });
        });
      });
  }

  invalidNoteSearch() {
    searchData(faker.lorem.words());
    noDataFoundTextAssert('No results', 'Refine your search and try again');
    clearData();
    cy.get(this.locators.notesRow);
  }

  assertFromNoteDetails() {
    cy.get(this.locators.notesRow).first().click();
    cy.get(this.locators.notesHeadline)
      .first()
      .should('contain.text', this.subject);
  }

  editNoteFromNoteDetais() {
    cy.contains('Edit').click();
    cy.contains('Edit Note');
    cy.get(this.locators.noteHeadlineInput).click().clear();
    cy.get(this.locators.noteTextInput).click().clear();
    cy.get(this.locators.noteHeadlineInput).click().type(this.editSubject);
    cy.get(this.locators.noteTextInput)
      .click()
      .type(`CY ${faker.lorem.lines()}`);
    cy.get('[data-testid="update"] button').click();
    cy.waitForNetworkIdle(2000);
    cy.get(this.locators.notesHeadline).should(
      'contain.text',
      this.editSubject
    );
  }
}
