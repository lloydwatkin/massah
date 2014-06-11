var uname = require('uname').uname
  , spawn = require('child_process').spawn

var childProcess = null

var getBrowserStackLocalBin = function(options) {
    var arch = ('x64' === process.arch) ? 'x86_64' : 'i386'
    var system = uname().sysname
    return __dirname +
        '/../../../../resources/browserstack/' +
        system + '-' + arch +
        '/BrowserStackLocal'
}

var startServer = function(capabilities, options, done) {
    options.serverAddress = 'http://hub.browserstack.com/wd/hub'
    done()
}

var addCapabilities = function(capabilities, options) {
    capabilities.set('browserstack.user', options.browserstack.user)
    capabilities.set('browserstack.key', options.browserstack.key)
    capabilities.set('browserstack.local', true)
}

var beforeSuite = function(options, done) {
    var bin = getBrowserStackLocalBin(options)
    var binOptions = [
        options.browserstack.key,
        'localhost,' + options.applicationPort + ',0',
        '-localIdentifier="' + identifier + "'   
    ]
    var identifier = Math.random().toString(36).replace(/[^a-z]+/g, '')
    childProcess = spawn(bin, binOptions)
    childProcess.stderr.on('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
          console.log('Failed to start BrowserStack local daemon'.red)
          console.log(data.toString().red)
          process.exit(1)
      }
      console.log('Error with browserstack local: ' + data.toString().red)
    })
    childProcess.stdout.on('data', function (data) { 
        if (-1 !== data.toString().indexOf('Press Ctrl-C to exit')) {
            setTimeout(done, options.browserstack['local-wait'] || 5000)
        }
        if (-1 !== data.toString().indexOf('Error:')) {
            console.log('Could not start browserstacklocal'.red)
            console.log(data.toString().red)
            process.exit(1)
        }
    })
    process.on('SIGINT', function() { 
        childProcess.kill('SIGINT')
    })
    process.on('SIGHUP', function() { 
        childProcess.kill('SIGHUP')
    })
    process.on('exit', function() {
        childProcess.kill()
    })
}

var afterSuite = function(done) {
    if (!childProcess) return done()
    childProcess.on('close', function() {
        done()
    })
    childProcess.kill()
}

module.exports = {
    startServer: startServer,
    addCapabilities: addCapabilities,
    beforeSuite: beforeSuite,
    afterSuite: afterSuite
}