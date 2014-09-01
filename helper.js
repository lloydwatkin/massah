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
        if (!runOptions.runner) runOptions.runner = 'vanilla'
        runner = require('./cli/commands/test/runners/' + runOptions.runner)
    } catch (e) {
        console.log('Can not load runner \'' + runOptions.runner + '\' reverting to vanilla runner'.red)
        console.log(e.toString().red)
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
        switch (runOptions.capabilities.browser.toLowerCase()) {
            case 'chrome':
            case 'phantomjs':
            case 'firefox':
            case 'opera':
            case 'ie':
            case 'safari':
                capabilities = Webdriver.Capabilities[runOptions.capabilities.browser.toLowerCase()]()
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
        browser.window().maximize()
        browser.manage().timeouts().implicitlyWait(1000)
        done(browser)
    })
}

var beforeFeature = function(done) {
    if (!runner) setupRunner()

    var next = function() {
        if (runner.beforeFeature) {
            return runner.beforeFeature(runOptions, done)
        }
        done()
    }
    if (!testHelper.beforeFeature) return next()
    testHelper.beforeFeature(next)
}

var afterFeature = function(done) {
    var next = function() {
        if (testHelper.afterFeature) {
            return testHelper.afterFeature(done)
        }
        done()
    }
    if (!runner.afterFeature) return next()
    runner.afterFeature(function() {
        next()
    })
}

var beforeSuite = function(done) {
    if (!runner) setupRunner()

    var next = function() {
        if (runner.beforeSuite) {
            return runner.beforeSuite(runOptions, done)
        }
        done()
    }
    if (!testHelper.beforeSuite) return next()
    testHelper.beforeSuite(next)
}

var afterSuite = function(done) {
    var next = function() {
        if (testHelper.afterSuite) {
            return testHelper.afterSuite(done)
        }
        done()
    }
    if (!runner.afterSuite) return next()
    runner.afterSuite(function() {
        next()
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

var getOption = function(name) {
    return runOptions[name]
}

module.exports = {
    Yadda: Yadda,
    getBrowser: getBrowser,
    application: {
        start: beforeFeature,
        stop: afterFeature,
        helper: testHelper,
        port: runOptions.applicationPort,
        before: beforeSuite,
        after: afterSuite
    },
    Webdriver: Webdriver,
    getLibrary: getLibrary,
    setOption: setOption,
    getOption: getOption
}
