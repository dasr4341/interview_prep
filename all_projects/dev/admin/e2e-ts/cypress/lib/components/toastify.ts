export default class Toastify {
  selectors = {
    success: () => cy.get('.Toastify__toast--success .Toastify__toast-body')
  }
}
