/// <reference types="cypress" />

export class TodoPage {
  selectors = {
    todoItem: () => cy.get('.todo-list li'),
    newTodo: () => cy.get('[data-test=new-todo]'),
  }

  checkContentExist({ text, length }) {
    this.selectors.todoItem()
      .should('have.length', length)
      .first()
      .should('have.text', text)
  }

  checkContentNotExist({ text, length }) {
    this.selectors.todoItem()
      .should('have.length', length)
      .first()
      .should('not.have.text', text)
  }
}