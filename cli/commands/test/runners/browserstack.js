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
    if (typeof options.browserstack.useLocalBinary === 'undefined') {
       options.browserstack.useLocalBinary = true
    }
    done()
}

var addCapabilities = function(capabilities, options) {
    capabilities.set('browserstack.user', options.browserstack.user)
    capabilities.set('browserstack.key', options.browserstack.key)
    capabilities.set('browserstack.local', options.browserstack.useLocalBinary)
}

var beforeSuite = function(options, done) {
    if (options.browserstack.useLocalBinary === false) {
      done()
      return
    }
    var bin = getBrowserStackLocalBin(options)
    var identifier = Math.random()
        .toString(36)
        .toLowerCase()
        .replace(/[^a-z]+/g, '')

    if (!options.browserstack.key) {
        console.log('Missing Browserstack key'.red)
        process.exit(1)
    }
    var binOptions = [
        ' -only ',
        /* '-localIdentifier="' + identifier + '" ', */
        options.browserstack.key,
        'localhost,' + options.applicationPort + ',0'
    ]
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
