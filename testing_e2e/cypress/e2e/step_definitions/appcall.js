import {
    Given,
    When,
    Then,
  } from "@badeball/cypress-cucumber-preprocessor";
import credentials from '../features/credentials.json';
import {loginPage} from '@pages/LoginPage'


Given("I visit the login page", () => {
    cy.visit("https://sakthipress.i4ulabs.com/");
  });

When("I make a GET request to {string}", (url) => {
    cy.request("GET", url).as("apiResponse");
  });
  
  Then("the response status should be {int}", (statusCode) => {
    cy.get("@apiResponse").its("status").should("equal", statusCode);
  });
  
  When("I make a GET request to getallusertasks {string}", (url) => {
    cy.request("GET", url).as("apiResponse");
  });
  
  Then("the response status should be in {int}", (statusCode) => {
    cy.get("@apiResponse").its("status").should("equal", statusCode);
  });




//add task check
When("i logged in {string} and {string}",(role,jobdetails)=>{
    const { username, password } = credentials[role.toLowerCase()];
    const {jobid,machinename,quantity,remarks} = credentials[jobdetails.toLowerCase()]
    cy.visit("http://127.0.0.1:8880");

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

Then("The task should be added successfully in the database {string} and {string}", (url,jobdetails) => {
    const {jobid,machinename,quantity,remarks} = credentials[jobdetails.toLowerCase()]
    cy.request("GET", url).then((response) => {
      const tasks = response.body;
      const addedTask = tasks.find((task) => task.jobid === jobid && task.machinename === machinename && task.quantity === quantity && task.remarks === remarks);
      expect(addedTask).to.exist;
    });
  });
