/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />

import AgGrid from '../../components/ag-grid';
import DefaultPage from "../default-page";

class GroupsPage extends DefaultPage {
  agGrid: AgGrid;
  dataObject: any = '';
  casename: any = '';
  
  constructor() {
    super();
    this.agGrid = new AgGrid();
  }

  firstgroupName() {
    return cy.get('[test-data-id="group_list"]:nth-child(1) h3.text-primary');
  }

  searchField() {
    return cy.get('body input');
  }

  fillSearchField(value) {
    cy.get('body input')
      .clear()
      .type(value);
  }

  noDataFoundText() {
    return cy.get('body h1');
  }

  createEditGroupBtn() {
    return cy.get('[data-testid="create-edit-group-btn"]');
  }

  dataObjectSelectionButton() {
    return cy.get('[data-test-id="data-object-selection-btn"]');
  }

  usecaseSelectionButton() {
    return cy.get('[data-test-id="usecase-selection-btn"]');
  }

  typeGroupName(groupname: string) {
    cy.get('[data-test-id="group-name-input"]').type(groupname);
  }

  selectedDataObject() {
    cy.get('[data-test-id="data-object-row"]')
      .first()
      .find('[data-test-id="data-object-title"]')
      .then($el => $el.text())
      .as('objectName');
  }

  selectedUseCase() {
    cy.get('[data-test-id="useCase_item"]')
      .first()
      .find('[data-test-id="use-case-title"]')
      .then($el => $el.text())
      .as('usecaseName');
  }

  addUser() {
    cy.get('[data-testid="add-user-button"]').click();
    this.pageTitle().should('contain.text', 'User Management');
    cy.waitForNetworkIdle(7000, { timeout: 40000 });
    this.agGrid.agCellRow();
    cy.get('@agCellRow').then(count => {
      if(count) {
        this.agGrid.agCellRowClick();
      }
    });
    cy.get('[data-testid="create-group-btn"]').click();
    cy.get('[data-test-id="user-count"]').should('contain.text', '2');
  }

  addDataObjects() {
    this.dataObjectSelectionButton().click();
    cy.waitForNetworkIdle(3000);
    this.pageTitle().should('contain.text', 'Data Object Access');
    cy.get('[data-test-id="data-object-row"]').first().find('input').click();
    this.selectedDataObject();
    cy.get('@objectName').then(el => {
      this.dataObject = el;
      cy.contains('Save').click();
      cy.waitForNetworkIdle(2000);
      cy.url().should('include', 'settings/admin/user-groups/create');
      cy.waitForNetworkIdle(4000);
      cy.get('[data-test-id="card-name"]').should('contain.text', this.dataObject);
    });
  }

  addUseCase() {
    this.usecaseSelectionButton().click();
    cy.waitForNetworkIdle(2000);
    this.pageTitle().should('contain.text', 'Use Case Management');
    cy.get('[data-test-id="useCase_item"]').first().find('input').click();
    this.selectedUseCase();
    cy.get('@usecaseName').then(casename => {
      this.casename = casename;
      cy.contains('Save').click();
      cy.waitForNetworkIdle(2000);
      cy.url().should('include', 'settings/admin/user-groups/create');
      cy.waitForNetworkIdle(4000);
      cy.get('[data-test-id="card-name"]').should('contain.text', this.casename);
    });
  }

  selectGroupRow(groupname: string) {
    cy.get('[test-data-id="group_list"]').contains(groupname).then(name => {
      const parentEl = name.parents('[test-data-id="group_list"]');
      parentEl.find('[data-test-id="popup-btn"] button').click();
    });
  }
  
  editUserGroup(groupname: string) {
    this.selectGroupRow(groupname);
    cy.contains('Edit').click();
    this.pageTitle().should('contain.text', 'Edit User Group');
    this.typeGroupName(groupname);
    cy.get('[data-test-id="group-name-input"]').then(($input => {
      groupname = $input.val() as unknown as string;
      cy.log('along with fn ' + groupname);
      cy.waitForNetworkIdle(2000);
      cy.contains('Save').click();
      cy.waitForNetworkIdle(2000);
      this.toast.selectors.success().should('contain.text', 'This user group is successfully updated');
      this.pageTitle().should('contain.text', groupname);
    }));
  }

  deleteUserGroup() {
    cy.contains('Delete Group').click();
    cy.wait(2000);
    cy.get('[data-test-id="popup-content"]').should('contain.text', 'Did you want to delete this group?');
    cy.wait(2000);
    cy.get('[data-testid="confirm-btn"]').click();
    cy.waitForNetworkIdle(2000);
    this.toast.selectors.success().should('contain.text', 'Group deleted successfully');
    cy.waitForNetworkIdle(4000);
  }
}

export default GroupsPage;