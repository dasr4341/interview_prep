import Toast from '../components/toastify';

export default class DefaultPage {
  toast: Toast;

  constructor() {
    this.toast = new Toast();
  }

  pageTitle() {
    return cy.get('[data-test-id="page-title"]');
  }
  
  selectors = {
    pageTitle: () => cy.get('body h1')
  }

}