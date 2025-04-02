/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "page/login";
import pageTitleAssert from "components/page-title";
import { selectMenu } from 'components/nav';
import patientsList from "page/patients/patients-list";
import note from "page/notes/note-list";
import notesLinkFromDetails from "components/notes-link";
import specInit from "lib/spec.init";

describe('Create, edit , delete note from patients details', () => {
  const loginPage = new login();
  const patientsPage = new patientsList();
  const notesPage = new note();
  
  specInit();

  it('Facility user login', () => {
    cy.visit('/');
    loginPage.facilityUserLogin();
  })

  it('Go to the patients listing page', () => {
    selectMenu('Patients');
    pageTitleAssert('Patients');
  })

  it('Go to any patient details page', () => {
    cy.get(patientsPage.locators.patientName).its('length').then((patientsRow) => {
    const randomPatientName = (Math.floor(Math.random() * patientsRow))
    const selectedName = cy.get(patientsPage.locators.patientName).eq(randomPatientName);
    selectedName.then(el => {
      const patientName = el.text().split(' ').slice(0,1).join(' ');
      cy.log(patientName)
      cy.get(patientsPage.locators.patientName).eq(randomPatientName).click()
      pageTitleAssert(patientName)
    })
  })
})

  it('Create note from patient details page floating menu and assert in notes list', () => {
    cy.get(notesPage.locators.floatingButton).click();
      cy.get(notesPage.locators.noteCreateFlyoutMenu).click();
      notesPage.createNote();
      notesLinkFromDetails();
      notesPage.assertNoteSubject()
  })

  it('Edit the created note', () => {
    notesPage.openNotePopOver();
    notesPage.editNote();
  })

  it('Delete the created note', () => {
    notesPage.openNotePopOver()
    notesPage.deleteNote()
  })

  it('Create note from notes list floating menu from patient details', () => {
    cy.waitForNetworkIdle(2000)
    cy.get(notesPage.locators.floatingButton).click();
    cy.get(notesPage.locators.noteCreateFlyoutMenu).click();
    notesPage.createNote();
    notesPage.assertNoteSubject()
  })

  it('Edit the last created note', () => {
   notesPage.openNotePopOver();
   notesPage.editNote();
  })

it('Delete note which is created from notes list', () => {
  notesPage.openNotePopOver()
  notesPage.deleteNote()
})

it('Create note from notes list floating menu from patient details and verify on the note detail page', () => {
  cy.waitForNetworkIdle(2000)
  cy.get(notesPage.locators.floatingButton).click();
  cy.get(notesPage.locators.noteCreateFlyoutMenu).click();
  notesPage.createNote();
})

it('Edit the last created note from the note details page', () => {
  cy.waitForNetworkIdle(2000);
  notesPage.assertFromNoteDetails();
  notesPage.editNoteFromNoteDetais();
})

it('Delete note which is created from notes list', () => {
  notesPage.deleteNote()
})
})