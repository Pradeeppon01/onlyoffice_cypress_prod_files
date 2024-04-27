import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import {loginPage} from '@pages/LoginPage'
import { dropdownPage } from '@pages/DropdownPage';

Given("A web browser is at the login page", () => {
  cy.visit("https://127.0.0.1:8880/");
});

When("A user enters the following credentials and clicks on the login button", (dataTable) => {
  const credentials = dataTable.hashes()[0];
  const { username, password } = credentials;

  loginPage.typeUsername(username);
  loginPage.typePassword(password);
  loginPage.clickLogin();
});

Then("the user should be logged in as an admin", () => {
  cy.wait(5000);
  cy.contains('All Jobs').should('be.visible');
});

Then("the user should be logged in as an employee", () => {
  cy.wait(5000);
  cy.contains('Sakthi').should('be.visible');
});


When("A user adds a dropdown with the following details", (dataTable) => {
  const dropdownDetails = dataTable.hashes();
  let dropdownNameVariable;
  
  dropdownDetails.forEach((row) => {
    const { dropdownName, status, username, password } = row;
    
    if (username && password) {
      loginPage.typeUsername(username);
      loginPage.typePassword(password);
      loginPage.clickLogin();
    }
    
    if (dropdownName && status) {
      dropdownNameVariable = dropdownName;
      
      dropdownPage.clickAddJobsAndMachines();
      dropdownPage.clickAddButton();
      dropdownPage.selectDropdownType('Machine Dropdown');
      dropdownPage.typeDropdownName(dropdownName);
      dropdownPage.selectDropdownStatus(status);
      dropdownPage.clickSaveButton();
    }
  });
  cy.get('.form-select').select(dropdownNameVariable)
  cy.get(':nth-child(3) > [data-test="nav-link"]').click()

 
});

When("A user add a newtasks",(dataTable)=>{
  const credentials = dataTable.hashes()[0];
  const { username, password,jobid,machinename,quantity,remarks } = credentials;

  loginPage.typeUsername(username);
  loginPage.typePassword(password);
  loginPage.clickLogin();
  cy.get(':nth-child(1) > .form-control').type(jobid)
  cy.get('.form-select').select(machinename)
  cy.get(':nth-child(1) > :nth-child(1) > .MuiTypography-root').click()
  cy.get(':nth-child(4) > .form-control').type(quantity)
  cy.get(':nth-child(2) > .form-control').type(remarks)
  cy.get('[style="margin-top: 7px; margin-left: 8px;"]').click()
  cy.wait(5000)
  cy.contains("Your Work Status Added Successfully")
})
