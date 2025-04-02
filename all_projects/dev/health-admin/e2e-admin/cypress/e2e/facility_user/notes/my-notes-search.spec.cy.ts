/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import notesList from "../../../page/notes/note-list";
import pageTitleAssert from "../../../admin/components/page-title";
import clearData from "../../../actions/clear-search-data";
import {selectMenu} from '../../../admin/components/nav';
import specInit from "lib/spec.init";

describe('Search patient with valid and invaid data', () => {
  const loginPage = new login();
  const notesPage = new notesList();

  specInit();

  it('Facility user login', () => {
    cy.visit('/');
    loginPage.facilityUserLogin();
  })

  it('Go to the notes listing page', () => {
    selectMenu('Notes');
    pageTitleAssert('My Notes');
  })

 it('Search with valid note title', () => {
  cy.get('body').then(($elm) => {
    if ($elm.has(notesPage.locators.notesRow).length) {
   notesPage.validNoteTitleSearch();
  } else {
    cy.log('No notes exist');
   }
  })
})

  it('Search with valid note details', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(notesPage.locators.notesRow).length) {
    clearData();
    cy.waitForNetworkIdle(3000);
    notesPage.validNoteDetailsSearch();
  } else {
    cy.log('No notes exist');
   }
  })
})

  it('Search with invalid data', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(notesPage.locators.notesRow).length) {
    clearData();
    notesPage.invalidNoteSearch();
  } else {
    cy.log('No notes exist');
   }
  })
  })
})