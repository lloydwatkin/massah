var helper = require('./helper')
  , Yadda = helper.Yadda
  , fs = require('fs')
  , glob = require('glob')

Yadda.plugins.mocha.AsyncStepLevelPlugin.init()

var driver, libraries

var loadStepDefinitions = function() {
    var libraries = []
    var stepsPath = process.cwd() + '/test/steps/**/*.js'
    var options = { cwd: __dirname }
    glob.sync(stepsPath, options).forEach(function(stepDefinitionFile) {
        libraries.push(require(stepDefinitionFile.replace('.js', '')))
    })
    return libraries
}

var stepDefinitions = loadStepDefinitions()

var featuresPath = process.cwd() + '/test/features'
new Yadda.FeatureFileSearch(featuresPath).each(function(file) {
    featureFile(file, function(feature) {
        scenarios(feature.scenarios, function(scenario) {
            var stepNumber = 0
            var context = {}
            steps(scenario.steps, function(step, done) {
                if (0 === stepNumber) {
                    context = { 
                        driver: driver, 
                        params: {},
                        application: helper.application
                    }
                    if (helper.application.helper.beforeScenario) {
                        helper.application.helper.beforeScenario(
                            scenario.annotations, context
                        )
                    }  
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
    helper.Webdriver.promise.controlFlow().execute(fn).then(function() {
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