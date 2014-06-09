Feature: Annotation override example

Background:

    Given I visit the home page

@Option=Override using an annotation
Scenario: Can override text with an annotation

    Given a page with title 'Massah test page'
    When I enter 'Option 2' in the text box
    And I click the 'Add Option' button
    Then I expect to see 2 options
    And one of the options matches that which I entered
    And the text box is empty
