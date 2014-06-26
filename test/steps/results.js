var massah = require('massah/helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .then('I expect to see ([0-9]*) options', function(expected) {
            this.driver.elements('li').count(function(count) {
                count.should.equal(parseInt(expected))
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