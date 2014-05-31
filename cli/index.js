var yargs = require('yargs')
  , colours = require('colours')

var command = yargs.argv._[0]

console.log('\n - Welcome to Massah\n'.blue)

try {
    if (!command) command = 'help'
    require('./commands/' + command)(yargs)
} catch (e) {
    console.log(('Command \'' + command + '\' not found, use \'massah help\' for commands').red)
}