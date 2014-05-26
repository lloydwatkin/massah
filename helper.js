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
        'resources/selenium-server-standalone-2.39.0.jar',
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
    done()
}

var stopApplication = function(done, application) {
    done()
}

var getLibrary = function(dictionary) {
    var library = new Yadda.localisation.English.library(dictionary)
    return library
}

module.exports = {
    Yadda: Yadda,
    getBrowser: getBrowser,
    application: {
        start: startApplication,
        stop: stopApplication
    },
    Webdriver: Webdriver,
    getLibrary: getLibrary
}