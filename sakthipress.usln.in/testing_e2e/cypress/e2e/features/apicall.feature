Feature: API Call
Scenario: Retrieve User jobs
    Given I visit the login page
    When I make a GET request to "https://api.sakthipress.i4ulabs.com/getusertasks/Surya"
    Then the response status should be 200

  Scenario: Retrieve All Tasks
    Given I visit the login page
    When I make a GET request to getallusertasks "https://api.sakthipress.i4ulabs.com/getallusertasks"
    Then the response status should be in 200





Scenario: Add a new task
    When i logged in "employee" and "jobdetails"
    Then The task should be added successfully in the database 'https://api.sakthipress.i4ulabs.com/getallusertasks' and "jobdetails"
