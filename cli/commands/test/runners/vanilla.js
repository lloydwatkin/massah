var startServer = function(capabilities, options, done) {
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer
    if (options.xvfbServer) process.env.DISPLAY = ':' + options.xvfbServer
    var server = new SeleniumServer(
        __dirname + '/../../../../resources/selenium-server-standalone-2.39.0.jar',
        { port: options.port }
    )
    server.start().then(function() {
        options.serverAddress = server.address()   
        done()
    })
}
                        
module.exports = {
    startServer: startServer
}