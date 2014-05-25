/* Normally you'd require('massah') here */
var massah = require('../../helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .given('I enter the search term \'(.*)\'', function(term) {
            this.params.searchTerm = term
            this.driver.element('input[name=q]').enter(term)
        })
    
    return library
})()