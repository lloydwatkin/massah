/* Normally you'd require('massah/helper') here */
var massah = require('../../../helper')

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
    
    return library
})()