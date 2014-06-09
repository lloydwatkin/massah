var glob = require('glob')
  , colours = require('colours')
  , Mocha = require('mocha')
  , helper = require('../../helper')

var run = function(config) {

    var mocha = new Mocha({
        timeout: config.timeout || 60000,
        reporter: 'spec'
    })

    var next = function() {
        mocha.run(function(failures) {
            var end = function() { 
                process.exit(failures || 0)
            }
            if (!helper.application.helper.afterTests) return end()
            helper.application.helper.afterTests(end)
        })
    }
    mocha.addFile('./node_modules/massah/index.js')
    if (!helper.application.helper.beforeTests) return next()
    helper.application.helper.beforeTests(next)
}

module.exports = function(yargs) {
    try {
        var config = null
        try {
            config = require(process.cwd() + '/.massah.js')(yargs)
            console.log('Found a .massah.js config file'.green)
            helper.setOption(config)
        } catch (e) {console.log(e)}

        if (!config) {
            yargs.boolean('headless')
            helper.setOption('headless', yargs.argv.headless)
        }
        return run(config)   
    } catch (error) {
        console.log(
            'Error loading test suite:\n'.red +
            error.message.red
        )
    }
}
