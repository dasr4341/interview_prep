/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import note from "../../../page/notes/note-list";
import specInit from "lib/spec.init";
import NoteValidation from "page/notes/note-validation";
import notesLinkFromDetails from "components/notes-link";
import { selectMenu } from "../../../admin/components/nav";
import patientsList from "page/patients/patients-list";
import notesList from "../../../page/notes/note-list";
import pageTitleAssert from "components/page-title";


describe('Notes negative flow from patients', () => {
  const loginPage = new login();
  const notes = new note();
  const validation = new  NoteValidation;
  const patientsPage = new patientsList();
  const notesPage = new notesList();

  specInit();

  it('login with facility user', () => {
    cy.visit('/');
    loginPage.facilityUserLogin();  })

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
  it('Create note validation check from the patients details notes link', () => {
    notesLinkFromDetails();
    cy.get(notes.locators.floatingButton).click();
    cy.get(notes.locators.noteCreateFlyoutMenu).click();
    cy.contains('New Note');
    validation.withoutValue();
    validation.withoutDetailsValue();
    validation.withoutHeadlineValue();
    // validation.thousandPlus();
  })

  it('Cancel functionality checking on create note modal', () => {
    cy.get(notes.locators.noteHeadlineInput).clear();
    cy.get(notes.locators.noteTextInput).clear();
    cy.get(notes.locators.noteHeadlineInput).click().type(notes.subject);
    cy.get(notes.locators.noteTextInput).click().type(notes.subject);
    cy.get(notes.locators.cancelButton).click();
  })

  it('Edit, delete note validation checking from notes list from patient details page', () => {
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
