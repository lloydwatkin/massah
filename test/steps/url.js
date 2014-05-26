/* Normally you'd require('massah/helper') here */
var massah = require('../../helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .given('I visit (.*)', function(url) {
            this.driver.get('http://' + url)
        })
    
    return library
})()