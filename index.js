var helper = require('./helper')
  , Yadda = helper.Yadda
  , fs = require('fs')
  , glob = require('glob')

Yadda.plugins.mocha.AsyncStepLevelPlugin.init()

var webdriver = helper.Webdriver
var driver, application, libraries

var loadStepDefinitions = function() {
    var libraries = []
    glob.sync(process.cwd() + '/test/steps/**/*.js', { cwd: __dirname }).forEach(function(stepDefinitionFile) {
        libraries.push(require(stepDefinitionFile.replace('.js', '')))
    })
    return libraries
}

var stepDefinitions = loadStepDefinitions()

new Yadda.FeatureFileSearch(process.cwd() + '/test/features').each(function(file) {
    featureFile(file, function(feature) {
  
        scenarios(feature.scenarios, function(scenario) {
            var stepNumber = 0
            var context = {}
            steps(scenario.steps, function(step, done) {
                if (0 === stepNumber) {
                    context = { 
                        driver: driver, 
                        application: application,
                        params: {}
                    }

                   // if (scenario.annotations.events) {
   
                }
                executeInFlow(function() {
                    new Yadda.Yadda(
                        stepDefinitions,
                        context
                    ).yadda(step)
                }, done)
                ++stepNumber
            })
        })

        afterEach(function(done) {
            takeScreenshotOnFailure(this.currentTest)
            done()
        })

        after(function(done) {
            driver.quit().then(function() {
                helper.application.stop(done, application)
            })
        })
        
        before(function(done) {
            helper.application.start(function(app) {
                application = app
                helper.getBrowser(function(browser) {
                  driver = browser
                  done()
                })
            })
        })
    })
})

function executeInFlow(fn, done) {
    webdriver.promise.controlFlow().execute(fn).then(function() {
        done()
    }, done)   
}

function takeScreenshotOnFailure(test) {
    if (test && (test.status !== 'passed')) {
        var path = process.cwd() + '/test/screenshots/' +
            test.title.replace(/\W+/g, '_').toLowerCase() + '.png'
        driver.takeScreenshot().then(function(data) {
            fs.writeFileSync(path, data, 'base64')
        })
    }
}