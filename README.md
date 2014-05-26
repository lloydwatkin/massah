massah
======

Making BDD style automated browser testing with node.js very simple...

`massah` is essentially a wrapper around the following projects just making things a few steps easier for developers to run up a BDD-style automated browser testing setup.

- [Yadda](https://github.com/acuminous/yadda)
- [Mocha](http://visionmedia.github.io/mocha/)
- [Should](https://github.com/visionmedia/should.js/)
- [selenium-webdriver](https://code.google.com/p/selenium/)
- [webdriverjs-helper](https://github.com/surevine/webdriverjs-helper)

# Build status

[![Build Status](https://travis-ci.org/lloydwatkin/massah.svg)](https://travis-ci.org/lloydwatkin/massah)

# How to use
  ## Install
  
```
npm i --save-dev massah
```

  ## Set up
  
In your project then create the following folder structure:

- test
  - features
  - steps
  - screenshots
  
__Features__ are where you write your BDD tests in plain text, __steps__ is where you  define these steps in code, and __screenshots__ are used to store screenshots of any failed test steps.

  ## Running tests
  
```
./node_modules/massah/bin/massah
```

You can set this to be used for `npm test` in your **package.json**.

# Tests

  ## Writing features
 
For an example of a feature file please see: [test/features/search.feature](https://github.com/lloydwatkin/massah/blob/master/test/features/search.feature)

After this please read the [Yadda guide](https://github.com/acuminous/yadda#step-2---write-your-first-scenario)

  ## Writing steps

For an example of a feature file please see: [test/steps/url.ks](https://github.com/lloydwatkin/massah/blob/master/test/steps/url.js)

After this please read the [Yadda guide](https://github.com/acuminous/yadda#step-3---implement-the-step-library)
 
All step files are loaded at once before the test suite starts meaning that defined steps can be shared.

An example step file would appear as follows:

```javascript
var massah = require('massah/helper')

module.exports = (function() {
    var library = massah.getLibrary()
        .given('I visit http://google.co.uk', function() {
            this.driver.get('http://google.co.uk)
        })
        .when('I search for \'(.*)\'', function(searchTerm) {
            this.params.searchTerm = searchTerm
            this.driver.input('input[name=q]').enter(searchTerm)
        })
        .then('I expect to see the results page', function() {
            var params = this.params
            this.driver.currentUrl(function(currentUrl) {
                currentUrl.should.include(params.searchTerm)
            })
        })
    
    return library
})()
```

  ## Sharing data between tests

As you can see from the example above data can be shared between test steps using the `params` object.  This object is cleaned with each new test scenario, but can be used for sharing data in between tests.

# Name

The name `massah` comes from the fantasy fiction novel called 'The Torah', and its cumulative sequel 'The Bible'. During the chapter titled 'Exodus' the Israelite people are being led out of Egypt. At one point they begin to worry about their lack of water/supplies/etc. Their leader a character named Moses gets a little miffed at them for daring to question the wisdom of the "sky man" for sending them on the journey.  This place was then named `Massah` which basically means __to test__.

# Licence 

MIT