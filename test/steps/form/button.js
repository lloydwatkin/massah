var massah = require('massah/helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .when('I click the \'(.*)\' button', function(label) {
            this.driver.button(label).click()
        })
    
    return library
})()