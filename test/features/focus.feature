@Pending
Feature: Focus test

Background:

    Given I visit the home page

Scenario: Can check focus

    Given a page with title 'Massah test page'
    When I click on the text box
    Then the text box should be focussed
