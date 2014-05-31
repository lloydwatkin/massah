var yargs = require('yargs')
  , colours = require('colours')

var command = yargs.argv._[0]

console.log('\n - Welcome to Massah\n'.blue)

try {
    if (!command) command = 'help'
    command = !command ? 'help' : command.replace(/[^a-z]/i, '').toLowerCase()
    require('./commands/' + command)(yargs)
} catch (e) {
    var message = 'Command \'' + command + '\' not found, use ' +
        '\'massah help\' for commands'
    console.log(message.red)
    console.log(e)
}