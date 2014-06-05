var Yadda = require('yadda')
  , Webdriver = require('selenium-webdriver')
  , should = require('should')
  , headless = require('headless')
  , path = require('path')
  , uname = require('uname').uname

require('webdriverjs-helper')

var testHelper = {}
try {
    testHelper = require(process.cwd() + '/test/helper')
} catch (error) {
    console.log('No project test/helper.js found')
}

var runOptions = {
   xvfbServer: null,
   port: 4444
}

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

var startServer = function(done) {

    var browserToUse = runOptions.browser || process.env.BROWSER || 'firefox'
    var browser, capabilities
    switch (browserToUse) {
        case 'chrome':
        case 'phantomjs':
        case 'firefox':
        case 'opera':
            capabilities = Webdriver.Capabilities[browserToUse]()
            break
        case 'chromedriver':
            capabilities = Webdriver.Capabilities.chrome()
            addChromeDriverToPath()
            var browser = new Webdriver.Builder()
                .withCapabilities(capabilities)
                .build()
            done(browser)
            return
        default:
            throw new Error('Unknown browser ' + browserToUse)
    }
    
    var runner = null
    try {
        runner = require('./cli/commands/test/runners/' + runOptions.runner)
    } catch (e) {
        runner = require('./cli/commands/test/runners/vanilla')
    }
    
    runner.startServer(capabilities, runOptions, function() {
        var browser = new Webdriver.Builder()
            .usingServer(runOptions.serverAddress)
            .withCapabilities(capabilities)
            .build()
        browser.manage().timeouts().implicitlyWait(1000)
        done(browser)
    })
}

var startApplication = function(done) {
    if (!testHelper.startApplication) return done()
    testHelper.startApplication(done)
}

var stopApplication = function(done) {
    if (!testHelper.stopApplication) return done()
    testHelper.stopApplication(done)
}

var getLibrary = function(dictionary) {
    var library = new Yadda.localisation.English.library(dictionary)
    return library
}

var setOption = function(name, value) {
    if (typeof name === 'object') {
        return runOptions = name
    }
    runOptions[name] = value
}

module.exports = {
    Yadda: Yadda,
    getBrowser: getBrowser,
    application: {
        start: startApplication,
        stop: stopApplication,
        helper: testHelper
    },
    Webdriver: Webdriver,
    getLibrary: getLibrary,
    setOption: setOption
}