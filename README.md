Massah
======

Making BDD style automated browser testing with node.js very simple. Get running automated browser tests within 5 minutes.

- [Introduction](#introduction)
- [Build Status](#build-status)
- [How to use](#how-to-use)
  - [Install](#install)
  - [Getting started](#getting-started)
  - [Running tests](#running-tests)
    - [Browsers](#browsers)
  - [Getting help](#getting-help)
- [Tests](#tests)
  - [Writing features](#writing-features)
  - [Writing steps](#writing-steps)
  - [Sharing data between tests](#sharing-data-between-tests)
  - [Starting / Stopping / Accessing your application from massah](#starting--stopping--accessing-your-application-from-massah)
    - [Starting your application](#starting-your-application)
    - [Stopping your application](#stopping-your-application)
    - [Accessing your application](#accessing-your-application)
- [Testing](#testing)
- [Name](#name)
- [Licence](#licence)

# Introduction

__Massah__ is essentially a wrapper around the following projects just making things a few steps easier for developers to run up a BDD-style automated browser testing setup.

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

To access cli tools you can install __Massah__ globally, or access them in ```./node_modules/.bin/massah*```.

## Getting started

```bash
massah init
```

This command initializes your project creating the following folder structure (if not present):

- test
  - features
  - steps
  - screenshots
  
__Features__ are where you write your BDD tests in plain text, __steps__ is where you  define these steps in code, and __screenshots__ are used to store screenshots of any failed test steps.

Additionally an empty helper file is installed at ```test/helper.js``` this is not necessary but can be used later.
  
## Running tests
  
```
massah test
```

You can set this to be used for `npm test` in your **package.json**.

### Browsers

__Massah__ is set up to use three different browser at present (adding more is rather simple). By default __Firefox__ is used. Browsers available to use at present are:

- Firefox (__firefox_)
- Phantomjs (_phantomjs___) **requires install of phantomjs**
- Chrome
  - Remotely (__chrome-remote__)
  - Using [chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver) (__chrome__) **must be in path**

To switch browser simply set an environment variable of __BROWSER__ set to one of the bold values above. For example,

```bash
BROWSER=chrome-remote massah test
```

Options:

- ```--headless```: Run tests headlessly

If you require additional browsers immediately please make a pull request or raise an issue.

## Getting help

```
massah help
```

# Tests

## Writing features
 
For an example of a feature file please see: [test/features/add-option.feature](https://github.com/lloydwatkin/massah/blob/master/test/features/add-option.feature)

After this please read the [Yadda guide](https://github.com/acuminous/yadda#step-2---write-your-first-scenario)

## Writing steps

For an example of a step definition file please see: [test/steps/url.js](https://github.com/lloydwatkin/massah/blob/master/test/steps/url.js)

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

Also see the helper functions in [webdriverjs-helper](https://github.com/surevine/webdriverjs-helper) for some extra usefulness.

## Sharing data between tests

As you can see from the example above data can be shared between test steps using the `params` object.  This object is cleaned with each new test scenario, but can be used for sharing data in between tests.

## Starting / Stopping / Accessing your application from Massah

Sometimes it makes sense to contain your application within __Massah__, e.g. to provide canned responses to API calls or to serve files to the browser.

In order to do this create a `helper.js` file in the __test__ folder of your application. This test helper will then be provided to each test as part of the __context__ object. From step definition files this is available at ```this.application.helper```. You may export as many or as few helper functions as you require.

### Starting your application

If your helper exports a ```startApplication``` method then this will be called and passed a callback parameter. The callback should be called when your application has completed starting up.

### Stopping your application

If your helper exports a ```stopApplication``` method then this will be called and passed a callback parameter. The callback should be called when your application has completed closing down.

### Accessing your application

If your helper exports a ```beforeScenario``` method then this will be called at the beginning of a scenario. This allows you 
to set up spies/mocks/etc as required for each test.

The first argument to this method is the __annotations__ object 
which contains any annotations added to the feature or scenario. The second argument is the __context__ object allowing you to set 
data which will be available to each of the test steps. The context object exists as follows: 

```javascript
{
    driver: /* browser */
    params: {}  /* Location to store shared data */
    application: /* The exports from your application test helper */
}
```

For an example of annotations being used please see the annotation override test in __Massah__.

# Testing

To test __Massah__, simply run

```
npm test
```

From the command line. __Massah__ uses itself to test itself.

# Name

The name __Massah__ comes from the fantasy fiction novel called 'The Torah' and its cumulative sequel 'The Bible'. During the chapter titled 'Exodus' the Israelite people are being led out of Egypt. At one point they begin to worry about their lack of water/supplies/etc. Their leader, a character named Moses, gets a little miffed at them for daring to question the wisdom of the "sky man" for sending them on the journey.  This place was then named __Massah__ which basically means **to test**.

# Licence

MIT
