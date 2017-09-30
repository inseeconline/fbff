var testCase  = require('nodeunit').testCase;
var userCompService = require('../services/userCompService.js');

module.exports = testCase({
    "Test alphabetical order on 'nom' field": function(test) {
        var compare = userCompService.alphabeticalCompareOnNom;
        var users = [
            {id:0, nom:'aa'},
            {id:1, nom:'ab'},
            {id:2, nom:'bb'}
        ]
        test.ok(compare(users[0],users[1]) < 0);
        test.ok(compare(users[1],users[0]) > 0);
        test.ok(compare(users[1],users[1]) === 0);
        test.done();
    }
});