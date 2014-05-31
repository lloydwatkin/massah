var basic = function(yargs) {
    var description = '' +
        '- massah init: '.blue +
        'Set up test folders ready for creating automated tests'
    console.log(description)
}

var advanced = function(yargs) {
    var description = '' +
        '    - massah init\n\n'.blue +
        'The initialise command creates a set of directories ' +
        'in your project ready \nfor adding your test features ' +
        'and scenarios as well as implementation steps.\n\n' +
        'It will also add a basic test helper.\n\n' +
        'Should these files already exist then they will not ' +
        'be overwritten.\n'
    console.log(description)
}

module.exports = { advanced: advanced, basic: basic }