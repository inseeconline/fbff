var express = require('express');
var router = express.Router();
var multer  = require('multer');
var csvParseService = require('../services/csvParseService');
var userService = require('../services/users');
var reportService = require('../services/reportService');
var async = require('async');

var done = false;
var filepathCSV;

router.get('/postCSV', function (req, res) {
	if (userService.isCoach(req)){
		res.render('postCSV', {userConnected: req.session.user});
	} else {
		res.redirect('/login');
	}
});

router.post('/postCSV',
	multer({ dest:  __dirname + '/uploads/',
	  rename: function (fieldname, filename) {
	    return filename+Date.now();
	  },
	  onFileUploadStart: function (file) {
	    console.log(file.originalname + ' is starting ...')
	  },
	  onFileUploadComplete: function (file) {
	    console.log(file.fieldname + ' uploaded to  ' + file.path)
	    filepathCSV = file.path;
	    done = true;
	  }
	}),
	function (req, res) {
		if (done == true) {
			csvParseService.importLogins(filepathCSV, function(reportObject){
				res.render('postCSVreturn', {userConnected: req.session.user, report: reportObject});
			});
		}
	}
);

router.get('/report', function (req, res) {
	if (userService.isCoach(req)){
		reportService.getReports(function(reports){
			res.render('report', {userConnected: req.session.user, reports: reports});
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
