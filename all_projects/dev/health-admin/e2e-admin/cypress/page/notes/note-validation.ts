/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import {faker} from "@faker-js/faker";
import searchData from "../../admin/components/search-input";
import noDataFoundTextAssert from "../../admin/components/no-result-assert";
import clearData from "../../actions/clear-search-data";
import { selectMenu } from "components/nav";
import pageTitleAssert from "components/page-title";
import submitButton from "components/submit-button";
import notesLinkFromDetails from "components/notes-link";
import alertMessage from "components/toast-msg";
import Note from "./note-list";

const notes = new Note;

export default class NoteValidation {
  subject = `CY ${faker.lorem.word()}`
  editSubject = `CY ${faker.lorem.word()}`



  withoutValue(){
    cy.get(notes.locators.saveButtonOnCreateNoteModal).click();
    cy.get(notes.locators.alertMessage).each(($alert) => {
       console.log($alert);
        expect($alert.text()).to.equal('This field is required');
    })
  }

  withoutDetailsValue(){
    cy.get(notes.locators.noteHeadlineInput).click().type(notes.subject);
    cy.get(notes.locators.saveButtonOnCreateNoteModal).click();
    cy.get(notes.locators.alertMessage).should('contain.text', 'This field is required');
  }

  withoutHeadlineValue(){
    cy.get(notes.locators.noteHeadlineInput).clear();
    cy.get(notes.locators.noteTextInput).click().type(notes.subject);
    cy.get(notes.locators.alertMessage).should('contain.text', 'This field is required');
  }

  thousandPlus(){
    cy.get(notes.locators.noteHeadlineInput).clear().type(`CY ${faker.lorem.words(200)}`, { delay: 0 })
    cy.get(notes.locators.noteTextInput).click().type(notes.subject);
    cy.get(notes.locators.saveButtonOnCreateNoteModal).click();
    cy.contains('Headline must be shorter than or equal to 1000 characters');
  }

  editNoteValidation(){
    cy.contains('Edit').click();
        cy.contains('Edit Note');
        cy.get(notes.locators.noteHeadlineInput).click().clear();
        cy.get(notes.locators.noteTextInput).click().clear();
        this.withoutValue();
        this.withoutDetailsValue();
        this.withoutHeadlineValue();
        // this.thousandPlus();
        cy.get(notes.locators.cancelButton).click();
  }

  deleteNoteValidation(){
    cy.contains('Delete').click();
    cy.contains('Are you sure you want to delete this note?')
    cy.contains('Cancel').click();
  }

  checkCancelToDeleteNote(){
    cy.contains('Delete').click();
    cy.contains('Are you sure you want to delete this note?')
    cy.contains('Cancel').click();

  }
}
