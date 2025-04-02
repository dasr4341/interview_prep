import SettingsPage from "./settings-page";

class TemplatesPage extends SettingsPage {
  openTemplateListPage() {
    cy.visit('/settings/templates/list');
  }

  templatesTitle() {
    return cy.get('[data-test-id="email_templates"] .text-pt-primary');
  }


  duplicateOption() {
    cy.xpath('//*//div[text()="Duplicate"]').click();
  }

  firstTemplateExposeMenu() {
    cy.get('[data-test-id="email_templates"]:nth-child(1) svg').click();
  }

  firstTemplateTitle() {
    return cy.get('[data-test-id="template-title"]').first();
  }

  templatesList() {
    return cy.get('[data-test-id="email_templates"]');
  }

  createNewButton() {
    cy.xpath('//*//button[text()="Create New"]').click();
  }

  templateTitleField() {
    return cy.get('[name="title"]');
  }

  templateSubjectField() {
    return cy.get('[name="subject"]');
  }

  templateTextField() {
    return cy.get('.ql-editor');
  }

  subject() {
    return cy.get('[data-testid="content-frame"] h2');
  }


  createNewBlueButton() {
    cy.get('.flex-col:nth-child(1) .btn').click();
  }

  templatesListExist() {
    this.templatesList().then(els => els.length).as('templateLength');
  }

  deleteTemplate() {
    cy.get(`[data-test-id="email_templates"] button`).first().click();
    cy.contains('Delete').click();
    cy.contains('Yes').click();
    cy.waitForNetworkIdle(1000);
    this.alert().should('contain.text', 'Email template removed successfully');
  }

  editTemplate(templateName) {
    return new Promise((resolve) => {
      cy.get('[data-test-id="email_templates"]').then(($el) => {
        let templateIndex;
        $el.each((i, elm) => {
          if (elm.querySelector('span')?.innerHTML === templateName) {
            templateIndex = i + 1;
            cy.log(templateIndex)
            cy.get(`[data-test-id="email_templates"]:nth-child(${templateIndex}) svg`).click();
            cy.contains('Edit').click();
          }
          resolve(templateIndex);
        });
      });
    });
  }
}

export default TemplatesPage;
