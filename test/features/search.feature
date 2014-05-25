Feature: Google Search

Background:

    Given I visit google.co.uk
   
Scenario: Should load the search page when a term is submitted

    Given I enter the search term 'massah'
    When I click the search button
    Then I expect to see the search results page
