var database = require('../services/database.js');
var async = require('async');
var dateService = require('./dateService');

module.exports.getReports = function(next) {
	database.query('SELECT * FROM reportWeek', function(err, rows, fields) {
		next(rows);
	});
}

var updateReport = function (row, type) {
	var query = 'UPDATE reportWeek SET ';
	if(type === 'feedback'){
		query += 'feedbacks=' + (row.feedbacks + 1);
	} else if(type === 'rating'){
		query += 'ratings=' + (row.ratings + 1);
	} else {
		console.log("err1")
		return;
	}
	query += ' WHERE id=' + row.id;
	database.query(query , function(err, rows, fields) {
		if(err){console.log(err);return;}
	});
}

var createReport = function (week, year, type) {
	var query = 'INSERT INTO reportWeek (week, year, feedbacks, ratings) VALUES (' + week + ', ' + year ;
	if(type === 'feedback'){
		query += ', 1, 0)';
	} else if(type === 'rating'){
		query += ', 0, 1)';
	} else {
		console.log("err2")
		return;
	}
	database.query(query , function(err, rows, fields) {
		if(err){console.log(err);return;}
	});
}


// @param type: 'feedback' or 'rating'
var addReport = function (type) {
	var week = dateService.getCurrentWeek();
	var year = dateService.getCurrentYear();
	database.query('SELECT * FROM reportWeek WHERE week=' + week + ' AND year=' + year, function(err, rows, fields) {
		if (rows.length > 0) {
			updateReport(rows[0], type);
		} else {
			createReport(week, year, type);
		}
	});
}

module.exports.addReportFeedback = function() {
	addReport('feedback');
}

module.exports.addReportRating = function() {
	addReport('rating');
}