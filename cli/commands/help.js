var glob = require('glob')
require('colours')

module.exports = function(yargs) {
    
    var specific = yargs.argv._[1]
    console.log('Help\n'.green)
    
    if (specific) {
        try {
            specific = specific.replace(/[^a-z]/i, '').toLowerCase()
            return require('./help/' + specific).advanced(yargs)
        } catch (e) {
            return console.log(
                ('Unknown command \'' + specific + '\', use \'massah help\' for commands').red
            )
        } 
    }
    console.log(
        'For more information on any command run: ' +
        'massah help <command>\n'.blue
    )
    glob.sync(__dirname + '/help/*').forEach(function(helpFile) {
        require(helpFile).basic(yargs)
    }, this)
    console.log()
}