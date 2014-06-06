module.exports = function(yargs) {
    
    yargs.string('browserstack-user')
    yargs.string('browserstack-key')
    
    return {
        /* runner: 'browserstack', */
        /* browser: 'chromedriver', */
        /* applicationPort: 3000, */
        headless: false,
        browserstack: { 
            user: yargs.argv['browserstack-user'] || process.env.BROWSERSTACK_USER,
            key: yargs.argv['browserstack-key'] || process.env.BROWSERSTACK_KEY
        },
    }

}