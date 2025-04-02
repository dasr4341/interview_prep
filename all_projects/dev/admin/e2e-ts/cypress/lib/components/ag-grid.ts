import * as _ from 'lodash';

export default class AgGrid {
  agCellRow() {
    cy.get('.ag-row').then($el => $el.length).as('agCellRow');
  }

  agCellRowClick() {
    _.range(1, 3).forEach(i => {
      cy.get(`.ag-row:nth-child(${i}) .ag-cell:first-child .ag-checkbox-input`).click();
    })
  }
}