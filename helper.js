var Yadda = require('yadda')
  , Webdriver = require('selenium-webdriver')
  , should = require('should')
  , headless = require('headless')
  , path = require('path')
  , uname = require('uname').uname
  , extend = require('extend')

require('webdriverjs-helper')

var testHelper = {}
try {
    testHelper = require(process.cwd() + '/test/helper')
} catch (error) {
    console.log('No project test/helper.js found')
}

var runOptions = {
   xvfbServer: null,
   seleniumServerPort: 4444,
   applicationPort: 3000,
   capabilities: {
       browser: 'firefox'   
   }
}
var runner = null

var getBrowser = function(done) {

    if (!runOptions.headless || runOptions.xvfbServer) return startServer(done)
    headless(function(error, childProcess, serverNumber) {
        setOption('xvfbServer', serverNumber)
        startServer(done)
    })
}

var addChromeDriverToPath = function() {
    var envPath = process.env.PATH.split(path.delimiter)
    var arch = ('x64' === process.arch) ? 'x86_64' : 'i386'
    var system = uname().sysname
    var chromeDriverPath = __dirname +
        '/resources/chromedriver/' +
        system + '-' + arch
    if (-1 !== envPath.indexOf(chromeDriverPath)) return
    envPath.push(chromeDriverPath)
    process.env.PATH = envPath.join(path.delimiter)
}

var setupRunner = function() {
    try {
        runner = require('./cli/commands/test/runners/' + runOptions.runner)
    } catch (e) {
        runner = require('./cli/commands/test/runners/vanilla')
    }
}

var addCapabilities = function(capabilities) {
    Object.keys(runOptions.capabilities).forEach(function(key) {
        capabilities.set(key, runOptions.capabilities[key])
    })
}

var startServer = function(done) {
        
    runOptions.capabilities.browser = runOptions.capabilities.browser || process.env.BROWSER || 'firefox'
    var capabilities = {}
    if ('chromedriver' === runOptions.capabilities.browser) {
        capabilities = Webdriver.Capabilities.chrome()
        addChromeDriverToPath()
        var browser = new Webdriver.Builder()
            .withCapabilities(capabilities)
            .build()
        return done(browser)
    }

    runner.startServer(capabilities, runOptions, function() {
        switch (runOptions.capabilities.browser) {
            case 'chrome':
            case 'phantomjs':
            case 'firefox':
            case 'opera':
            case 'ie':
                capabilities = Webdriver.Capabilities[runOptions.capabilities.browser]()
                addCapabilities(capabilities)
                runner.addCapabilities(capabilities, runOptions)
                break
            default:
                throw new Error('Unknown browser ' + runOptions.capabilities.browser)
        }
        var browser = new Webdriver.Builder()
            .usingServer(runOptions.serverAddress)
            .withCapabilities(capabilities)
            .build()
        browser.manage().timeouts().implicitlyWait(1000)
        done(browser)
    })
}

var startApplication = function(done) {
    if (!runner) setupRunner()

    var next = function() {
        if (runner.startApplication) {
            return runner.startApplication(runOptions, done)
        }
        done()
    }
    if (!testHelper.startApplication) return next()
    testHelper.startApplication(next)
}

var stopApplication = function(done) {
    if (!testHelper.stopApplication) return done()
    testHelper.stopApplication(function() {
        if (runner.stopApplication) {
            return runner.stopApplication(runOptions, done)
        }
        done()
    })
}

var getLibrary = function(dictionary) {
    var library = new Yadda.localisation.English.library(dictionary)
    return library
}

var setOption = function(name, value) {
    if (typeof name === 'object') {
        return runOptions = extend(runOptions, name)
    }
    runOptions[name] = value
}

module.exports = {
    Yadda: Yadda,
    getBrowser: getBrowser,
    application: {
        start: startApplication,
        stop: stopApplication,
        helper: testHelper,
        port: runOptions.applicationPort
    },
    Webdriver: Webdriver,
    getLibrary: getLibrary,
    setOption: setOption
}