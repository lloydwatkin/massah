var massah = require('massah/helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .given('I visit the home page', function(url) {
            this.driver.get(
                'http://localhost:' + massah.application.helper.port
            )
        })
        .given('a page with title \'(.*)\'', function(title) {
            this.driver.title(function(pageTitle) {
                pageTitle.should.equal(title)
            })
        })
    
    return library
})()