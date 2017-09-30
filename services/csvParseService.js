var fs = require('fs');
var csv = require('csv');
var async = require('async');
var usersService = require('./users');

// parse a CSV file containing user accounts
// import (create or update) them in the database
// callbacks next with a reportObject
// @param filepathCSV : full path to the CSV to be parsed
// @param next : callback function
module.exports.importLogins = function(filepathCSV, next) {
    var reportObject = {err: [], create: [], update: []};
    fs.readFile(filepathCSV, "utf8", function (error, data) {
        data = data.replace(/;/g,',');
        csv.parse(data, {delimiter: ','}, function(err, data){
            if(err){
                reportObject.err.push(err);
                next(reportObject);
                return;
            }
            async.each(data, function (dataRow, callback) {
                if (dataRow.length === 7) {
                    usersService.addUser(dataRow, reportObject, callback);
                } else {
                    reportObject.err.push("Erreur parser CSV: nombre d'arguments incorrect, trouvés:" + dataRow.length + ", attendus: 7; pour le login: " + dataRow[0]);
                    callback(null);
                }
            }, function() {
                next(reportObject);
            });
        });
    });
}

