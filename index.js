var helper = require('./helper')
  , Yadda = helper.Yadda
  , fs = require('fs')
  , glob = require('glob')
  , log = require('debug')('massah-index')

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
        
        if (false === runThisTest(feature.annotations, feature.title)) return
        
        scenarios(feature.scenarios, function(scenario) {
            
            if (false === runThisTest(scenario.annotations, scenario.title)) return
            
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
            afterFeature(function() {
                if (global && global.gc) {
                    log('Garbage collecting')
                    global.gc()
                }
                done()
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

function stringMatch(match, annotations, title) {
    var index = title.toLowerCase().indexOf(match.grep.toLowerCase())
    var annotationMatch = false
    Object.keys(annotations).forEach(function(annotation) {
        if ('@' + annotation === match.grep) annotationMatch = true
    })
    if (!match.invert) {
        if ((index !== -1) || annotationMatch) return true
        return false
    }
    if ((index !== -1) || annotationMatch) return false
    return true
}

function regexMatch(match, annotations, title) {
    var titleMatch = title.match(match.grep)
    var annotationMatch = false
    Object.keys(annotations).forEach(function(annotation) {
        if (annotation.match(match.grep)) annotationMatch = true
    })
    if (!match.invert) {
        if (titleMatch || annotationMatch) return true
        return false
    }
    if (titleMatch || annotationMatch) return false
    return true
}

function runThisTest(annotations, title) {
    var match = helper.getOption('match')
    if (!match || !match.grep) return true

    if (typeof match.grep === 'string') {
        return stringMatch(match, annotations, title)
    }
    return regexMatch(match, annotations, title)
}

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

var afterFeature = function(done) {
    if (!driver)
        return helper.application.stop(done)
    driver.quit().then(function() {
        helper.application.stop(done)
    })
}

process.on('SIGINT', function() {
    afterFeature(function() {
        process.exit(1)
    })
})
process.on('SIGTERM', function() {
    afterFeature(function() {
        process.exit(1)
    })
})