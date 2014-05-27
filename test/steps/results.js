/* Normally you'd require('massah/helper') here */
var massah = require('../../helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .then('I expect to see 2 options', function() {
            this.driver.elements('li').count(function(count) {
                count.should.equal(2)
            })
        })
        .then('one of the options matches that which I entered', function() {
            this.driver.content(this.params.newOption, 'li').then(
                null,
                function() { throw new Error('Missing expected item') }
            )
        })
    
    return library
})()