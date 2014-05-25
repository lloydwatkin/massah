var Yadda = require('yadda')
  , Webdriver = require('selenium-webdriver')
  , testHelper = require(process.cwd() + '/test/helper')
  , should = require('should')
require('webdriverjs-helper')

var port = 3001

var getBrowser = function(done) {
    var browserToUse = process.env.BROWSER || 'chrome'
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

       /* var FirefoxProfile = require('firefox-profile')
        var profile = new FirefoxProfile()
        profile.setPreference('network.http.prompt-temp-redirect', false)
        profile.setPreference('app.update.silent', true)
        profile.encoded(function(profile) {*/
            var browser = new Webdriver.Builder()
                .usingServer(server.address())
                .withCapabilities(capabilities)
                .build()
           // capabilities['firefox_profile'] = profile*/
            browser.manage().timeouts().implicitlyWait(10000)
            done(browser)
       // })
    })
}

var startApplication = function(done) {
    return done()
    options = {
       debug: false,
       silent: ('development' === process.env.NODE_ENV) ? false : true,
       site: 'http://localhost:' + port
   }
   var app = require(process.cwd() + '/test/helper')

   app.server.listen(port, function() {
      done(app)
   })
}

var stopApplication = function(done, application) {
    done()
    //application.server.close(done)
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
        stop: stopApplication,
        port: port
    },
    Webdriver: Webdriver,
    getLibrary: getLibrary
}
