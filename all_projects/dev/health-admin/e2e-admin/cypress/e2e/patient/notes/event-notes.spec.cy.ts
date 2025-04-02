/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import note from "../../../page/notes/note-list";
import Event from "../../../page/events/event-list";
import { selectMenu } from "../../../admin/components/nav";
import specInit from "lib/spec.init";
import notesLinkFromDetails from "components/notes-link";

describe('Notes create, edit, listing, delete from events module', () => {
  const loginPage = new login();
  const notes = new note();
  const event = new Event();

  specInit();

  it('Go to Events page', () => {
    loginPage.login();
  })

  it('Create note from my notes and verify that in the "My notes" listing page', () => {
    notes.openMyNotes();
    cy.get(notes.locators.floatingButton).click();
    cy.get(notes.locators.noteCreateFlyoutMenu).click();
    notes.createNote();
    notes.assertNoteSubject();
 })

  it('Verify the latest created notes is not listed in first event specific notes', () => {
    selectMenu('Events');
    event.openFirstEvent();
    notesLinkFromDetails();
    notes.assertNoteFromEventsNoteLink();
  })

  it('Go to first event, open popover menu and open note create form', () => {
    selectMenu('Events');
    cy.get(event.locators.eventPopOver).first().click();
    cy.get(event.locators.noteOptionInPopupModal).click();
  })

  it('Create note and verify that note exists in the notes list', () => {
    notes.createNote();
    event.openFirstEvent();
    notes.assertionForCreateNote();
  })

  it('Edit the last note created by CY', () => {
     notes.openNotePopOver();
     notes.editNote();
  })

  it('Delete the last note created by CY', () => {
    notes.openNotePopOver();
    notes.deleteNote();
  })

  it('Go to first event details', () => {
    selectMenu('Events');
    event.openFirstEvent();
  })

  it('Once note created from event details, assertion for created note', () => {
    notesLinkFromDetails();
    cy.get(notes.locators.floatingButton).click();
    cy.get(notes.locators.noteCreateFlyoutMenu).click();
    notes.createNote();
     notes.assertNoteSubject();
  })

  it('Delete created note ', () => {
    notes.openNotePopOver();
     notes.deleteNote();
  })

})