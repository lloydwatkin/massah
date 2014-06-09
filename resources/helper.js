var beforeFeature = function(done) {
    done()
}

var afterFeature = function(done) {
    done()
}

var beforeSuite = function(done) {
    done()   
}

var afterSuite = function(done) {
    done()
}

var beforeScenario = function(annotations, context) {}

module.exports = {
    beforeFeature: beforeFeature,
    afterFeature: afterFeature,
    afterFeature: beforeScenario,
    beforeSuite: beforeSuite,
    afterSuite: afterSuite
}
