var database = require('../services/database.js');
var async = require('async');
var dateService = require('./dateService');
var userCompService = require('./userCompService')

// get all the participants of the cohorte in param
// if cohorte = Nnll then get all the participants whatever their cohorte is
module.exports.getParticipantsOfYourCohorte = function (cohorte, callback) {
	var queryGetUser = 'SELECT id, nom, prenom, email, poste, cohorte, picture FROM user ';
	if (cohorte) {
		queryGetUser += 'WHERE isCoach=0 AND cohorte=' + database.escape(cohorte);
	} else {
		queryGetUser += 'WHERE isCoach=0';
	}
	console.log(queryGetUser)
	database.query(queryGetUser, function(err, rows, fields) {
		if (err) {console.log(err);return null}
		var usersObject = {};
		for (var i = rows.length - 1; i >= 0; i--) {
			usersObject[rows[i].id] = rows[i]
			rows[i].receivedPertinent = 0;
			rows[i].receivedInspiring = 0;
		};
		database.query('SELECT * FROM feedback', function(err, rowsFeedback, fields) {
			if (err) {console.log(err);return null}
			for (var i = rowsFeedback.length - 1; i >= 0; i--) {
				userId = rowsFeedback[i].fromUser;
				if (usersObject[userId]) { // test whether usersObject[userId] exists (the userId may be in another cohorte)
					usersObject[userId].receivedPertinent += rowsFeedback[i].isPertinent;
					usersObject[userId].receivedInspiring += rowsFeedback[i].isInspiring;
				}
			};
			rows.sort(userCompService.alphabeticalCompareOnNom);
			callback(rows);
		});
	});
}

// get a user whose id is userID and with the feedback sent by userIdFromFeedback
module.exports.getUserWithFeedbackSent = function (userId, userIdFromFeedback, next) {
	var user;
	var _getRatings = function(callback){
		database.query('SELECT * FROM feedback WHERE fromUser=' + user.id, function(err, rowsFeedback, fields) {
			for (var i = rowsFeedback.length - 1; i >= 0; i--) {
				user.receivedPertinent += rowsFeedback[i].isPertinent;
				user.receivedInspiring += rowsFeedback[i].isInspiring;
			};
			callback(null);
		});
	}

	var _getSentFeedback = function(callback){
		database.query('SELECT * FROM feedback WHERE toUser=' + userId +' AND fromUser='+ userIdFromFeedback +' ORDER BY createdAt DESC', function(err, rowsFeedback, fields) {
			for (var i = rowsFeedback.length - 1; i >= 0; i--) {
				rowsFeedback[i].createdAtFormated = dateService.formatDate(rowsFeedback[i].createdAt);
			};
			user.feedbacksSent = rowsFeedback;
			callback(null)
		});
	}
	async.series([
		function(callback) {
			getUser(userId, function(_user){
				user = _user;
				callback(null)
			})
		},
		_getRatings,
		_getSentFeedback
	], function(err){
		next(user);
	})
}


var getUser = function(userId, next){
	database.query('SELECT id, nom, prenom, email, poste, cohorte, personalProject, selfDescription, picture FROM user WHERE id=' + userId, function(err, rows, fields) {
		if (err) {console.log(err);return null}
		if (rows.length == 0) {return null}
		rows[0].receivedPertinent = 0;
		rows[0].receivedInspiring = 0;
		rows[0].feedbacksReceived = [];
		rows[0].feedbacksSent = [];
		next(rows[0]);
	});
}
module.exports.getUser = getUser;

var getUsersObject = function(next) {
	database.query('SELECT id, nom, prenom, email, poste, personalProject, selfDescription, picture FROM user', function(err, rows, fields) {
		var usersObject = {};
		for (var i = rows.length - 1; i >= 0; i--) {
			usersObject[rows[i].id] = rows[i]
			rows[i].receivedPertinent = 0;
			rows[i].receivedInspiring = 0;
		};
		next(usersObject);
	});
}


// get a user whose id is userId with all his feedbacks (both sent and received by him)
module.exports.getUserWithFeedbackSentAndReceived = function (userId, next) {
	var user, usersObject;
	var getReceivedFeedback = function (user, callback){
		database.query('SELECT * FROM feedback WHERE toUser=' + user.id +' ORDER BY createdAt ASC', function(err, rowsFeedback, fields) {
			for (var i = rowsFeedback.length - 1; i >= 0; i--) {
				rowsFeedback[i].createdAtFormated = dateService.formatDate(rowsFeedback[i].createdAt);
				rowsFeedback[i].fromUserHydrated = usersObject[rowsFeedback[i].fromUser];
				user.feedbacksReceived.push(rowsFeedback[i]);
			};
			callback(null);
		});
	}

	var getSentFeedback = function (user, callback){
		database.query('SELECT * FROM feedback WHERE fromUser=' + user.id +' ORDER BY createdAt ASC', function(err, rowsFeedback, fields) {
			for (var i = rowsFeedback.length - 1; i >= 0; i--) {
				user.receivedPertinent += rowsFeedback[i].isPertinent;
				user.receivedInspiring += rowsFeedback[i].isInspiring;
				rowsFeedback[i].createdAtFormated = dateService.formatDate(rowsFeedback[i].createdAt);
				rowsFeedback[i].toUserHydrated = usersObject[rowsFeedback[i].toUser];
				user.feedbacksSent.push(rowsFeedback[i]);
			};
			callback(null);
		});
	}

	async.series([
		function(callback) {
			getUser(userId, function(_user){
				user = _user;
				callback(null)
			})
		},
		function(callback) {
			getUsersObject(function(_usersObject){
				usersObject = _usersObject;
				callback(null)
			})
		},
		function(callback) {getReceivedFeedback(user, callback)},
		function(callback) {getSentFeedback(user, callback)}
	], function(err){
		next(user);
	})
}

// returns true if the user is connected, else redirect to the login page
module.exports.checkAuth = function(req, res) {
	if (req.session.user === null || req.session.user === undefined){
		res.redirect('/login');
		return false;
	}
	return true;
};

// returns true if the connected user is coach
module.exports.isCoach = function(req, res) {
	return req.session.user !== null && req.session.user !== undefined && req.session.user.isCoach;
}

// dataRow at the format [login, nom, prenom, email, password, poste, cohorte]
var addUser = function(dataRow, reportObject, callback) {
	login = database.escape(dataRow[0]);
	prenom = database.escape(dataRow[1]);
	nom = database.escape(dataRow[2]);
	email = database.escape(dataRow[3]);
	password = database.escape(dataRow[4]);
	poste = database.escape(dataRow[5]);
	cohorte = database.escape(dataRow[6]);
	var query = 'INSERT INTO user (login, nom, prenom, email, password, poste, cohorte, isCoach) VALUES ('
	query += login + ',' + nom + ',' + prenom + ',' + email + ',' + password + ',' + poste + ',' + cohorte + ', 0)'
	database.query(query, function(err, rows, fields) {
		if (err) {
			console.log(err);
			reportObject.err.push(err);
			callback(null);
			return;
		}
		reportObject.create.push(dataRow[0]);
		callback(null);
	});
}

// dataRow at the format [login, nom, prenom, email, password, poste, cohorte]
var updateUser = function(dataRow, reportObject, callback) {
	var query = 'UPDATE user SET '
	var userFields = ['login', 'nom', 'prenom', 'email', 'password', 'poste', 'cohorte']
	for (var i = 1; i < userFields.length - 1; i++) {
		query += userFields[i] + '=' + database.escape(dataRow[i]) + ', ';
	};
	query += userFields[userFields.length - 1] + '=' + database.escape(dataRow[userFields.length - 1]);
	query += ' WHERE login=' + database.escape(dataRow[0]);

	database.query(query, function(err, rows, fields) {
		if (err) {
			console.log(err);
			reportObject.err.push(err);
			callback(null);
			return;
		}
		reportObject.update.push(dataRow[0]);
		callback(null);
	});
}

// dataRow at the format [login, nom, prenom, email, password, poste, cohorte]
module.exports.addUser = function(dataRow, reportObject, callback) {
	var login = database.escape(dataRow[0]);
	database.query('SELECT id FROM user WHERE login=' + login, function(err, rows, fields) {
		if (rows.length > 0) {
			updateUser(dataRow, reportObject, callback);
		} else {
			addUser(dataRow, reportObject, callback);
		}
	});
}

module.exports.updateDescriptionAndProject = function (userId, selfDescription, personalProject, next) {
	var query = 'UPDATE user SET selfDescription=' + database.escape(selfDescription);
	query += ', personalProject=' + database.escape(personalProject);
	query += ' WHERE id=' + userId;
	database.query(query, function(err, rows, fields) {
		next();
		if (err) {
			console.log(err);
			return;
		}
	})
}

module.exports.changePicture = function (userId, filepathProfilePicture, next) {
	var query = 'UPDATE user SET picture=' + database.escape(filepathProfilePicture);
	query += ' WHERE id=' + userId;
	console.log(query)
	database.query(query, function(err, rows, fields) {
		next();
		if (err) {
			console.log(err);
			return;
		}
	})
}

