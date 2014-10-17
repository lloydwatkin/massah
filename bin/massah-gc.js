var glob = require('glob')
  , colours = require('colours')

process.argv[2] = 'test'

if (false == glob.sync('./node_modules/massah')) {
    console.log('\nNo local massah installed\n\nTo install run:'.red + ' npm i --save-dev massah'.blue)
    process.exit(1)
}

require(process.cwd() + '/node_modules/massah/cli/index')
