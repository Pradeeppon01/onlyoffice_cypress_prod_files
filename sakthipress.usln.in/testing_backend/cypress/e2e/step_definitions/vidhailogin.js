import {
    Given,
    When,
    Then,
  } from "@badeball/cypress-cucumber-preprocessor";
  import credentials from '../features/credentials.json';



Given("I visit the vidhai login page", () => {
    cy.visit("https://platform.vidh.ai/login");
  });

When("I give the login id and pass for {string}",(vidhailogin)=>{
    const { id, password } = credentials[vidhailogin.toLowerCase()];

    cy.get('#username').type(id)
    cy.get(':nth-child(2) > .jss108 > .jss119').type(password)
    cy.get('.jss163').click()
            
})