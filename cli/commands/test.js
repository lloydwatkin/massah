var glob = require('glob')
  , colours = require('colours')
  , Mocha = require('mocha')
  , helper = require('../../helper')

var run = function() {
     var mocha = new Mocha({
        timeout: 60000,
        reporter: 'spec'
    })

    mocha.addFile('./node_modules/massah/index.js')

    mocha.run(function(failures) {
        process.exit(failures || 0)
    })
}

module.exports = function(yargs) {

    yargs.boolean('headless')

    helper.setOption('headless', yargs.argv.headless) 
    return run()   
}