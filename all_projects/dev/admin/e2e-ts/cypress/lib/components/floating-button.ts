export default class FloatingButton {
  open(){
    cy.get('[data-test-id="floating-btn"]').click();
  }
  noteLink() {
    cy.get('[data-testid="note-create"]').click();
  }
}
