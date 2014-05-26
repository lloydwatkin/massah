/* Normally you'd require('massah/helper') here */
var massah = require('../../helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .then('I expect to see the search results page', function() {
            var params = this.params
            this.driver.currentUrl(function(currentUrl) {
                currentUrl.should.include(params.searchTerm)
            })
        })
    
    return library
})()