var fs = require('fs')
  , util = require('util')

var paths = [
    '/test',
    '/test/features',
    '/test/steps',
    '/test/screenshots'
]
    
var maxPathLength = null
var templateFolder = __dirname + '/../../resources'
var helperFile = process.cwd() + '/test/helper.js'

var longestPath = function() {
    var length = 0
    paths.forEach(function(path) {
        if (path.length > length) length = path.length
    })
    maxPathLength = length
}

var printablePath = function(path) {
    if (null === maxPathLength) longestPath()
    var padding = ''
    if (path.length !== maxPathLength)
        padding = new Array(maxPathLength - path.length + 1).join(' ')
    return path + ': ' + padding 
}
        
var createDirectories = function() {
    paths.forEach(function(path) {
        util.print(printablePath(path).blue)
        if (true == fs.existsSync(process.cwd() + path)) {
            console.log('Directory already exists'.yellow)
        } else {
            try {
                fs.mkdirSync(process.cwd() + path)
                console.log('Successfully created'.green)
            } catch (e) {
                console.log(('ERROR could not create - ' + e.message).red)
            }
        }
    })
}

var createHelperFile = function() {
    if (null === maxPathLength) longestPath()
    var printable  = 'Helper file: '
    var padding    = ''
    if (printable.length !== maxPathLength)
        padding = new Array(maxPathLength - printable.length + 3).join(' ')
    util.print((printable + padding).blue)
    if (true == fs.existsSync(helperFile)) {
        console.log('Helper already exists'.yellow)
    } else {
        try {
            fs.createReadStream(templateFolder + '/helper.js')
                .pipe(fs.createWriteStream(helperFile))
            fs.createReadStream(templateFolder + '/.gitkeep')
                .pipe(fs.createWriteStream(process.cwd() + '/test/screenshots/.gitkeep'))
            console.log('Successfully created'.green)
        } catch (e) {
            console.log(('ERROR could not create - ' + e.message).red)
        }
    }
}

module.exports = function(yargs) {
      
    var specific = yargs.argv._[1]
    console.log('Initialize\n'.green.underline)
    
    createDirectories()
    createHelperFile()
}