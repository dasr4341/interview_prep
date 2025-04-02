/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import DefaultPage from "../../../lib/pages/default-page";
import FloatingButton from "../../../lib/components/floating-button";
import NotesPage from "../../../lib/pages/notes/notes-page";


import * as faker from 'faker';

describe('My Notes testing', () => {
  const login = new LoginPage();
  const defaultPage = new DefaultPage();
  const floatingButton = new FloatingButton();
  const notePage = new NotesPage();

  const headline = 'CY- ' + faker.lorem.words(3);
  const addDetails = 'CY- ' + faker.lorem.paragraph(2);
  const editNoteHeading = 'CY-' + faker.lorem.words(3);
  const editNOteDetails = 'CY- ' + faker.lorem.paragraph(2);

  before(() => {
    cy.clearLocalStorageSnapshot()
  })

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

  it('Go to My Notes page', () => {
    cy.visit('/settings/preferences/notes');
    cy.waitForNetworkIdle(1000);
    defaultPage.selectors.pageTitle().should('contain.text', 'My Notes');
  });

  it('Validation check for create note form', () => {
    floatingButton.open();
    notePage.noteValidationCheck(headline, addDetails);
  });

  it('Create a note', () => {
    floatingButton.open();
    notePage.selectors.modalTitle().should('contain.text', 'New Note');
    notePage.submitNote(headline, addDetails);
    notePage.selectors.noteItemsTitle().should('contain.text', headline);
    notePage.selectors.noteItemsDescriptions().should('contain.text', addDetails);
  });

  it('Edit created note from detail page', () => {
    notePage.selectors.noteItems().first().click();
    defaultPage.selectors.pageTitle().should('contain.text', 'Note Detail');
    notePage.selectors.noteTitle().should('contain.text', headline);
    notePage.selectors.noteContent().should('contain.text', addDetails);;
    notePage.selectors.editNoteBtn().click();
    cy.waitForNetworkIdle(2000);
    notePage.submitNote(editNoteHeading, editNOteDetails);
  });

  it('Delete note from the note details page', () => {
    notePage.selectors.deleteNoteBtn().click();
    notePage.deleteNote(editNoteHeading);
  });
});
