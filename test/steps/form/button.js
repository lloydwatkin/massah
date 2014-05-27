/* Normally you'd require('massah/helper') here */
var massah = require('../../../helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .when('I click the \'(.*)\' button', function(label) {
            this.driver.button(label).click()
        })
    
    return library
})()