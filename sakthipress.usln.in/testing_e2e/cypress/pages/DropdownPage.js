class DropdownPage {
    elements = {
      addJobsAndMachinesLink: () => cy.contains('Add Jobs and Machines'),
      addButton: () => cy.get('[style="margin-top: 30px;"] > .btn'),
      dropdownType: () => cy.get(':nth-child(1) > .form-select'),
      dropdownNameInput: () => cy.get('.form-control'),
      dropdownStatus: () => cy.get(':nth-child(3) > .form-select'),
      saveButton: () => cy.get('form > .btn-primary'),
      dropdownListLink: () => cy.get(':nth-child(3) > [data-test="nav-link"]'),
      logout:()=>cy.get(':nth-child(2) > [data-test="nav-link"]'),
      addedname :() =>cy.get('.form-select')
    };
  
    clickAddJobsAndMachines() {
      this.elements.addJobsAndMachinesLink().click();
    }
  
    clickAddButton() {
      this.elements.addButton().click();
    }
  
    selectDropdownType(dropdownType) {
      this.elements.dropdownType().select(dropdownType);
    }
  
    typeDropdownName(dropdownName) {
      this.elements.dropdownNameInput().type(dropdownName);
    }
  
    selectDropdownStatus(status) {
      this.elements.dropdownStatus().select(status);
    }
  
    clickSaveButton() {
      this.elements.saveButton().click();
      this.elements.logout().click()
    }
  
    clickDropdownListLink() {
      this.elements.dropdownListLink().click();
      
    }
    selectmachines(dropdownNameVariable){
        this.elements.addedname.select(dropdownNameVariable)
    }
  }
  
  export const dropdownPage = new DropdownPage();
  