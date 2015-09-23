var glob = require('glob')
  , colours = require('colours')
  , Mocha = require('mocha')
  , helper = require('../../helper')

var run = function(config) {

    var options = {
        timeout: config.timeout || 60000,
        reporter: config.reporter || 'spec',
        reporterOptions: config.reporterOptions || {}
    }
    if (config.bail) options.bail = true
    
    var mocha = new Mocha(options)

    var next = function() {
        mocha.run(function(failures) {
            var end = function() { 
                process.exit(failures || 0)
            }
            if (!helper.application.after) return end()
            helper.application.after(end)
        })
    }
    mocha.addFile('./node_modules/massah/index.js')
    if (!helper.application.before) return next()
    helper.application.before(next)
}

module.exports = function(yargs) {
    try {
        var config = {}
        try {
            config = require(process.cwd() + '/.massah.js')(yargs)
            console.log('Found a .massah.js config file'.green)
            helper.setOption(config)
        } catch (e) {}

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
        console.log(error.stack)
        process.exit(1)
    }
}
