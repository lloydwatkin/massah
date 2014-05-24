var Yadda = require('yadda')
  , Webdriver = require('selenium-webdriver')
  , testHelper = require(process.cwd() + '/test/helper')
require('webdriverjs-helper')

var port = 3001

var getLibrary = function(dictionary) {
    var library = new Yadda.localisation.English.library(dictionary)
    return library
}

var user = {
    jid: 'user@example.com',
    password: 'password',
    domain: 'example.com'
}

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
    options = {
       debug: false,
       silent: ('development' === process.env.NODE_ENV) ? false : true,
       site: 'http://localhost:' + port
   }
   var app = require(process.cwd() + '/test/helper')
   app.start(
   app.server.listen(port, function() {
      done(app)
   })
}

var stopApplication = function(done, application) {
    application.server.close(done)
}

var error = {
    notFound: {
        type: 'cancel',
        condition: 'item-not-found'
    },
    serviceUnavailable: {
        type: 'cancel',
        condition: 'service-unavailable'
    },
    unknownError: {
        type: 'wait',
        condition: 'internal-server-error'
    }
}

var errorUser = function(node, callback) {
    switch (node) {
        case '/user/item-not-found@example.com/posts':
            callback(error.notFound)
            return true
        case '/user/service-unavailable@example.com/posts':
            callback(error.serviceUnavailable)
            return true
        case '/user/unknown-error@example.com/posts':
            callback(error.unknownError)
            return true
    }
    return false
}

var getResource = exports.getResource = exports.getResource = function(file) {
    return require(__dirname + '/resources/data/' + file)
}

var getNodeSlug = exports.getNodeSlug = function(node) {
  return node.substr(6).replace('@', '-at-').replace('/', '.') + '.json'
}

module.exports = {
    Yadda: Yadda,
    getLibrary: getLibrary,
    getBrowser: getBrowser,
    application: {
        start: startApplication,
        stop: stopApplication,
        port: port
    },
    Webdriver: Webdriver,
    utils: {
        errorUser: errorUser,
        getNodeSlug: getNodeSlug,
        getResource: getResource
    },
    user: user
}
