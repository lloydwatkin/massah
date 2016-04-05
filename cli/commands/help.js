var glob = require('glob')
require('colours')

module.exports = function(yargs) {

    var specific = yargs.argv._[1]
    console.log('Help\n'.green.underline)

    if (specific) {
        try {
            specific = specific.replace(/[^a-z]/i, '').toLowerCase()
            var command = require('./help/' + specific)
            console.log(('    - massah ' + command.name + '\n').blue)
            console.log(command.description)
            return
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
        command = require(helpFile)
        console.log((command.name + ': ').blue + command.summary)
    }, this)
    console.log()
}
