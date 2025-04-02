/// <reference types="cypress" />
import Toastify from '../../components/toastify';
import DefaultPage from '../default-page';

class NotesPage {
  toast: Toastify;
  constructor() {
     this.toast = new Toastify();
  }

  selectors = {
    // Modal
    modalTitle: () => cy.get('[data-testid="overlay"] h1'),
    noteOption: () => cy.get('Note'),
    submitBtn: () => cy.get('.popup-content button[type="submit"]'),
    cancelButton: () => cy.get('.popup-content').contains('Cancel'),

    // Note form
    subjectField: () => cy.get('form [name="subject"]'),
    detailsField: () => cy.get('[data-placeholder="Add Details"]'),
    errorEl: () => cy.get('[data-testid="error-id"]'),

    // List page
    noteItems: () => cy.get('[data-test-id="notes"]'),
    noteItemsTitle: () => cy.get('[data-test-id="notes"] [data-test-id="note-subject"]'),
    noteItemsDescriptions: () => cy.get('[data-test-id="notes"] [data-test-id="note-description"] p'),
    notesLink: () => cy.get('[data-test-id="Notes-link"]'),

    // Details Page
    editNoteBtn: () => cy.get('[data-testid="content-footer"] span button'),
    deleteNoteBtn: () => cy.contains('Delete'),
    companyName: () => cy.get('[data-testid="overlay"] a:nth-child(1)').first(),
    noteTitle: () => cy.get('[data-test-id="note-title"]'),
    noteContent: () => cy.get('[data-test-id="note-content"]'),
    deleteConfirm: () => cy.get('.popup-content').contains('Delete'),

  }

  //  Create a new note 
  newNote(randomName: string) {
    cy.get('[data-testid="note-create"] span').click();
    cy.get('body h1').should('contain.text', 'New Note');
    cy.get('[data-testid="content-frame"] form [name="subject"]').type(randomName);
    cy.get('[data-testid="content-frame"] form .ql-editor').type(randomName);
    cy.get('.popup-content [type="submit"]').should('have.text', 'Save').click();
    cy.waitForNetworkIdle(1000);
    // After creating a note UI is redirecting to event details page 
  }

  notesCount() {
    cy.get('[data-testid="note-item"]').then(list => list.length).as('notes-count');
  }

  noteListOfTheEvent() {
    cy.get('[data-test-id="notes-link"]').click();
    cy.waitForNetworkIdle(1000);
    cy.get('body h1').should('contain.text', 'My Notes');
    this.notesCount();
  }

  getFirstNote() {
    return cy.get('[data-testid="note-item"]:first() a span.line-clamp-1');
  }

  noteValidationCheck(noteHeading: string, noteDetail: string) {
    cy.waitForNetworkIdle(3000);
    this.selectors.submitBtn().click();
    this.selectors.errorEl().first().should('contain.text', 'This field is required');
    this.selectors.errorEl().last().should('contain.text', 'This field is required');
    this.selectors.subjectField().clear().type('           ');
    this.selectors.detailsField().clear().type('        ');
    this.selectors.submitBtn().click();
    this.selectors.errorEl().first().should('contain.text', 'This field is required');
    this.selectors.errorEl().last().should('contain.text', 'Please type a text');
    this.selectors.subjectField().type(noteHeading);
    this.selectors.detailsField().type(noteDetail);
    this.selectors.cancelButton().click();
  }

  modalTitle() {
    return cy.get('[data-testid="overlay"] h1');
  }

  submitNote(noteHeading: string, noteDetail: string) {
    this.selectors.subjectField().type(noteHeading);
    this.selectors.detailsField().type(noteDetail);
    this.selectors.submitBtn().click();
    cy.waitForNetworkIdle(2000);
  }

  deleteNote(noteHeading: string) {
    cy.get('.modal.text-center').should('contain.text', 'Are you sure you want to delete this note?');
    this.selectors.cancelButton().click();
    this.selectors.deleteNoteBtn().click();
    this.selectors.deleteConfirm().click();
    this.toast.selectors.success().should('contain.text', 'Note deleted successfully');
    cy.waitForNetworkIdle(2000);
    cy.log(noteHeading);
    new DefaultPage().selectors.pageTitle().contains('My Notes');
  }
}

export default NotesPage;