Feature: Login

Background:
  Given A web browser is at the login page

Scenario: Admin login
  When A user enters the following credentials and clicks on the login button
    | username        | password |
    | admin@gmail.com | 1234     |
  Then the user should be logged in as an admin

Scenario: Employee login
  When A user enters the following credentials and clicks on the login button
    | username     | password |
    | 8610659547   | 1234     |
  Then the user should be logged in as an employee


Scenario: Add Dropdown Check
  When A user adds a dropdown with the following details
    | dropdownName   | status |    username    | password|
    | dropdown test  | Enable | admin@gmail.com| 1234 |
    |                |        |  8610659547    | 1234 |


Scenario: addtask
    When A user add a newtasks
    | jobid | machinename | status | quantity | remarks | username | password |
    |  1    | KOLBUS     |  complete | 12    | good    | 8610659547| 1234|