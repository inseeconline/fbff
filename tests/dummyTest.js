var testCase  = require('nodeunit').testCase;

module.exports = testCase({
    "Test assert true": function(test) {
        test.ok(true);
        test.done();
    }
});