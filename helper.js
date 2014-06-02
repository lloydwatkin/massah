var Yadda = require('yadda')
  , Webdriver = require('selenium-webdriver')
  , should = require('should')
require('webdriverjs-helper')

var testHelper = {}
try {
    testHelper = require(process.cwd() + '/test/helper')
} catch (error) {
    console.log('No project test/helper.js found')
}

var runOptions = {}

var getBrowser = function(done) {
    var browserToUse = process.env.BROWSER || 'firefox'
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
            var browser = new Webdriver.Builder()
                .withCapabilities(Webdriver.Capabilities.chrome())
                .build()
            done(browser)
            return
    }

    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer
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