var http = require('http')
  , fs = require('fs')
  , index = fs.readFileSync(__dirname + '/resources/index.html')

var application = null
  , port = 3000

var beforeSuite = function(done) {
    application = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(index)
    })
    application.listen(port)
    process.on('exit', function() {
        try { 
            application.close()
        } catch(error) {}
    })
    done()
}

var afterSuite = function(done) {
    application.close()
    done()
}

var beforeScenario = function(annotations, context) {
    if (annotations.option) {
        context.params.newOption = annotations.option
    }
}

module.exports = {
    beforeSuite: beforeSuite,
    afterSuite: afterSuite,
    beforeScenario: beforeScenario,
    port: port
}
