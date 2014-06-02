var Yadda = require('yadda')
  , Webdriver = require('selenium-webdriver')
  , should = require('should')
  , headless = require('headless')

require('webdriverjs-helper')

var testHelper = {}
try {
    testHelper = require(process.cwd() + '/test/helper')
} catch (error) {
    console.log('No project test/helper.js found')
}

var runOptions = {}

var getBrowser = function(done) {

    if (!runOptions.headless) return startServer(done)
    headless(function(error, childProcess, serverNumber) {
        console.log('Xvfb running on server number ' + serverNumber)
        console.log('Xvfb PID ' + childProcess.pid)
        startServer(done, serverNumber)
    })
}

var startServer = function(done, display) {

    var browserToUse = runOptions.browser || process.env.BROWSER || 'firefox'
    var browser, capabilities
    switch (browserToUse) {
        case 'phantomjs':
            capabilities = Webdriver.Capabilities.phantomjs()
            break
        case 'firefox':
            capabilities = Webdriver.Capabilities.firefox()
            break
        case 'chrome-remote':
            capabilities = Webdriver.Capabilities.chrome()
            break  
        case 'chrome':
        default:
            capabilities = Webdriver.Capabilities.chrome()
            var browser = new Webdriver.Builder()
                .withCapabilities(capabilities)
                .build()
            done(browser)
            return
    }

    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer
    process.env.DISPLAY = ':' + display
    var server = new SeleniumServer(
        __dirname + '/resources/selenium-server-standalone-2.39.0.jar',
        { port: 4444 }
    )
    server.start().then(function() {
        var browser = new Webdriver.Builder()
            .usingServer(server.address())
            .withCapabilities(capabilities)
            .build()
        browser.manage().timeouts().implicitlyWait(10000)
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