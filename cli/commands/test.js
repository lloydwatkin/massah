var glob = require('glob')
  , colours = require('colours')
  , Mocha = require('mocha')

module.exports = function(yargs) {

    var mocha = new Mocha({
        timeout: 60000,
        reporter: 'spec'
    })

    mocha.addFile('./node_modules/massah/index.js')

    mocha.run(function(failures) {
        process.exit(failures || 0)
    })
}