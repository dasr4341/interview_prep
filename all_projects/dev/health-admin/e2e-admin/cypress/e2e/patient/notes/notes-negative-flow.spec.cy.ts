/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import note from "../../../page/notes/note-list";
import Event from "../../../page/events/event-list";
import specInit from "lib/spec.init";
import NoteValidation from "page/notes/note-validation";
import notesLinkFromDetails from "components/notes-link";
import { selectMenu } from "../../../admin/components/nav";
import patientsList from "page/patients/patients-list";
import notesList from "../../../page/notes/note-list";
import pageTitleAssert from "components/page-title";


describe('Notes negative flow', () => {
  const loginPage = new login();
  const notes = new note();
  const event = new Event();
  const validation = new  NoteValidation;
  const patientsPage = new patientsList();
  const notesPage = new notesList();

  specInit();

  it('Login with patient', () => {
    loginPage.login();
  })

  it('Go to first event, open popover menu and open note create form and check validation', () => {
    cy.get(event.locators.eventPopOver).first().click();
    cy.get(event.locators.noteOptionInPopupModal).click()
    cy.contains('New Note');
    validation.withoutValue();
    validation.withoutDetailsValue();
    validation.withoutHeadlineValue();
    //validation.thousandPlus();
  })

  it('Cancel functionality checking on create note modal', () => {
    cy.get(notes.locators.noteHeadlineInput).clear();
    cy.get(notes.locators.noteTextInput).clear();
    cy.get(notes.locators.noteHeadlineInput).click().type(notes.subject);
    cy.get(notes.locators.noteTextInput).click().type(notes.subject);
    cy.get(notes.locators.cancelButton).click();
  })

  it('Go to first event detail page and create note validation checking from notes list from the event details page', () => {
    event.openFirstEvent();
    notesLinkFromDetails();
    cy.get(notes.locators.floatingButton).click();
    cy.get(notes.locators.noteCreateFlyoutMenu).click();
    cy.contains('New Note');
    validation.withoutValue();
    validation.withoutDetailsValue();
    validation.withoutHeadlineValue();
    //validation.thousandPlus();
    cy.get(notes.locators.cancelButton).click();
  })

  it('Edit, delete note validation checking from notes list from event details page', () => {
    selectMenu('Events');
    event.openFirstEvent();
    notesLinkFromDetails();
    cy.waitForNetworkIdle(3000);
    cy.get('body').then(($elm) => {
      if ($elm.has(notesPage.locators.notesRow).length) {
        notes.openNotePopOver();
        validation.editNoteValidation();
        notes.openNotePopOver();
        validation.deleteNoteValidation();
        notes.openNotePopOver();
        validation.checkCancelToDeleteNote();
  } else {
          cy.get(notes.locators.floatingButton).click();
          cy.get(notes.locators.noteCreateFlyoutMenu).click();
          notes.createNote();
          notes.openNotePopOver();
          validation.editNoteValidation();
          notes.openNotePopOver();
          validation.deleteNoteValidation();
          notes.openNotePopOver();
          validation.checkCancelToDeleteNote();
     }
  })
  })

  it('Notes validation check from the nav notes menu', () => {
    selectMenu('Notes');
    cy.get(notes.locators.floatingButton).click();
    cy.get(notes.locators.noteCreateFlyoutMenu).click();
    cy.contains('New Note');
    validation.withoutValue();
    validation.withoutDetailsValue();
    validation.withoutHeadlineValue();
    cy.get(notes.locators.cancelButton).click();
  })

  it('Edit, delete note validation checking from notes list from event details page', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(notesPage.locators.notesRow).length) {
        notes.openNotePopOver();
        validation.editNoteValidation();
        notes.openNotePopOver();
        validation.deleteNoteValidation();
        notes.openNotePopOver();
        validation.checkCancelToDeleteNote();
        cy.get(notes.locators.notesRow).first().click();
        validation.editNoteValidation();
        validation.deleteNoteValidation();
  } else {
          cy.get(notes.locators.floatingButton).click();
          cy.get(notes.locators.noteCreateFlyoutMenu).click();
          notes.createNote();
          notes.openNotePopOver();
          validation.editNoteValidation();
          notes.openNotePopOver();
          validation.deleteNoteValidation();
          notes.openNotePopOver();
          validation.checkCancelToDeleteNote();
          cy.get(notes.locators.notesRow).first().click();
          validation.editNoteValidation();
          validation.deleteNoteValidation();
     }
  })
  })


})
