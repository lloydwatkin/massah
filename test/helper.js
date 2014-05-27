var http = require('http')
  , fs = require('fs')
  , index = fs.readFileSync(__dirname + '/resources/index.html')

var application = null
  , port = 3000

var startApplication = function(done) {
    application = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(index)
    })
    application.listen(port)
    done()
}

var stopApplication = function(done) {
    application.close()
    done()
}

module.exports = {
    startApplication: startApplication,
    stopApplication: stopApplication,
    port: port
}
