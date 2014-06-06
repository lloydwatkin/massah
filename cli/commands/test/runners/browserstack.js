var uname = require('uname').uname
  , spawn = require('child_process').spawn
  , httpProxy = require('http-proxy')

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

var startApplication = function(options, done) {
    var bin = getBrowserStackLocalBin(options)
    var child = spawn(bin, [ options.browserstack.key, 'localhost,' + options.applicationPort + ',0', '-force' ])
    child.stderr.on('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
          console.log('Failed to start BrowserStack local daemon'.red)
          console.log(data.toString().red)
          process.exit(1)
      }
      console.log('Error with browserstack local: ' + data.toString().red)
    })
    child.stdout.on('data', function (data) { 
        console.log(data.toString()) 
        if (-1 !== data.toString().indexOf('Press Ctrl-C to exit')) {
            setTimeout(done, 5000)
        }
    })
    process.on('SIGINT', function() { 
        child.kill('SIGINT')
    })
    process.on('SIGHUP', function() { 
        child.kill('SIGHUP')
    })
    process.on('exit', function() {
        child.kill()
    })
}

module.exports = {
    startServer: startServer,
    addCapabilities: addCapabilities,
    startApplication: startApplication
}