/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import note from "../../../page/notes/note-list";
import Event from "../../../page/events/event-list";
import { selectMenu } from "../../../admin/components/nav";
import specInit from "lib/spec.init";
import notesLinkFromDetails from "components/notes-link";

describe('Faciity user: notes flow from events', () => {
  const loginPage = new login();
  const notesPage = new note();
  const eventsPage = new Event();

  specInit();

  it('Login', () => {
    cy.visit('/');
    loginPage.facilityUserLogin();
  })


  it('Create note from my notes', () => {
     notesPage.openMyNotes();
     cy.get(notesPage.locators.floatingButton).click();
     cy.get(notesPage.locators.noteCreateFlyoutMenu).click();
     notesPage.createNote();
     notesPage.assertNoteSubject();
  })

  it('Verify the note which is created from main "Notes" page, that not be listed in event-note listing page', () => {
    selectMenu('Events');
    eventsPage.filterEventsByType({ type: 'ALERT' });
    eventsPage.openFirstEvent();
    notesLinkFromDetails();
    notesPage.assertNoteFromEventsNoteLink();
  })

  it('Delete the created note', () => {
    notesPage.openMyNotes();
    notesPage.openNotePopOver()
    notesPage.deleteNote();
  })

  it('"ALERT" events filteration and open create note modal from first event popover menu', () => {
    selectMenu('Events');
    eventsPage.filterEventsByType({ type: 'ALERT' });
    cy.get(eventsPage.locators.eventPopOver).first().click();
    cy.get(eventsPage.locators.noteOptionInPopupModal).click()
  })

  it('Create a note and assert that note exists in the notes list from event details page', () => {
    notesPage.createNote()
    eventsPage.openFirstEvent();
    notesPage.assertionForCreateNote()
  })

  it('Edit the last created note by CY', () => {
     notesPage.openNotePopOver();
     notesPage.editNote();
  })

  it('Delete the created note', () => {
    notesPage.openNotePopOver()
    notesPage.deleteNote()
  })

  it('Create note from event details floating menu, assert in notes list, and delete that note', () => {
    cy.get(eventsPage.locators.eventDetailsBackButton).click();
    cy.get(notesPage.locators.floatingButton).click();
    cy.get(notesPage.locators.noteCreateFlyoutMenu).click();
    notesPage.createNote();
    notesPage.assertionForCreateNote();
    notesPage.openNotePopOver()
    notesPage.deleteNote();
    cy.reload()
    notesPage.assertNoteFromEventsNoteLink();
  })

})