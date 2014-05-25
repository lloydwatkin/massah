/* Normally you'd require('massah') here */
var massah = require('../../helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .when('I click the search button', function(label) {
            this.driver.element('button[name="btnG"]').click()
        })
    
    return library
})()