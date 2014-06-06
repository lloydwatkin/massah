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
        .define('I wait (.*) seconds?', function(time) {
            time = parseInt(time) * 1000
            var driver = this.driver
            var endTime = new Date().getTime() + time
            driver.wait(function() {
                return new Date().getTime() > endTime
            }, endTime + 5000, 'Error with wait helper')
        })
    
    return library
})()