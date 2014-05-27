Feature: Google Search

Background:

    Given I visit the home page
   
Scenario: Should load the search page when a term is submitted

    Given a page with title 'Massah test page'
    When I enter 'Option 2' in the text box
    And I click the 'Add Option' button
    Then I expect to see 2 options
    And one of the options matches that which I entered
    And the text box is empty
