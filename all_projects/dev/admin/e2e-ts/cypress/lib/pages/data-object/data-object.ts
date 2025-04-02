import DefaultPage from "../default-page";

class DataObjectFuntions extends DefaultPage{
    allTypeRow(){
      return cy.get('[data-test-id="data-object-row"]');
    }
  
    defaultTypeRow(){
      return cy.get('[data-test-id="default-access-data-row"]');
    }

    optionClick() {
      cy.get('[data-accordion-component="AccordionItem"]:nth-child(1) .relative:nth-child(2) [data-testid="option"] input').click();
    }

    toggleSwitchAction() {
      cy.get('[data-accordion-component="AccordionItem"]:nth-child(2) .toggle-bar').click();
      cy.wait(1000);
      cy.get('[data-accordion-component="AccordionItem"]:nth-child(3) .toggle-bar').click();
    }

  }
  
  export default DataObjectFuntions;