var startServer = function(capabilities, options, done) {
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer
    if (options.xvfbServer) process.env.DISPLAY = ':' + options.xvfbServer
    var server = new SeleniumServer(
        __dirname + '/../../../../resources/selenium-server-standalone-2.43.1.jar',
        { port: options.seleniumServerPort }
    )
    server.start().then(function() {
        options.serverAddress = server.address()   
        done()
    })
}

var addCapabilities = function(capabilities, options) {}
                        
module.exports = {
    startServer: startServer,
    addCapabilities: addCapabilities
}