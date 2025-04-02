/// <reference types="cypress" />

import { TodoPage } from "../../../lib/page/todo-page"

describe('Todo App Test', () => { 
  const todoPage = new TodoPage()

  beforeEach(() => {
    cy.visit('/todo')
  })

  it('displays two todo items by default', () => {
    todoPage.selectors.todoItem().should('have.length', 2)
    todoPage.selectors.todoItem().first().should('have.text', 'Pay electric bill')
    todoPage.selectors.todoItem().last().should('have.text', 'Walk the dog')
  })

  it('can add new todo items', () => {
    const newItem = 'CY - Feed the cat'
    todoPage.selectors.newTodo().type(`${newItem}{enter}`)
    todoPage.selectors.todoItem()
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  context('with a checked task', () => {
    beforeEach(() => {
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      cy.contains('Active').click()

      todoPage.checkContentExist({ text: 'Walk the dog', length: 1});

      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      cy.contains('Completed').click()

      todoPage.checkContentExist({ text: 'Pay electric bill', length: 1});

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      cy.contains('Clear completed').click()
      todoPage.checkContentNotExist({ text: 'Pay electric bill', length: 1 });
      
      cy.contains('Clear completed').should('not.exist')
    })
  })


 })