var massah = require('massah/helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .when('I enter \'(.*)\' in the text box', function(option) {
            /* In scenario 2 this is set by an annotation hook */
            if (!this.params.newOption) {
                this.params.newOption = option
            } else {
                option = this.params.newOption
            }
            this.driver.element('input[id=label]').enter(option)
        })
        .then('the text box is empty', function() {
            this.driver.input('#label').value(function(text) {
                text.should.equal('')
            })
        })
        .then('the text box should be focussed', function() {
            this.driver.element('input[id=label]:focus').then(
                null,
                function() { throw new Error('Expected element to be focussed') }
            )
        })
    
    return library
})()