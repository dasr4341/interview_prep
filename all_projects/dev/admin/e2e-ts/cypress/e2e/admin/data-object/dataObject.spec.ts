/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import DataObjectFuntions from "../../../lib/pages/data-object/data-object";
import * as faker from 'faker';

describe('Data object QA', () => {
  const login = new LoginPage();
  const dataObjectFunction=new DataObjectFuntions();

  const randomName = 'Itobuz ' + faker.lorem.words(2);

  before(() => {
    cy.clearLocalStorageSnapshot()
  });

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

  it('Go to DataObject',()=>{
    cy.contains('Settings').click();
    cy.contains('Admin').click();
    cy.contains('Data Objects').click();
    cy.url().should('include', '/settings/admin/data-objects');
    cy.waitForNetworkIdle(3000);
  });

  /* Custom data object */
  it('Data objects should have Custom data records',()=>{
    cy.get('body').then(el => {
      if (el.has('[data-test-id="data-object-row"]')) {
        dataObjectFunction.allTypeRow().should('have.length.gt', 0);
      } else {
        dataObjectFunction.allTypeRow().should('have.length', 0);
      }
    })
  });
  
  /* Default data object */
  it('Data objects should have Default data records',()=>{
    cy.get('body').then(el => {
      if (el.has('[data-test-id="default-access-data-row"]')) {
        dataObjectFunction.defaultTypeRow().should('have.length.gt', 0);
      } else {
        dataObjectFunction.defaultTypeRow().should('have.length', 0);
      }
    })
  });

  it('Go to Data Object create page',()=>{
    cy.contains('Create new collection').click();
    dataObjectFunction.pageTitle().should('contain.text','Data Object create');
    cy.waitForNetworkIdle(3000);
  });

  it('Create a Data Object',()=>{
    cy.get('[name="name"]').prev().should('contain.text','Data object name').next().type(randomName);
    cy.get('[type="submit"]').should('contain.text','Save').click();
    cy.get('[data-test-id="page-title"]').should('contain.text', randomName);
    cy.wait(1000);
    dataObjectFunction.optionClick();
    cy.wait(1000);
    dataObjectFunction.toggleSwitchAction();
    cy.get('[type="submit"]').should('contain.text','Save').click();
    cy.visit('/settings/admin/data-objects/');
    cy.wait(3000);
  });

  it('Open popover menu of the row just added',()=>{
    cy.get('[data-test-id="data-object-row"] button').last().click();
  });

 it('Edit the data object',()=>{
    cy.contains('EDIT').click();
    cy.wait(1000);
    dataObjectFunction.optionClick();
    cy.wait(1000);
    dataObjectFunction.toggleSwitchAction();
    cy.get('[type="submit"]').should('contain.text','Save').click();
    cy.visit('/settings/admin/data-objects/');
    cy.wait(3000);
  });

  it('Open popover menu of the row to delete it',()=>{
    cy.get(`.space-x-4 button`).last().click();
  });

  it('Delete the data object',()=>{
    cy.contains('DELETE').click();
    cy.wait(2000);
    cy.contains('Delete').click();
  });
  
});
